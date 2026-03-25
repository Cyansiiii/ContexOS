# Live Deploy Guide

## Recommended setup

- Frontend: Netlify
- Backend: Railway
- Backend runtime: Python `3.11`
- Ollama/models: deploy on the backend machine or on the same private network if your setup supports it

## 1. Backend on Railway

### Service settings

- Root directory: `backend`
- Builder: Dockerfile
- Dockerfile: already configured in [`backend/Dockerfile`](/c:/New%20folder/WEB_DEVELOPMENT/PRACTICE/New%20folder/contextOS/ContextOS/backend/Dockerfile)

### Railway environment variables

Set these in Railway:

```env
FRONTEND_APP_URL=https://your-frontend-domain.com
ALLOWED_ORIGINS=https://your-frontend-domain.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-backend-domain.up.railway.app/gmail/callback
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### Gmail OAuth

In Google Cloud Console:

- Add the live redirect URI:
  `https://your-backend-domain.up.railway.app/gmail/callback`
- Add the frontend domain to allowed origins if needed by your OAuth app setup

## 2. Frontend on Netlify

### Netlify environment variables

```env
VITE_API_URL=https://your-backend-domain.up.railway.app
```

### Netlify build settings

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist`

[`netlify.toml`](/c:/New%20folder/WEB_DEVELOPMENT/PRACTICE/New%20folder/contextOS/ContextOS/netlify.toml) already matches this.

## 3. Before going public

- Confirm `backend/.env` does not contain real secrets
- Keep real secrets only in `backend/.env.local` locally or in Railway env vars
- Rotate old Google OAuth client secret if it was ever exposed
- Verify:
  - sign up/login
  - Memory Hub file upload
  - Gmail connect/sync
  - Slack sync
  - Pricing flow
  - Analytics refresh
  - demo retrieval questions

## 4. Local-to-live mapping

- Local backend env template:
  [`backend/.env.example`](/c:/New%20folder/WEB_DEVELOPMENT/PRACTICE/New%20folder/contextOS/ContextOS/backend/.env.example)
- Local frontend env template:
  [`frontend/.env.example`](/c:/New%20folder/WEB_DEVELOPMENT/PRACTICE/New%20folder/contextOS/ContextOS/frontend/.env.example)
- Final launch checklist:
  [`LAUNCH_CHECKLIST.md`](/c:/New%20folder/WEB_DEVELOPMENT/PRACTICE/New%20folder/contextOS/ContextOS/LAUNCH_CHECKLIST.md)
