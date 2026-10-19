# Forms Hub: panel de administración (guía técnica)

El panel permite que las personas que el dueño autorice agreguen, editen y borren archivos del Forms Hub sin tocar código, sin `npm run build` y sin FileZilla. Todos siguen entrando por el mismo SSO; el panel solo aparece para quienes tienen permiso (ver sección 4).

- **Los archivos siguen en OneDrive/SharePoint.** El panel solo guarda nombre, link, categoría, estado y etiqueta.
- **La lista vive en WordPress** (`wp_options`, ~150 KB de texto). No usa la Media Library.
- **Los cambios se ven al instante**: el Forms Hub carga la lista desde WordPress cada vez que se abre.
- **Guía para el equipo (inglés):** `EDITOR-GUIDE.md`.

---

## 1. Instalar el snippet en WordPress

1. **Snippets → Add New**. Título: `ATLAS FORMS HUB — Documents API + Admin`.
2. Pega `wordpress/atlas-formshub-admin-snippet.php` **sin la primera línea `<?php`**.
3. **Run snippet everywhere** → **Save Changes & Activate**.

> El snippet `ATLAS SSO + FAVORITES` debe seguir activo. El nuevo usa su `ATLAS_SSO_SECRET`, su función `atlas_generate_sso_token()` y su bypass de REST. No hay que modificarlo.

Prueba rápida: `https://atlasseniorliving.net/wp-json/atlas/v1/forms/documents` debe responder JSON con `"initialized": false`.

---

## 2. Probar en local

Hay dos modos.

### A. Datos de prueba (no toca WordPress)

```bash
npm run dev
```

Entra con el código de acceso y usa el botón amarillo **⚙️ Admin (dev)**. Todo se guarda en el localStorage de tu navegador (`atlas_mock_db`). Ese botón no existe en `npm run build`.

### B. Contra el WordPress real

1. Crea `.env.local` en la raíz del proyecto:
   ```
   VITE_WP_URL=https://atlasseniorliving.net
   ```
2. `npm run dev` (debe quedar en el puerto **5173**).
3. Con tu sesión de WordPress abierta, entra a:
   `https://atlasseniorliving.net/?atlas_formshub=admin&target=local`

   Te manda a `http://localhost:5173/#/admin` ya autenticado como admin.

> ⚠️ **En el modo B los datos son reales.** Lo que agregues o borres desde local es la misma lista que lee el Forms Hub de producción (si ya tiene el build nuevo). Para pruebas sueltas usa el modo A. Cualquier error se deshace en **Undo changes**.

El snippet permite peticiones desde `http://localhost:5173` y `http://127.0.0.1:5173` solo para las rutas `atlas/v1`. Para quitar ese permiso cuando ya no lo necesites, deja vacía la lista en `atlas_fh_dev_origins()`.

---

## 3. Pasar a producción

1. Snippet instalado y probado (sección 1 y 2B).
2. `npm run build` y sube `dist/` por FileZilla. **Es la última vez que hace falta subir la app para cambiar documentos.**
3. Entra a `https://atlasseniorliving.net/?atlas_formshub=admin` (o **📁 Manage Forms Hub** en la barra de admin de WordPress).
4. Clic en **Import the 506 current files** (solo aparece la primera vez).
5. Filtra por **⚠ Links to check**: hay 9 archivos con links copiados de la barra del navegador que probablemente solo abren para su dueño (Melissa). Hay que reemplazarlos por links de *Share → Copy link*.

Mientras no se haga la importación, el Forms Hub sigue mostrando la lista que trae el código, así que el orden de los pasos 2 y 4 no rompe nada.

---

## 4. Quién tiene acceso y cómo entra

Todos entran por el mismo SSO. **El rol de WordPress no da acceso** (ni siquiera Administrator). Lo decide el dueño:

- **Dueño (`grosales`):** siempre tiene acceso y es el único que puede darlo o quitarlo. Está definido en `atlas_fh_owner_logins()` del snippet; para agregar otro dueño, añade su usuario a esa lista.
- **Cualquier otra persona**, incluidos los demás Administrators: solo si el dueño le marca **Can manage Forms Hub** en **Users → Edit user**, sección *Forms Hub*.

Solo el dueño ve esa casilla y la columna **Forms Hub** en **Users** (✓ Owner / ✓ Can manage / —). Si otro Administrator abre un perfil, no ve nada de esto.

**Para dar o quitar acceso:** marca o desmarca la casilla y da clic en **Update User**. Quitarlo es inmediato: el permiso se revisa en cada guardado, aunque la persona tenga el panel abierto.

> Límite: un Administrator de WordPress puede editar snippets, así que técnicamente podría cambiar la lista de dueños. Esto evita accesos por accidente, no a un administrador decidido a saltárselo.

Cómo entran las personas con acceso:

- **Barra de admin de WordPress → 📁 Manage Forms Hub** (solo la ven quienes tienen acceso).
- Link directo: `https://atlasseniorliving.net/?atlas_formshub=admin`. Si no hay sesión, pide login de WordPress primero.
- Desde el Forms Hub, el botón **⚙️ Manage files** (aparece si entraron por el menú **Forms Hub 2026**).

La sesión de admin dura 8 horas y se renueva cada vez que se abre el panel.

---

## 5. Comportamiento

| Tema | Cómo funciona |
|---|---|
| Orden en el Forms Hub | A–Z por nombre. Un archivo nuevo aparece en su lugar alfabético. |
| Etiquetas NEW / UPDATED | Se apagan solas a los 30 días (`BADGE_DAYS` en `src/lib/fileTypes.js`). El contador se reinicia si cambias la etiqueta o el link. |
| Links sospechosos | El formulario avisa si el link parece copiado de la barra del navegador o es de un OneDrive personal. El filtro **⚠ Links to check** los lista. |
| Categorías nuevas | Reciben un color propio en el Forms Hub. |
| IDs | Nunca se reutilizan, así que los favoritos de la gente no apuntan a otro archivo. |
| Deshacer | Copia automática antes de cada cambio; se guardan las últimas 15. |
| Dos admins guardando a la vez | Gana el último. Es poco probable, pero si pasa, el cambio perdido se recupera en **Undo changes**. |

---

## 6. Técnico

```
WordPress: menú "Forms Hub 2026", barra de admin o /?atlas_formshub=admin
   → token SSO → formshub.atlasseniorliving.net/?sso_token=…(#/admin)
React → POST sso/validar  (+ admin_session firmado si el rol lo permite, vía rest_post_dispatch)
      → GET  /atlas/v1/forms/documents          lista pública
      → POST /atlas/v1/forms/documents/save     ┐
      → POST /atlas/v1/forms/documents/delete   │ requieren admin_session
      → POST /atlas/v1/forms/settings/save      │ (HMAC con ATLAS_SSO_SECRET;
      → POST /atlas/v1/forms/import             │  el rol se revalida en cada request)
      → POST /atlas/v1/forms/backups(/restore)  ┘
```

| Opción en `wp_options` | Contenido |
|---|---|
| `atlas_fh_documents` | Lista de documentos |
| `atlas_fh_settings` | Categorías y estados |
| `atlas_fh_meta` | Último cambio y contador de IDs |
| `atlas_fh_backups_index` | Lista de las últimas 15 versiones |
| `atlas_fh_bk_<id>` | Cada versión guardada, en su propia fila (~135 KB) |
| `atlas_fh_manager` (user meta) | La casilla *Can manage Forms Hub* de cada usuario |

| Archivo | Qué es |
|---|---|
| `src/admin/AdminPanel.jsx` | El panel (`/#/admin`) |
| `src/lib/api.js` | Cliente de los endpoints y sesión de admin |
| `src/lib/mockApi.js` | WordPress simulado para `npm run dev` (no entra al build) |
| `src/lib/fileTypes.js` | Iconos, tipo de archivo, aviso de links, etiquetas |
| `src/data/documentos.js` | Lista antigua: solo para la importación inicial y como respaldo si WordPress no responde. **Editarla ya no cambia la lista en vivo.** |
| `wordpress/atlas-formshub-admin-snippet.php` | Snippet para Code Snippets |

---

## 7. Problemas comunes

| Problema | Solución |
|---|---|
| No aparece **Manage files** | La persona no tiene marcada **Can manage Forms Hub** (revisa la columna *Forms Hub* en Users, solo la ves tú como dueño), o su sesión es anterior al cambio. Que entre con `/?atlas_formshub=admin`. |
| “Admin session expired” | Pasaron más de 8 h. Vuelve a entrar con el link directo. |
| “Could not connect to WordPress” | El snippet no está activo, o un plugin de seguridad bloquea `/wp-json/atlas/v1/forms/*`. |
| En local (modo B) sale error de CORS | Vite no está en el puerto 5173, o el snippet no está activo. |
| La gente ve la lista vieja | Un plugin de caché guarda la respuesta. Excluye `/wp-json/atlas/v1/forms/documents` (el endpoint ya envía `Cache-Control: no-store`). |
| Un link abre “no tienes acceso” | Al compartir en OneDrive hay que elegir *People in Atlas Senior Living*, no *Specific people*. |
