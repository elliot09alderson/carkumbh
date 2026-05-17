# Toran Sir — Business Coach & Corporate Trainer (Frontend)

The official web application for Toran Sir — business coach, corporate trainer, and communication mentor. This is the React + Vite frontend for the public website, event registrations, and admin dashboard.

## Tech stack

- Vite
- React 18 + TypeScript
- React Router
- TanStack Query
- Tailwind CSS + shadcn/ui
- Framer Motion

## Getting started

Requirements: Node.js 18+ and npm.

```sh
# Install dependencies
npm install

# Start the dev server (http://localhost:8080)
npm run dev

# Production build
npm run build

# Preview the production build
npm run preview

# Lint
npm run lint
```

## Project structure

```
src/
├── api/           # API clients
├── assets/        # Static assets bundled by Vite
├── components/    # Reusable UI + shadcn components
├── contexts/      # React contexts (e.g. AuthContext)
├── hooks/         # Custom hooks
├── lib/           # Utilities
└── pages/         # Route-level pages
```

## Routes

| Path                           | Purpose                                 |
| ------------------------------ | --------------------------------------- |
| `/`                            | Home                                    |
| `/upcoming-event`              | Upcoming event details + registration   |
| `/certification-registration`  | Certification program registration      |
| `/our-team`                    | Team page                               |
| `/toran-sir-school`            | Toran Sir School page                   |
| `/privacy-policy`              | Privacy Policy                          |
| `/terms-conditions`            | Terms & Conditions                      |
| `/refund-policy`               | Refund Policy                           |
| `/admin-login` · `/admin`      | Admin dashboard                         |

## Deployment

Any static host works. The repo ships with a `vercel.json` for Vercel; build with `npm run build` and serve the `dist/` directory.
