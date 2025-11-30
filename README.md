# Short-ly

A modern, full-stack URL shortener service built with Next.js and NestJS. Create short, memorable links and track their performance with detailed analytics.

🌐 **Live Demo**: [https://shortly.ankitsh.cc/](https://shortly.ankitsh.cc/)

## Overview

Short-ly is a URL shortening service that allows users to:
- Create short, shareable links from long URLs
- Use custom short codes for branded links
- Track click analytics including IP address, user agent, and referer
- Manage all their shortened URLs in a personal dashboard
- Secure authentication with user accounts

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **TanStack Query** - Data fetching and caching
- **Better Auth** - Authentication
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components

### Backend
- **NestJS** - Node.js framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Better Auth** - Authentication

### Infrastructure
- **Turborepo** - Monorepo build system
- **Docker** - Containerization
- **Nginx** - Reverse proxy

## Project Structure

This is a Turborepo monorepo containing the following packages and apps:

```
short-ly/
├── apps/
│   ├── api/          # NestJS backend API
│   └── web/          # Next.js frontend application
├── packages/
│   ├── auth/         # Shared authentication utilities
│   ├── database/     # Prisma schema and database client
│   ├── ui/           # Shared UI components
│   ├── eslint-config/    # Shared ESLint configurations
│   └── typescript-config/ # Shared TypeScript configurations
```

## Features

### 🔗 URL Shortening
- Generate short, unique codes automatically
- Create custom short codes for branded links
- Validate URLs before shortening
- Automatic collision detection for short codes

### 📊 Analytics
- Track total click count per shortened URL
- Record click details:
  - IP address
  - User agent
  - Referer
  - Timestamp
- View click history for each URL

### 👤 User Management
- User authentication with email/password
- Secure session management
- Personal dashboard to view all shortened URLs
- User-specific URL management

### 🎨 Modern UI
- Clean, responsive design
- Real-time updates
- Toast notifications
- Accessible components

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 9.0.0
- PostgreSQL database
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd short-ly
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Secret key for authentication
- `BETTER_AUTH_URL` - Base URL for authentication

4. Set up the database:
```bash
cd packages/database
pnpm prisma migrate dev
pnpm prisma generate
```

5. Start the development servers:
```bash
# From the root directory
pnpm dev
```

This will start:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001 (or configured port)

## Development

### Available Scripts

From the root directory:

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps and packages
- `pnpm lint` - Lint all code
- `pnpm format` - Format code with Prettier
- `pnpm check-types` - Type check all TypeScript code

### Running Specific Apps

You can run specific apps using Turborepo filters:

```bash
# Run only the web app
pnpm dev --filter=web

# Run only the API
pnpm dev --filter=api

# Build only the web app
pnpm build --filter=web
```

## Deployment

The project includes Docker configuration for containerized deployment:

```bash
# Build and start with Docker Compose
docker-compose up -d
```

See `docker-compose.yml` and individual `Dockerfile`s in each app directory for deployment configuration.

## API Endpoints

### Authentication
- `POST /api/auth/sign-up` - Create a new user account
- `POST /api/auth/sign-in` - Sign in to an existing account
- `POST /api/auth/sign-out` - Sign out

### URLs
- `POST /urls` - Create a new shortened URL
  - Body: `{ originalUrl: string, shortCode?: string }`
- `GET /urls` - Get all URLs for the authenticated user
- `GET /urls/:shortCode` - Redirect to original URL (tracks click)

## Database Schema

The application uses PostgreSQL with the following main models:

- **User** - User accounts
- **Url** - Shortened URLs with short codes
- **Click** - Click tracking data
- **Session** - User sessions
- **Account** - Authentication accounts

See `packages/database/prisma/schema.prisma` for the complete schema.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and unlicensed.

## Author

Built by [Ankit Sharma](https://ankitsh.cc)

---

For more information about Turborepo, see the [Turborepo documentation](https://turborepo.com/docs).
