<?php
/**
 * ============================================================================
 * ATLAS FORMS HUB — DOCUMENTS API + ADMIN PANEL
 * ============================================================================
 *
 * Install as a NEW snippet in Code Snippets → "Run everywhere".
 * Keep the existing "ATLAS SSO + FAVORITES" snippet active: this one reuses
 * its ATLAS_SSO_SECRET and its CORS / REST bypass rules.
 *
 * What it does
 *  - Stores the Forms Hub document list, categories and states in WordPress
 *    (wp_options, a few hundred KB of text — NO files are stored here; the
 *    files themselves stay in OneDrive / SharePoint).
 *  - Gives users with an allowed role an "admin session" when they enter the
 *    Forms Hub through the WordPress menu (SSO).
 *  - Exposes endpoints the Forms Hub admin panel uses to add / edit / delete
 *    documents, manage categories and states, and restore previous versions.
 *
 * Who can manage the Forms Hub (WordPress roles do NOT matter):
 *   - The owner(s) listed in atlas_fh_owner_logins() below — always.
 *   - Anyone the owner checks as "Can manage Forms Hub" in Users → Edit user.
 *   Only the owner sees that checkbox and the "Forms Hub" column in Users.
 *   Other WordPress Administrators do NOT get access unless the owner checks them.
 *
 * Direct links (user must be logged in to WordPress):
 *   https://atlasseniorliving.net/?atlas_formshub=admin              → admin panel (production)
 *   https://atlasseniorliving.net/?atlas_formshub=admin&target=local → admin panel on http://localhost:5173 (npm run dev)
 * Admins also get a "Manage Forms Hub" link in the WordPress admin bar.
 * ============================================================================
 */

if (!function_exists('atlas_fh_user_is_admin')) {

/** User meta key behind the "Can manage Forms Hub" checkbox. */
define('ATLAS_FH_MANAGER_META', 'atlas_fh_manager');

/**
 * OWNER(S): WordPress usernames that always have access and are the only ones
 * who can give or remove access to others. Add another username to share that.
 */
function atlas_fh_owner_logins() {
  return apply_filters('atlas_fh_owner_logins', ['grosales']);
}

/* ---------------------------------------------------------------------------
 * Storage helpers
 * ------------------------------------------------------------------------ */

function atlas_fh_default_settings() {
  return [
    'categories' => ['Clinical Policy', 'Job Description', 'Redirect Link'],
    'states'     => ['ALABAMA', 'FLORIDA', 'GEORGIA', 'KENTUCKY', 'MARYLAND', 'MISSISSIPPI', 'SOUTH CAROLINA', 'TENNESSEE', 'TEXAS', 'VIRGINIA'],
  ];
}

/** Returns the stored document array, or null if the list was never imported. */
function atlas_fh_get_documents() {
  $docs = get_option('atlas_fh_documents', null);
  return is_array($docs) ? $docs : null;
}

function atlas_fh_get_settings() {
  $def = atlas_fh_default_settings();
  $s   = get_option('atlas_fh_settings', null);
  if (!is_array($s)) return $def;
  return [
    'categories' => (isset($s['categories']) && is_array($s['categories'])) ? array_values($s['categories']) : $def['categories'],
    'states'     => (isset($s['states']) && is_array($s['states'])) ? array_values($s['states']) : $def['states'],
  ];
}

function atlas_fh_get_meta() {
  $m = get_option('atlas_fh_meta', []);
  return is_array($m) ? $m : [];
}

function atlas_fh_save_option($name, $value) {
  if (get_option($name, null) === null) {
    add_option($name, $value, '', false); // not autoloaded
  } else {
    update_option($name, $value, false);
  }
}

/** Public catalog returned by every endpoint so the app can refresh in one step. */
function atlas_fh_catalog() {
  $docs     = atlas_fh_get_documents();
  $settings = atlas_fh_get_settings();
  $meta     = atlas_fh_get_meta();
  return [
    'initialized' => $docs !== null,
    'documents'   => $docs ?: [],
    'categories'  => $settings['categories'],
    'states'      => $settings['states'],
    'updated_at'  => isset($meta['updated_at']) ? (int) $meta['updated_at'] : null,
    'updated_by'  => isset($meta['updated_by']) ? $meta['updated_by'] : null,
  ];
}

function atlas_fh_response($data, $status = 200) {
  $res = new WP_REST_Response($data, $status);
  $res->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  return $res;
}

/** Next unique id. Never reuses ids, so old favorites never point to a new file. */
function atlas_fh_next_id($docs) {
  $meta = atlas_fh_get_meta();
  $max  = 0;
  foreach ((array) $docs as $d) {
    if (isset($d['id']) && (int) $d['id'] > $max) $max = (int) $d['id'];
  }
  $next = max($max + 1, isset($meta['next_id']) ? (int) $meta['next_id'] : 1);
  $meta['next_id'] = $next + 1;
  atlas_fh_save_option('atlas_fh_meta', $meta);
  return $next;
}

/**
 * Saves a copy of the current state before every change (last 15 kept).
 * Each copy is its own (non-autoloaded) option so no single DB row gets big.
 */
function atlas_fh_backup_index() {
  $idx = get_option('atlas_fh_backups_index', []);
  return is_array($idx) ? $idx : [];
}

function atlas_fh_snapshot($user, $action) {
  $docs = atlas_fh_get_documents() ?: [];
  $id   = str_replace('-', '', wp_generate_uuid4());
  add_option('atlas_fh_bk_' . $id, ['documents' => $docs, 'settings' => atlas_fh_get_settings()], '', false);

  $idx = atlas_fh_backup_index();
  array_unshift($idx, ['id' => $id, 'at' => time(), 'by' => $user->display_name, 'action' => $action, 'count' => count($docs)]);
  foreach (array_slice($idx, 15) as $old) delete_option('atlas_fh_bk_' . $old['id']);
  atlas_fh_save_option('atlas_fh_backups_index', array_slice($idx, 0, 15));
}

function atlas_fh_commit($docs, $settings, $user) {
  atlas_fh_save_option('atlas_fh_documents', array_values($docs));
  if ($settings !== null) atlas_fh_save_option('atlas_fh_settings', $settings);
  $meta = atlas_fh_get_meta();
  $meta['updated_at'] = time();
  $meta['updated_by'] = $user->display_name;
  atlas_fh_save_option('atlas_fh_meta', $meta);
}

/* ---------------------------------------------------------------------------
 * Admin session (signed token handed to the React app on SSO login)
 * ------------------------------------------------------------------------ */

function atlas_fh_secret() {
  $base = defined('ATLAS_SSO_SECRET') ? ATLAS_SSO_SECRET : wp_salt('auth');
  return 'atlas-fh-admin|' . $base;
}

function atlas_fh_b64e($s) { return rtrim(strtr(base64_encode($s), '+/', '-_'), '='); }
function atlas_fh_b64d($s) {
  $pad = strlen($s) % 4;
  if ($pad) $s .= str_repeat('=', 4 - $pad);
  return base64_decode(strtr($s, '-_', '+/'), true);
}

function atlas_fh_is_owner($user) {
  return $user && ($user instanceof WP_User) && $user->exists()
    && in_array(strtolower($user->user_login), array_map('strtolower', atlas_fh_owner_logins()), true);
}

/** True for the owner(s) and for users the owner checked as "Can manage Forms Hub". */
function atlas_fh_user_is_admin($user) {
  if (!$user || !($user instanceof WP_User) || !$user->exists()) return false;
  if (atlas_fh_is_owner($user)) return true;
  return get_user_meta($user->ID, ATLAS_FH_MANAGER_META, true) === '1';
}

/* ---------------------------------------------------------------------------
 * "Can manage Forms Hub" checkbox (Users → Edit user) + "Forms Hub" column
 * ------------------------------------------------------------------------ */

function atlas_fh_profile_field($user) {
  if (!atlas_fh_is_owner(wp_get_current_user())) return; // only the owner sees it
  $is_owner = atlas_fh_is_owner($user);
  $checked  = $is_owner || get_user_meta($user->ID, ATLAS_FH_MANAGER_META, true) === '1';
  ?>
  <h2>Forms Hub</h2>
  <table class="form-table" role="presentation">
    <tr>
      <th scope="row">Forms Hub access</th>
      <td>
        <label for="atlas_fh_manager">
          <input type="checkbox" name="atlas_fh_manager" id="atlas_fh_manager" value="1" <?php checked($checked); ?> <?php disabled($is_owner); ?> />
          Can manage Forms Hub (add, edit and delete files)
        </label>
        <p class="description">
          <?php echo $is_owner
            ? 'Forms Hub owner: always has access.'
            : 'When checked, this person sees “Manage files” in the Forms Hub and “Manage Forms Hub” in the WordPress bar.'; ?>
        </p>
      </td>
    </tr>
  </table>
  <?php
}
add_action('show_user_profile', 'atlas_fh_profile_field');
add_action('edit_user_profile', 'atlas_fh_profile_field');

function atlas_fh_profile_save($user_id) {
  // WordPress already verified the profile form nonce before these hooks run.
  if (!atlas_fh_is_owner(wp_get_current_user()) || !current_user_can('edit_user', $user_id)) return;
  if (atlas_fh_is_owner(get_userdata($user_id))) return; // owners don't need the flag
  if (!empty($_POST['atlas_fh_manager'])) update_user_meta($user_id, ATLAS_FH_MANAGER_META, '1');
  else delete_user_meta($user_id, ATLAS_FH_MANAGER_META);
}
add_action('personal_options_update', 'atlas_fh_profile_save');
add_action('edit_user_profile_update', 'atlas_fh_profile_save');

add_filter('manage_users_columns', function ($cols) {
  if (atlas_fh_is_owner(wp_get_current_user())) $cols['atlas_fh'] = 'Forms Hub';
  return $cols;
}, 99);
add_filter('manage_users_custom_column', function ($out, $col, $user_id) {
  if ($col !== 'atlas_fh') return $out;
  $u = get_userdata($user_id);
  if (atlas_fh_is_owner($u)) return '✓ <span style="color:#646970">(Owner)</span>';
  return atlas_fh_user_is_admin($u) ? '✓ Can manage' : '—';
}, 10, 3);

function atlas_fh_issue_session($user) {
  $exp     = time() + 8 * HOUR_IN_SECONDS;
  $payload = atlas_fh_b64e(wp_json_encode(['uid' => $user->ID, 'exp' => $exp]));
  return [
    'token' => $payload . '.' . hash_hmac('sha256', $payload, atlas_fh_secret()),
    'exp'   => $exp,
    'name'  => $user->display_name,
  ];
}

/** Returns the WP_User behind the session token in the JSON body, or WP_Error. */
function atlas_fh_auth(WP_REST_Request $req) {
  $p     = $req->get_json_params();
  $token = (is_array($p) && isset($p['session'])) ? (string) $p['session'] : '';
  $again = 'Please open the Forms Hub again from the WordPress menu.';

  if (!$token || strpos($token, '.') === false)
    return new WP_Error('atlas_fh_no_session', 'Your admin session is missing. ' . $again, ['status' => 401]);

  list($payload, $sig) = explode('.', $token, 2);
  if (!hash_equals(hash_hmac('sha256', $payload, atlas_fh_secret()), $sig))
    return new WP_Error('atlas_fh_bad_session', 'Your admin session is not valid. ' . $again, ['status' => 401]);

  $data = json_decode((string) atlas_fh_b64d($payload), true);
  if (!is_array($data) || empty($data['uid']) || empty($data['exp']))
    return new WP_Error('atlas_fh_bad_session', 'Your admin session is not valid. ' . $again, ['status' => 401]);

  if (time() > (int) $data['exp'])
    return new WP_Error('atlas_fh_expired', 'Your admin session expired. ' . $again, ['status' => 401]);

  $user = get_userdata((int) $data['uid']);
  if (!atlas_fh_user_is_admin($user))
    return new WP_Error('atlas_fh_forbidden', 'Your WordPress account does not have permission to manage the Forms Hub.', ['status' => 403]);

  return $user;
}

function atlas_fh_permission(WP_REST_Request $req) {
  $u = atlas_fh_auth($req);
  return is_wp_error($u) ? $u : true;
}

/** Adds admin_session to the existing sso/validar response — no need to edit the SSO snippet. */
add_filter('rest_post_dispatch', function ($response, $server, $request) {
  if ($request->get_route() !== '/atlas/v1/sso/validar') return $response;
  if (!($response instanceof WP_REST_Response) || $response->get_status() !== 200) return $response;

  $data = $response->get_data();
  if (empty($data['valid']) || empty($data['user']['id'])) return $response;

  $user = get_userdata((int) $data['user']['id']);
  $data['forms_admin'] = atlas_fh_user_is_admin($user);
  if ($data['forms_admin']) $data['admin_session'] = atlas_fh_issue_session($user);

  $response->set_data($data);
  return $response;
}, 10, 3);

/* ---------------------------------------------------------------------------
 * Validation
 * ------------------------------------------------------------------------ */

function atlas_fh_letter($name) {
  return preg_match('/[A-Za-z]/', $name, $m) ? strtoupper($m[0]) : '#';
}

function atlas_fh_clean_text($v, $max) {
  $v = trim(sanitize_text_field((string) $v));
  return function_exists('mb_substr') ? mb_substr($v, 0, $max) : substr($v, 0, $max);
}

function atlas_fh_clean_link($link) {
  $link = trim((string) $link);
  if (!preg_match('#^https?://#i', $link)) return '';
  $link = esc_url_raw($link, ['http', 'https']);
  return filter_var($link, FILTER_VALIDATE_URL) ? $link : '';
}

/**
 * Validates one document coming from the admin form.
 * Returns a clean array or WP_Error with a friendly message.
 */
function atlas_fh_clean_doc($in, $settings) {
  if (!is_array($in)) return new WP_Error('atlas_fh_invalid', 'Missing document data.', ['status' => 400]);

  $nombre = atlas_fh_clean_text($in['nombre'] ?? '', 200);
  if ($nombre === '') return new WP_Error('atlas_fh_invalid', 'Please enter a file name.', ['status' => 400]);

  $link = atlas_fh_clean_link($in['link'] ?? '');
  if ($link === '') return new WP_Error('atlas_fh_invalid', 'The link is not valid. It must start with https://', ['status' => 400]);

  $dep = atlas_fh_clean_text($in['departamento'] ?? '', 60);
  if ($dep !== '' && !in_array($dep, $settings['categories'], true))
    return new WP_Error('atlas_fh_invalid', 'That category does not exist anymore. Please pick another one.', ['status' => 400]);

  $estado = atlas_fh_clean_text($in['estado'] ?? '', 60);
  if ($estado !== '' && !in_array($estado, $settings['states'], true))
    return new WP_Error('atlas_fh_invalid', 'That state does not exist anymore. Please pick another one.', ['status' => 400]);

  $tag = strtoupper(atlas_fh_clean_text($in['tag'] ?? '', 10));
  if (!in_array($tag, ['', 'NEW', 'UPDATED'], true)) $tag = '';

  $doc = [
    'nombre'       => $nombre,
    'letra'        => atlas_fh_letter($nombre),
    'link'         => $link,
    'departamento' => $dep,
  ];
  if ($estado !== '') $doc['estado'] = $estado;
  if ($tag !== '')    $doc['tag']    = $tag;
  return $doc;
}

function atlas_fh_clean_list($list, $upper = false) {
  $out = [];
  foreach ((array) $list as $item) {
    $v = atlas_fh_clean_text($item, 60);
    if ($upper) $v = strtoupper($v);
    if ($v !== '' && strtolower($v) !== 'all' && !in_array($v, $out, true)) $out[] = $v;
  }
  return array_slice($out, 0, 60);
}

function atlas_fh_find_index($docs, $id) {
  foreach ($docs as $i => $d) {
    if (isset($d['id']) && (int) $d['id'] === (int) $id) return $i;
  }
  return -1;
}

function atlas_fh_require_initialized() {
  if (atlas_fh_get_documents() === null)
    return new WP_Error('atlas_fh_not_initialized', 'The document list has not been imported yet. Use "Import current files" first.', ['status' => 409]);
  return true;
}

/* ---------------------------------------------------------------------------
 * Endpoint callbacks
 * ------------------------------------------------------------------------ */

function atlas_fh_ep_whoami(WP_REST_Request $req) {
  $user = atlas_fh_auth($req);
  return atlas_fh_response([
    'admin'   => true,
    'session' => atlas_fh_issue_session($user), // refreshed: 8 more hours
  ]);
}

function atlas_fh_ep_save(WP_REST_Request $req) {
  $user = atlas_fh_auth($req);
  $ok   = atlas_fh_require_initialized();
  if (is_wp_error($ok)) return $ok;

  $p        = $req->get_json_params();
  $in       = isset($p['document']) ? $p['document'] : null;
  $settings = atlas_fh_get_settings();
  $clean    = atlas_fh_clean_doc($in, $settings);
  if (is_wp_error($clean)) return $clean;

  $docs  = atlas_fh_get_documents();
  $id    = isset($in['id']) ? (int) $in['id'] : 0;
  $clean['updated_at'] = time();
  $clean['updated_by'] = $user->display_name;

  if ($id) {
    $idx = atlas_fh_find_index($docs, $id);
    if ($idx < 0) return new WP_Error('atlas_fh_not_found', 'This file no longer exists. It may have been deleted by someone else.', ['status' => 404]);
    $prev = $docs[$idx];
    if (!empty($clean['tag'])) {
      // Badge keeps its original date unless the badge or the link changed
      $same = ($prev['tag'] ?? '') === $clean['tag'] && $prev['link'] === $clean['link'] && !empty($prev['tag_at']);
      $clean['tag_at'] = $same ? (int) $prev['tag_at'] : time();
    }
    atlas_fh_snapshot($user, 'Edited "' . $prev['nombre'] . '"');
    $docs[$idx] = array_merge(['id' => $id], $clean);
    $message = 'Changes saved.';
  } else {
    if (!empty($clean['tag'])) $clean['tag_at'] = time();
    atlas_fh_snapshot($user, 'Added "' . $clean['nombre'] . '"');
    $id = atlas_fh_next_id($docs);
    $docs[] = array_merge(['id' => $id], $clean);
    $message = 'File added.';
  }

  atlas_fh_commit($docs, null, $user);
  return atlas_fh_response(array_merge(atlas_fh_catalog(), ['message' => $message, 'saved_id' => $id]));
}

function atlas_fh_ep_delete(WP_REST_Request $req) {
  $user = atlas_fh_auth($req);
  $ok   = atlas_fh_require_initialized();
  if (is_wp_error($ok)) return $ok;

  $p    = $req->get_json_params();
  $id   = isset($p['id']) ? (int) $p['id'] : 0;
  $docs = atlas_fh_get_documents();
  $idx  = atlas_fh_find_index($docs, $id);
  if ($idx < 0) return new WP_Error('atlas_fh_not_found', 'This file no longer exists.', ['status' => 404]);

  atlas_fh_snapshot($user, 'Deleted "' . $docs[$idx]['nombre'] . '"');
  array_splice($docs, $idx, 1);
  atlas_fh_commit($docs, null, $user);
  return atlas_fh_response(array_merge(atlas_fh_catalog(), ['message' => 'File deleted.']));
}

/**
 * Saves categories and states. Body:
 *   categories: [..], states: [..],
 *   renames: { categories: {old: new}, states: {old: new} }
 * Files using a renamed value are updated; files using a removed value are cleared.
 */
function atlas_fh_ep_settings(WP_REST_Request $req) {
  $user = atlas_fh_auth($req);
  $p    = $req->get_json_params();

  $categories = atlas_fh_clean_list($p['categories'] ?? []);
  $states     = atlas_fh_clean_list($p['states'] ?? [], true);
  $renames    = (isset($p['renames']) && is_array($p['renames'])) ? $p['renames'] : [];
  $renCat     = isset($renames['categories']) && is_array($renames['categories']) ? $renames['categories'] : [];
  $renState   = isset($renames['states']) && is_array($renames['states']) ? $renames['states'] : [];

  atlas_fh_snapshot($user, 'Changed categories / states');

  $docs = atlas_fh_get_documents();
  if ($docs !== null) {
    foreach ($docs as &$d) {
      $dep = isset($d['departamento']) ? $d['departamento'] : '';
      if ($dep !== '' && isset($renCat[$dep])) $dep = atlas_fh_clean_text($renCat[$dep], 60);
      $d['departamento'] = in_array($dep, $categories, true) ? $dep : '';

      if (!empty($d['estado'])) {
        $st = $d['estado'];
        if (isset($renState[$st])) $st = strtoupper(atlas_fh_clean_text($renState[$st], 60));
        if (in_array($st, $states, true)) $d['estado'] = $st; else unset($d['estado']);
      }
    }
    unset($d);
  }

  atlas_fh_commit($docs !== null ? $docs : [], ['categories' => $categories, 'states' => $states], $user);
  if ($docs === null) delete_option('atlas_fh_documents'); // keep "not imported yet" state

  return atlas_fh_response(array_merge(atlas_fh_catalog(), ['message' => 'Categories and states saved.']));
}

/** One-time import of the list that is currently hard-coded in the app. */
function atlas_fh_ep_import(WP_REST_Request $req) {
  $user = atlas_fh_auth($req);
  $p    = $req->get_json_params();
  $replace = !empty($p['replace']);

  if (atlas_fh_get_documents() !== null && !$replace)
    return new WP_Error('atlas_fh_already', 'The document list was already imported.', ['status' => 409]);

  $in = isset($p['documents']) && is_array($p['documents']) ? array_slice($p['documents'], 0, 5000) : [];
  $docs = [];
  $seen = [];
  $skipped = 0;
  foreach ($in as $d) {
    if (!is_array($d) || empty($d['id'])) { $skipped++; continue; }
    $id     = (int) $d['id'];
    $nombre = atlas_fh_clean_text($d['nombre'] ?? '', 200);
    $link   = atlas_fh_clean_link($d['link'] ?? '');
    if (!$id || isset($seen[$id]) || $nombre === '' || $link === '') { $skipped++; continue; }
    $seen[$id] = true;
    $doc = [
      'id'           => $id,
      'nombre'       => $nombre,
      'link'         => $link,
      'departamento' => atlas_fh_clean_text($d['departamento'] ?? '', 60),
    ];
    if (!empty($d['letra']))  $doc['letra']  = strtoupper(atlas_fh_clean_text($d['letra'], 2));
    if (!empty($d['estado'])) $doc['estado'] = strtoupper(atlas_fh_clean_text($d['estado'], 60));
    if (!empty($d['tag']))    $doc['tag']    = strtoupper(atlas_fh_clean_text($d['tag'], 10));
    $docs[] = $doc;
  }

  if (!$docs) return new WP_Error('atlas_fh_invalid', 'No valid files to import.', ['status' => 400]);

  atlas_fh_snapshot($user, $replace ? 'Replaced the whole list (import)' : 'First import');
  $settings = null;
  if (isset($p['categories']) || isset($p['states'])) {
    $cur = atlas_fh_get_settings();
    $settings = [
      'categories' => isset($p['categories']) ? atlas_fh_clean_list($p['categories']) : $cur['categories'],
      'states'     => isset($p['states']) ? atlas_fh_clean_list($p['states'], true) : $cur['states'],
    ];
  }
  atlas_fh_commit($docs, $settings, $user);
  atlas_fh_next_id($docs); // move the id counter past the imported ids

  return atlas_fh_response(array_merge(atlas_fh_catalog(), [
    'message' => sprintf('%d files imported.%s', count($docs), $skipped ? " $skipped skipped (missing name or link)." : ''),
  ]));
}

function atlas_fh_ep_backups(WP_REST_Request $req) {
  atlas_fh_auth($req);
  return atlas_fh_response(['backups' => atlas_fh_backup_index()]);
}

function atlas_fh_ep_restore(WP_REST_Request $req) {
  $user = atlas_fh_auth($req);
  $p    = $req->get_json_params();
  $id   = isset($p['id']) ? preg_replace('/[^a-f0-9]/', '', (string) $p['id']) : '';

  $meta = null;
  foreach (atlas_fh_backup_index() as $b) {
    if ($b['id'] === $id) { $meta = $b; break; }
  }
  $data = $meta ? get_option('atlas_fh_bk_' . $id, null) : null;
  if (!$meta || !is_array($data)) return new WP_Error('atlas_fh_not_found', 'That version is no longer available.', ['status' => 404]);

  atlas_fh_snapshot($user, 'Restored the version from ' . wp_date('M j, Y g:i a', (int) $meta['at']));
  atlas_fh_commit($data['documents'], $data['settings'], $user);
  return atlas_fh_response(array_merge(atlas_fh_catalog(), ['message' => 'Previous version restored.']));
}

/* ---------------------------------------------------------------------------
 * Local testing (npm run dev on http://localhost:5173)
 * The SSO snippet only answers browser "preflight" checks for the production
 * domain. This lets the local dev server talk to the atlas/v1 endpoints too.
 * Remove the origins from this list to turn it off.
 * ------------------------------------------------------------------------ */

function atlas_fh_dev_origins() {
  return apply_filters('atlas_fh_dev_origins', ['http://localhost:5173', 'http://127.0.0.1:5173']);
}

add_action('init', function () {
  $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
  $uri    = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
  if (!$origin || !in_array($origin, atlas_fh_dev_origins(), true)) return;
  if (strpos($uri, 'atlas/v1/') === false) return;

  header('Access-Control-Allow-Origin: ' . $origin);
  header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type');
  header('Vary: Origin');
  if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    status_header(200);
    exit();
  }
}, 1); // before the SSO snippet's CORS handler

/* ---------------------------------------------------------------------------
 * Direct link:  /?atlas_formshub=admin   (or =hub)   [&target=local]
 * Logs the user into the Forms Hub (same SSO token as the menu button) and
 * opens the admin panel. Not logged in → WordPress login first.
 * ------------------------------------------------------------------------ */

add_action('template_redirect', function () {
  if (!isset($_GET['atlas_formshub'])) return;
  if (!is_user_logged_in()) { auth_redirect(); exit; }

  $local = isset($_GET['target']) && $_GET['target'] === 'local';
  $user  = wp_get_current_user();
  if ($local && !atlas_fh_user_is_admin($user))
    wp_die('Only Forms Hub admins can open the local test version.', 'Forms Hub', ['response' => 403]);
  if (!function_exists('atlas_generate_sso_token'))
    wp_die('The "ATLAS SSO + FAVORITES" snippet is not active.', 'Forms Hub', ['response' => 500]);

  $data  = atlas_generate_sso_token()->get_data();
  $base  = $local ? 'http://localhost:5173/' : 'https://formshub.atlasseniorliving.net/';
  $url   = $base . '?sso_token=' . rawurlencode($data['token']);
  if ($_GET['atlas_formshub'] === 'admin') $url .= '#/admin';

  nocache_headers();
  wp_redirect($url);
  exit;
});

add_action('admin_bar_menu', function ($bar) {
  if (!atlas_fh_user_is_admin(wp_get_current_user())) return;
  $bar->add_node([
    'id'    => 'atlas-formshub-admin',
    'title' => '📁 Manage Forms Hub',
    'href'  => home_url('/?atlas_formshub=admin'),
    'meta'  => ['target' => '_blank'],
  ]);
}, 100);

/* ---------------------------------------------------------------------------
 * Routes  (all writes are POST + JSON so the existing CORS rules work as-is)
 * ------------------------------------------------------------------------ */

add_action('rest_api_init', function () {
  register_rest_route('atlas/v1', '/forms/documents', [
    'methods'             => 'GET',
    'callback'            => fn() => atlas_fh_response(atlas_fh_catalog()),
    'permission_callback' => '__return_true',
  ]);

  $admin_routes = [
    '/forms/whoami'           => 'atlas_fh_ep_whoami',
    '/forms/documents/save'   => 'atlas_fh_ep_save',
    '/forms/documents/delete' => 'atlas_fh_ep_delete',
    '/forms/settings/save'    => 'atlas_fh_ep_settings',
    '/forms/import'           => 'atlas_fh_ep_import',
    '/forms/backups'          => 'atlas_fh_ep_backups',
    '/forms/backups/restore'  => 'atlas_fh_ep_restore',
  ];
  foreach ($admin_routes as $route => $cb) {
    register_rest_route('atlas/v1', $route, [
      'methods'             => 'POST',
      'callback'            => $cb,
      'permission_callback' => 'atlas_fh_permission',
    ]);
  }
});

} // function_exists guard
