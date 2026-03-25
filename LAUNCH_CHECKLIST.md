# Launch Checklist

## Backend

- Use Python `3.11` or `3.12`
- Copy `backend/.env.example` to `backend/.env`
- Set `FRONTEND_APP_URL` to the live frontend URL
- Set `ALLOWED_ORIGINS` to the live frontend origin(s)
- Set Gmail OAuth values if Gmail connect/sync is required
- Set Razorpay values if live checkout is required
- Confirm Ollama is installed and the required models are pulled:
  - `mistral`
  - `nomic-embed-text`

## Frontend

- Copy `frontend/.env.example` to `frontend/.env`
- Set `VITE_API_URL` to the live backend URL
- Confirm `npm run build` passes

## Product checks

- Sign up and log in
- Upload pasted content in Memory Hub
- Upload a file in Memory Hub
- Test Gmail connect/sync
- Test Slack sync
- Ask 5-10 retrieval questions
- Verify Analytics page updates after questions/uploads
- Verify profile update and avatar upload
- Verify Pricing checkout flow

## Deployment checks

- Backend health endpoint returns `ContextOS API running`
- `/amd/status` returns a valid Ollama status payload
- CORS allows the live frontend origin
- Gmail callback returns to the live frontend, not localhost
- No secrets are committed to git

## Nice-to-have before public launch

- Deploy backend on a machine with enough RAM for local model inference
- Prefer Chroma/vector mode on Python 3.11 rather than JSON fallback mode
- Add uptime monitoring for the backend URL
- Add error logging for failed Gmail/Slack sync attempts
