# Frontend Deployment Notes

## Local setup

1. Copy `.env.example` to `.env`
2. Set `VITE_API_URL` to your backend URL
3. Run `npm install`
4. Run `npm run dev`

## Production

- Set `VITE_API_URL` in your hosting provider to the public backend URL
- Build with `npm run build`
- Preview with `npm run preview`

## Current assumptions

- Frontend expects a reachable FastAPI backend
- Gmail OAuth callback returns the user to `FRONTEND_APP_URL/?tab=upload&gmail=connected`
- Memory Hub, Analytics, Pricing, and auth flows all depend on `VITE_API_URL` being correct
