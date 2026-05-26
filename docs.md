# Atlas Senior Living — Forms Hub SSO Documentation

**Version:** 1.0  
**Developed by:** Gabriel Rosales | Fernando Patiño  
**Date:** May 2026  

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [User Flow](#3-user-flow)
4. [WordPress Setup](#4-wordpress-setup)
   - 4.1 [Code Snippets Plugin](#41-code-snippets-plugin)
   - 4.2 [Secret Key](#42-secret-key)
   - 4.3 [CORS Configuration](#43-cors-configuration)
   - 4.4 [REST API Endpoints](#44-rest-api-endpoints)
   - 4.5 [Full PHP Snippet](#45-full-php-snippet)
5. [Menu Button Setup](#5-menu-button-setup)
   - 5.1 [Custom Link in WordPress Menu](#51-custom-link-in-wordpress-menu)
   - 5.2 [JavaScript — Custom CSS & JS Plugin](#52-javascript--custom-css--js-plugin)
6. [React App Changes](#6-react-app-changes)
   - 6.1 [WordPress URL Config](#61-wordpress-url-config)
   - 6.2 [New States and Refs](#62-new-states-and-refs)
   - 6.3 [SSO Token Validation](#63-sso-token-validation)
   - 6.4 [Favorites Sync with WordPress](#64-favorites-sync-with-wordpress)
   - 6.5 [Loading Screen](#65-loading-screen)
   - 6.6 [Logout Handler](#66-logout-handler)
7. [Favorites Storage](#7-favorites-storage)
8. [Logout Behavior](#8-logout-behavior)
9. [Deployment](#9-deployment)
10. [Troubleshooting](#10-troubleshooting)
11. [Files Modified Summary](#11-files-modified-summary)

---

## 1. Project Overview

This document describes the **Single Sign-On (SSO) integration** between the Atlas Senior Living internal WordPress site and the **Forms Hub** React application.

| Component | Technology | URL |
|---|---|---|
| Internal Site | WordPress | `atlasseniorliving.net` |
| Files Manager | React (Vite) | `formshub.atlasseniorliving.net` |

### Goals

- Employees logged into WordPress can access the Forms Hub **without re-entering credentials**.
- Each user's **favorite files are synced** across any device or browser via their WordPress account.
- When a user **logs out of WordPress**, their Forms Hub session is also closed.

---

## 2. Architecture

```
┌─────────────────────────────┐        ┌──────────────────────────────────┐
│   WordPress (Internal Site) │        │   React App (Forms Hub)          │
│   atlasseniorliving.net     │        │   formshub.atlasseniorliving.net │
│                             │        │                                  │
│  ┌─────────────────────┐    │        │  ┌────────────────────────────┐  │
│  │ Code Snippets Plugin│    │        │  │ App.jsx                    │  │
│  │                     │    │        │  │                            │  │
│  │ /atlas/v1/          │◄───┼────────┼──│ 1. Reads ?sso_token= URL  │  │
│  │   sso/generar       │    │        │  │ 2. POST to sso/validar     │  │
│  │   sso/validar       │    │        │  │ 3. Stores session          │  │
│  │   sso/check         │    │        │  │ 4. Loads WP favorites      │  │
│  │   favorites (GET)   │    │        │  │ 5. Syncs favorites on save │  │
│  │   favorites (POST)  │    │        │  └────────────────────────────┘  │
│  └─────────────────────┘    │        └──────────────────────────────────┘
│                             │
│  ┌─────────────────────┐    │
│  │ Custom CSS & JS     │    │
│  │ abrirFormsHub()     │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │ Navigation Menu     │    │
│  │ "Forms Hub 2026"    │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

---

## 3. User Flow

```
1. Employee logs into WordPress
         │
         ▼
2. Clicks "Forms Hub 2026" in the WP navigation menu
         │
         ▼
3. JavaScript calls /atlas/v1/sso/generar
   WordPress generates a signed token (valid 5 min, single-use)
         │
         ▼
4. Browser opens formshub.atlasseniorliving.net/?sso_token=xxxxx
         │
         ▼
5. React reads the token from the URL
   Sends it to WordPress: POST /atlas/v1/sso/validar
         │
         ├── Invalid / Expired ──► Show login screen
         │
         ▼ Valid
6. React stores session in localStorage
   Loads user's favorites from /atlas/v1/favorites
         │
         ▼
7. User is inside the Forms Hub ✓
   Favorites are synced to WordPress on every change
         │
         ▼
8. User logs out of WordPress
   WordPress redirects to formshub.atlasseniorliving.net/?logout=true
   React clears session → shows login screen
```

> **Security note:** Tokens are single-use and expire after 5 minutes. Once validated, they are immediately deleted from the WordPress database to prevent reuse.

---

## 4. WordPress Setup

### 4.1 Code Snippets Plugin

All WordPress PHP code is managed via the **Code Snippets** plugin — no hosting access or theme file editing required.

**Installation:**
1. Go to **Plugins → Add New** in the WordPress admin panel
2. Search for **Code Snippets** and install it (free, wordpress.org)
3. Go to **Snippets → Add New**
4. Paste the full PHP code (see Section 4.5)
5. Set **Run snippet** to `Run everywhere`
6. Click **Save Changes & Activate**

---

### 4.2 Secret Key

A private secret key is defined at the top of the snippet. It is used to **sign and verify** all SSO tokens using HMAC-SHA256.

```php
define('ATLAS_SSO_SECRET', 'your-private-random-key-here');
```

> ⚠️ This key must be kept private and never shared. If it is compromised, replace it immediately and all active tokens will be automatically invalidated.

---

### 4.3 CORS Configuration

Since the React app (`formshub.atlasseniorliving.net`) makes cross-origin requests to WordPress (`atlasseniorliving.net`), CORS headers are required. They are set via the `init` hook with high priority to correctly handle browser preflight `OPTIONS` requests.

```php
add_action('init', function() {
  if (isset($_SERVER['HTTP_ORIGIN'])) {
    $allowed = 'https://formshub.atlasseniorliving.net';
    if ($_SERVER['HTTP_ORIGIN'] === $allowed) {
      header("Access-Control-Allow-Origin: $allowed");
      header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
      header('Access-Control-Allow-Headers: Content-Type, X-WP-Nonce');
      header('Access-Control-Allow-Credentials: true');
    }
  }
  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    status_header(200);
    exit();
  }
});
```

---

### 4.4 REST API Endpoints

The snippet registers custom endpoints under the `atlas/v1` namespace:

| Endpoint | Method | Auth Required | Description |
|---|---|---|---|
| `/atlas/v1/sso/generar` | GET | WP logged in | Generates a signed single-use SSO token for the current WP user |
| `/atlas/v1/sso/validar` | POST | None | Validates a token sent by React. Returns user data. Deletes token after use. |
| `/atlas/v1/sso/check` | GET | None | Returns `logged_in: true/false` for the current WP session |
| `/atlas/v1/favorites` | GET | None | Returns saved favorites for a given `user_id` from `user_meta` |
| `/atlas/v1/favorites` | POST | None | Saves favorites array to `user_meta` for a given `user_id` |

All `atlas/v1` routes bypass WordPress REST API security restrictions via a priority-999 filter, allowing non-admin users (subscribers, editors, etc.) to access them.

---

### 4.5 Full PHP Snippet

```php
define('ATLAS_SSO_SECRET', 'your-private-key-here');

// ATLAS SSO + FAVORITES | Fernando Patiño

// CORS
add_action('init', function() {
  if (isset($_SERVER['HTTP_ORIGIN'])) {
    $allowed = 'https://formshub.atlasseniorliving.net';
    if ($_SERVER['HTTP_ORIGIN'] === $allowed) {
      header("Access-Control-Allow-Origin: $allowed");
      header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
      header('Access-Control-Allow-Headers: Content-Type, X-WP-Nonce');
      header('Access-Control-Allow-Credentials: true');
    }
  }
  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    status_header(200);
    exit();
  }
});

// Allow all logged-in users (any role) to access atlas/v1 endpoints
add_filter('rest_authentication_errors', function($result) {
  $route = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
  if (strpos($route, '/atlas/v1/') !== false) {
    return null;
  }
  return $result;
}, 999);

// Inject WP nonce into page for authenticated JS requests
add_action('wp_head', function() {
  if (!is_user_logged_in()) return;
  ?>
  <script>
    var wpApiSettings = { nonce: '<?php echo wp_create_nonce("wp_rest"); ?>' };
  </script>
  <?php
});

// REST API endpoints
add_action('rest_api_init', function () {

  register_rest_route('atlas/v1', '/sso/generar', [
    'methods'             => 'GET',
    'callback'            => 'atlas_generate_sso_token',
    'permission_callback' => fn() => is_user_logged_in(),
  ]);

  register_rest_route('atlas/v1', '/sso/validar', [
    'methods'             => 'POST',
    'callback'            => 'atlas_validate_sso_token',
    'permission_callback' => '__return_true',
  ]);

  register_rest_route('atlas/v1', '/sso/check', [
    'methods'             => 'GET',
    'callback'            => fn() => new WP_REST_Response(['logged_in' => is_user_logged_in()], 200),
    'permission_callback' => '__return_true',
  ]);

  register_rest_route('atlas/v1', '/favorites', [
    'methods'             => 'GET',
    'callback'            => 'atlas_get_favorites',
    'permission_callback' => '__return_true',
  ]);

  register_rest_route('atlas/v1', '/favorites', [
    'methods'             => 'POST',
    'callback'            => 'atlas_save_favorites',
    'permission_callback' => '__return_true',
  ]);

});

function atlas_generate_sso_token() {
  $user  = wp_get_current_user();
  $nonce = wp_generate_uuid4();
  $data  = base64_encode(json_encode([
    'user_id'    => $user->ID,
    'email'      => $user->user_email,
    'name'       => $user->display_name,
    'roles'      => $user->roles,
    'expires_at' => time() + 300, // 5 minutes
    'nonce'      => $nonce,
  ]));
  $signature = hash_hmac('sha256', $data, ATLAS_SSO_SECRET);
  $token     = $data . '.' . $signature;

  set_transient('atlas_sso_' . $nonce, $token, 300);
  wp_cache_set('atlas_sso_' . $nonce, $token, 'atlas_sso', 300);

  return new WP_REST_Response(['token' => $token], 200);
}

function atlas_validate_sso_token(WP_REST_Request $req) {
  $body       = json_decode($req->get_body(), true);
  $full_token = isset($body['token']) ? trim($body['token']) : '';

  if (!$full_token || !str_contains($full_token, '.'))
    return new WP_REST_Response(['error' => 'Invalid token'], 401);

  [$data, $received_signature] = explode('.', $full_token, 2);

  $expected = hash_hmac('sha256', $data, ATLAS_SSO_SECRET);
  if (!hash_equals($expected, $received_signature))
    return new WP_REST_Response(['error' => 'Invalid signature'], 401);

  $payload = json_decode(base64_decode($data), true);
  if (!$payload)
    return new WP_REST_Response(['error' => 'Invalid payload'], 401);

  if (time() > $payload['expires_at'])
    return new WP_REST_Response(['error' => 'Token expired'], 401);

  $stored = get_transient('atlas_sso_' . $payload['nonce']);
  if (!$stored) {
    $stored = wp_cache_get('atlas_sso_' . $payload['nonce'], 'atlas_sso');
  }

  if (!$stored)
    return new WP_REST_Response(['error' => 'Token not found'], 401);

  if ($stored !== $full_token)
    return new WP_REST_Response(['error' => 'Token mismatch'], 401);

  // Single-use: delete after successful validation
  delete_transient('atlas_sso_' . $payload['nonce']);
  wp_cache_delete('atlas_sso_' . $payload['nonce'], 'atlas_sso');

  return new WP_REST_Response(['valid' => true, 'user' => [
    'id'    => $payload['user_id'],
    'email' => $payload['email'],
    'name'  => $payload['name'],
  ]], 200);
}

function atlas_get_favorites(WP_REST_Request $req) {
  $user_id = intval($req->get_param('user_id'));
  if (!$user_id) return new WP_REST_Response(['error' => 'Missing user_id'], 400);

  $favs = get_user_meta($user_id, 'atlas_forms_favorites', true);
  return new WP_REST_Response([
    'favorites' => $favs ? json_decode($favs, true) : []
  ], 200);
}

function atlas_save_favorites(WP_REST_Request $req) {
  $user_id   = intval($req->get_param('user_id'));
  $favorites = $req->get_param('favorites');
  if (!$user_id) return new WP_REST_Response(['error' => 'Missing user_id'], 400);

  update_user_meta($user_id, 'atlas_forms_favorites', json_encode($favorites));
  return new WP_REST_Response(['success' => true], 200);
}

add_shortcode('atlas_forms_hub', function() {
  if (!is_user_logged_in()) return '';
  ob_start(); ?>
  <a href="javascript:void(0)" onclick="abrirFormsHub(event)" style="display:inline-block;padding:10px 20px;background:#2563eb;color:white;border-radius:8px;font-weight:bold;text-decoration:none;">
    📁 Forms Hub
  </a>
  <?php return ob_get_clean();
});

// Close Forms Hub session when user logs out of WordPress
add_action('wp_logout', function() {
  wp_redirect('https://formshub.atlasseniorliving.net/?logout=true');
  exit();
});
```

---

## 5. Menu Button Setup

### 5.1 Custom Link in WordPress Menu

Go to **Appearance → Menus**, add a **Custom Link** with:

| Field | Value |
|---|---|
| URL | `javascript:void(0)` |
| Link Text | `Forms Hub 2026` |

> The text must be **exactly** `Forms Hub 2026` — the JavaScript looks for this exact string.

---

### 5.2 JavaScript — Custom CSS & JS Plugin

Add this in the **Custom CSS & JS** plugin under the **JavaScript** tab:

```javascript
async function abrirFormsHub(e) {
  e.preventDefault();
  e.stopPropagation();
  try {
    const res = await fetch('/wp-json/atlas/v1/sso/generar', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-WP-Nonce': wpApiSettings?.nonce || ''
      }
    });
    if (!res.ok) {
      console.error('SSO error:', res.status);
      return;
    }
    const data = await res.json();
    if (data.token) {
      window.open(
        'https://formshub.atlasseniorliving.net/?sso_token=' + encodeURIComponent(data.token),
        '_blank'
      );
    }
  } catch(err) {
    console.error('Forms Hub error:', err);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a').forEach(function(el) {
    if (el.textContent.trim() === 'Forms Hub 2026') {
      el.href = 'javascript:void(0)';
      el.addEventListener('click', abrirFormsHub);
    }
  });
});
```

---

## 6. React App Changes

All changes were made exclusively in `src/App.jsx`. No new files or dependencies were added.

### 6.1 WordPress URL Config

Added at the top of the file, before the component:

```javascript
// --- SSO CONFIG ---
// Internal WordPress site URL
const WP_URL = 'https://atlasseniorliving.net';
```

---

### 6.2 New States and Refs

Added inside the `App()` component:

```javascript
const [ssoLoading, setSsoLoading] = useState(false);
const ssoValidatingRef = useRef(false); // Prevents double-validation in React StrictMode
```

---

### 6.3 SSO Token Validation

A `useEffect` runs once on mount. It checks the URL for `?sso_token=` or `?logout=true`:

```javascript
// --- SSO: Verify WordPress token from URL ---
useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  // Handle logout redirect from WordPress
  if (params.get('logout') === 'true') {
    localStorage.removeItem('atlas_session');
    localStorage.removeItem('atlas_user');
    setAutenticado(false);
    window.history.replaceState({}, document.title, window.location.pathname);
    return;
  }

  const token = params.get('sso_token');
  if (!token || autenticado) return;

  // Prevent double call (React StrictMode renders twice in dev)
  if (ssoValidatingRef.current) return;
  ssoValidatingRef.current = true;

  setSsoLoading(true);

  fetch(`${WP_URL}/wp-json/atlas/v1/sso/validar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
    .then(r => r.json())
    .then(data => {
      if (data.valid) {
        localStorage.setItem('atlas_session', 'true');
        localStorage.setItem('atlas_user', JSON.stringify(data.user));
        setAutenticado(true);
        // Clean token from URL without reloading
        window.history.replaceState({}, document.title, window.location.pathname);

        // Load user favorites from WordPress
        if (data.user?.id) {
          fetch(`${WP_URL}/wp-json/atlas/v1/favorites?user_id=${data.user.id}`)
            .then(r => r.json())
            .then(favData => {
              if (favData.favorites?.length) {
                setFavoritos(favData.favorites);
                localStorage.setItem('atlas_favs', JSON.stringify(favData.favorites));
              }
            })
            .catch(() => {});
        }
      } else {
        window.history.replaceState({}, document.title, window.location.pathname);
        ssoValidatingRef.current = false;
      }
    })
    .catch(() => {
      window.history.replaceState({}, document.title, window.location.pathname);
      ssoValidatingRef.current = false;
    })
    .finally(() => setSsoLoading(false));

// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

---

### 6.4 Favorites Sync with WordPress

The existing `favoritos` useEffect was updated to also sync to WordPress:

```javascript
useEffect(() => {
  // Always save to localStorage as cache
  localStorage.setItem('atlas_favs', JSON.stringify(favoritos));

  const user = JSON.parse(localStorage.getItem('atlas_user') || '{}');
  if (!user?.id) return; // No SSO session — save locally only

  // Debounced sync to WordPress (800ms to avoid spamming on rapid changes)
  const timer = setTimeout(() => {
    fetch(`${WP_URL}/wp-json/atlas/v1/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, favorites: favoritos }),
    }).catch(() => {}); // Fail silently
  }, 800);

  return () => clearTimeout(timer);
}, [favoritos]);
```

---

### 6.5 Loading Screen

While the SSO token is being validated, a full-screen loading state prevents the login screen from flashing:

```jsx
if (ssoLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] font-sans antialiased p-4">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-pulse">🔐</div>
        <p className="text-white font-bold text-lg">Verifying session...</p>
        <p className="text-slate-500 text-sm mt-2">Connecting with your organization account</p>
      </div>
    </div>
  );
}
```

---

### 6.6 Logout Handler

The existing `handleLogout` function was updated to also clear the user data:

```javascript
const handleLogout = () => {
  localStorage.removeItem('atlas_session');
  localStorage.removeItem('atlas_user');
  setAutenticado(false);
};
```

---

## 7. Favorites Storage

Favorites are stored in two places simultaneously:

| Storage | Purpose | Key |
|---|---|---|
| **WordPress `user_meta`** | Primary — persists across all devices and browsers | `atlas_forms_favorites` |
| **`localStorage`** | Cache — instant load without waiting for API response | `atlas_favs` |

**How it works:**
- When the user enters via SSO → favorites are loaded from WordPress and stored in `localStorage`
- When the user adds/removes a favorite → `localStorage` updates immediately, WordPress syncs 800ms later
- When the user opens the Forms Hub in a new browser or device → favorites are loaded fresh from WordPress

> Favorites are **not deleted on logout**. They remain in WordPress and reload automatically the next time the user enters via SSO.

---

## 8. Logout Behavior

| Scenario | Result |
|---|---|
| User clicks **Log Out** in WordPress | WordPress redirects to `formshub.atlasseniorliving.net/?logout=true` → React clears session → login screen shown |
| User opens Forms Hub directly by URL without WP session | No SSO token → login screen shown |
| User opens Forms Hub with active WP session | Works normally, enters directly |
| User closes and reopens the Forms Hub tab while logged into WP | Session persists from `localStorage`, enters directly |

---

## 9. Deployment

The React app is deployed manually via **FileZilla FTP**.

**Steps to deploy a new version:**

1. Make changes to the source code locally
2. Run in the project directory:
   ```bash
   npm run build
   ```
   This generates a `dist/` folder with all production-ready files
3. Open FileZilla and connect to the server
4. Navigate to the folder where the current Forms Hub lives (where `index.html` is)
5. Upload all contents of `dist/`, replacing existing files when prompted

> ⚠️ Always run `npm run build` before uploading. Never upload raw source files from `src/`.

---

## 10. Troubleshooting

| Problem | Cause | Solution |
|---|---|---|
| `401` on `sso/validar` | ATLAS_SSO_SECRET not defined or snippet not active | Verify the snippet is saved and active in Code Snippets. Check that `define('ATLAS_SSO_SECRET', ...)` is at the top. |
| CORS error in browser console | CORS headers not set or domain mismatch | Verify the `add_action('init'...)` CORS block is present. The allowed domain must match exactly including `https://`. |
| Forms Hub button does nothing | JS snippet not active or menu text mismatch | Check the JS is active in Custom CSS & JS. The menu item text must be **exactly** `Forms Hub 2026`. |
| Favorites not syncing across browsers | User entered Forms Hub directly by URL | Always enter via the WordPress menu button — the SSO token carries the `user_id` needed to load favorites from WordPress. |
| Subscriber role gets `401` | Security plugin blocking REST API for non-admins | Verify the `rest_authentication_errors` filter with priority `999` is in the snippet. |
| Session stays open after WP logout | `wp_logout` action missing in snippet | Verify the `add_action('wp_logout'...)` block is present and redirects to `formshub.atlasseniorliving.net/?logout=true`. |
| Token already used error | React double-render calling `sso/validar` twice | Verify `ssoValidatingRef` is present in `App.jsx` and the guard `if (ssoValidatingRef.current) return;` is inside the SSO `useEffect`. |

---

## 11. Files Modified Summary

| File / Location | What was added |
|---|---|
| **Code Snippets (WordPress)** | `ATLAS_SSO_SECRET`, CORS config, REST API endpoints (`sso/generar`, `sso/validar`, `sso/check`, `favorites` GET/POST), WP nonce injection, Forms Hub shortcode, `wp_logout` redirect |
| **Custom CSS & JS (WordPress)** | `abrirFormsHub()` JavaScript function — intercepts the menu click, fetches SSO token, opens Forms Hub in new tab |
| **WordPress Menu** | Custom Link "Forms Hub 2026" with `javascript:void(0)` as URL |
| **`src/App.jsx` (React)** | `WP_URL` constant, `ssoLoading` state, `ssoValidatingRef`, SSO `useEffect` (token validation + favorites loading + logout detection), updated `favoritos` useEffect (WordPress sync), loading screen, updated `handleLogout` |

---

*Documentation generated May 2026 — Atlas Senior Living Internal*  
*Developed by Fernando Patiño*
