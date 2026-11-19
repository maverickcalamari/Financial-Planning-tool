# Financial Planning Dashboard

A browser-based budget and projection tool. Enter financial assumptions, compare scenarios, and export a plan. Plans are stored in this browser's local storage. Each deployment URL is a separate origin and has its own browser storage. Export any plan you want to keep before changing URLs or clearing browser data.

## Development

Use Node.js 22. Run `npm ci`, then `npm run dev`. Run `npm run build` to create the Vite production build in `dist`.

## Vercel

Import this GitHub repository as a Vite project. The checked-in Vercel configuration uses `npm ci`, `npm run build`, and `dist`. No environment variables, database, or account setup are required. Use a Preview deployment to verify plan entry, projections, local storage, and export before publishing.