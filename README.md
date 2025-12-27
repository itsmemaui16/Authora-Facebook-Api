# Authora FB_API

Premium, glassy Facebook Login demo for localhost/HTTPS via ngrok. Frontend uses only the Facebook App ID; the App Secret stays in `.env` for future backend use and is never referenced in browser code.

## Features

- **🔐 Secure Facebook OAuth Integration** - Full Facebook Login SDK integration with proper authentication flow
- **✨ Premium Glassmorphism UI** - Modern glassy card design with backdrop blur effects and smooth animations
- **🎨 Animated Gradient Background** - Dynamic, shifting gradient background for a premium visual experience
- **👤 Rich Profile Display** - Shows user profile picture, name, email, and hometown information
- **🛡️ Privacy-Aware Data Handling** - Gracefully handles missing data (email/hometown) based on user privacy settings
- **⚡ Loading States & Animations** - Smooth loading spinners and fade-in animations for better UX
- **📱 Responsive Design** - Mobile-friendly layout that works seamlessly across all device sizes
- **🔒 Security Best Practices** - App Secret securely stored in `.env`, only App ID exposed in frontend
- **🚀 HTTPS Support** - Easy setup with ngrok for local HTTPS testing (required for Facebook Login)
- **🔄 Clean Logout** - Proper session management with UI reset functionality
- **🎯 Error Handling** - Graceful error handling for API failures and network issues
- **💫 Smooth Transitions** - Polished UI transitions and hover effects throughout the interface

## Setup

1) Create `.env` in the project root:
```
FACEBOOK_APP_ID=your_app_id_here
FACEBOOK_APP_SECRET=your_app_secret_here
```
The secret is not used by this frontend; keep it out of any served assets.

2) Update the App ID for the frontend:
- Open `index.html` and set the `data-fb-app-id` attribute on the `<html>` tag to match `FACEBOOK_APP_ID`.

## Run locally (HTTP) for basic dev

Use any static server from the project root (examples):
- `npx serve` (if you have Node.js)
- `python -m http.server 8000`
- or open `index.html` directly in the browser (works for basic layout checks).

Then load http://localhost:8000 (or your chosen port).

## Run securely via HTTPS (required for Facebook Login)

Facebook Login should be exercised over HTTPS. Use ngrok to expose your local server:
- Start a local server (example): `python -m http.server 8000`
- Start ngrok: `ngrok http 8000`
- Use the `https://<subdomain>.ngrok-free.dev` URL in your browser and in your Facebook App settings (Valid OAuth Redirect URIs / Allowed Domains).

## Facebook setup

- In your Facebook app settings, add your local/HTTPS origins (e.g., `http://localhost:8000/` and your `https://<subdomain>.ngrok-free.dev`).
- The app requests scopes: `public_profile`, `email`, `user_hometown` (email/hometown may be missing based on privacy).
- Fields requested: `id,name,email,hometown,picture.type(large)`.

## Notes

- Frontend references only the App ID; the App Secret is for future backend use only.
- Missing data is handled gracefully: email row shows only when present; hometown row shows only when present; helper text clarifies that some info may not be shared due to privacy.
- UI: logged-out view has a single “Continue with Facebook” CTA; logged-in view shows name, profile photo, status badge, optional email/hometown rows, and logout.

## GroupMates

- John Marc M. Obogne
- Floriza Neri L. Miranda
- Jhon Lloyd Tirao
- John Mark Abad