<div align="center">

# 🏡 Rentiful — Modern Real Estate & Rental Management Platform

<p align="center"><img src="./frontend/public/rentiful-app-banner.webp" alt="Rentiful Platform Preview" width="100%" style="border-radius: 10px;" /></p>

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Express.js](https://img.shields.io/badge/Express-Backend-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Mapbox](https://img.shields.io/badge/Mapbox-GL_JS-000000?style=for-the-badge&logo=mapbox)](https://www.mapbox.com/)

**Rentiful** is a full-stack real estate marketplace and rental management platform inspired by modern hospitality and booking experiences like Airbnb. It connects prospective tenants with verified property managers through real-time interactive mapping, direct digital lease applications, instant favoriting, and dedicated tenant/manager dashboards.

---

</div>

## ✨ Key Features

### 🔍 For Renters & Tenants
- **Cinematic Discovery & Landing Experience**: High-impact hero search, verified property highlights, curated neighborhood collections, and live metrics.
- **Interactive Map Search**: Split-screen listing and Mapbox GL view with synchronized hover highlights, geocoded markers, and dynamic bounding box filtering.
- **Multi-Image Property Carousels**: Smooth image previews powered by Embla Carousel directly on listing cards.
- **Direct Application Submissions**: Apply to homes with pre-filled profile data, custom notes, phone validation, and real-time status tracking (`Pending`, `Approved`, `Denied`).
- **Personalized Tenant Portal**: View submitted applications, active leases, payment schedules, and saved favorite properties.
- **Multi-Theme Engine**: 3 custom theme palettes (Modern Dark, Crisp Light, and Warm Sand) with seamless system preference synchronization.

### 🏢 For Property Managers
- **Property Management Dashboard**: Create, edit, and monitor properties with custom amenities, image uploads, price configurations, and location coordinates.
- **Tenant Application Processing**: Accept or reject tenant applications with automated lease creation and deposit tracking.
- **Financial & Lease Tracking**: Real-time lease term overviews, upcoming payment calculations, and tenant details.

---

## 🛠️ Architecture & Tech Stack

### **Frontend**
- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI Components**: [Base UI](https://base-ui.com/) + Custom Tailwind CSS Design System
- **State & Server Cache**: [TanStack Query v5](https://tanstack.com/query) + [Zustand](https://zustand-demo.pmnd.rs/)
- **Animations & Transitions**: [Framer Motion](https://www.framer.com/motion/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) + [Zod Validation](https://zod.dev/)
- **Mapping**: [Mapbox GL JS](https://www.mapbox.com/)
- **Carousels**: [Embla Carousel React](https://www.embla-carousel.com/)
- **Theming**: [Next Themes](https://github.com/pacocoursey/next-themes)

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/) / [Bun](https://bun.sh/) with TypeScript
- **Server Framework**: [Express.js](https://expressjs.com/)
- **Database & ORM**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: AWS Cognito JWT validation & role-based middleware (`tenant` | `manager`)
- **File & Media Handling**: Multi-part uploads with AWS S3 / CloudFront integration

---

## 📁 Repository Structure

```plaintext
real-estate/
├── frontend/                     # Next.js App Router Client
│   ├── app/
│   │   ├── (auth)/              # Sign in / Sign up authentication pages
│   │   ├── (dashboard)/         # Protected Tenant & Manager dashboards
│   │   ├── (public)/            # Landing, Search, and Listing detail pages
│   │   ├── sitemap.ts           # Dynamic SEO sitemap generator
│   │   └── globals.css          # Design tokens & color theme palettes
│   ├── api/                     # TanStack Query hooks & Axios requests
│   ├── components/              # UI components (PropertyCard, Navbar, Footer, etc.)
│   ├── lib/                     # Utilities, schemas, constants & Mapbox helpers
│   └── store/                   # Zustand client state stores (filters, favorites)
│
├── backend/                      # Express REST API Server
│   ├── prisma/                  # Database schema, migrations & seed scripts
│   │   └── schema.prisma
│   └── src/
│       ├── controllers/         # Property, Application, Lease, Manager controllers
│       ├── middleware/          # Auth, role validation & error handlers
│       ├── routes/              # Express API route endpoints
│       └── lib/                 # Prisma DB client & app utilities
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js 18+](https://nodejs.org/) or [Bun](https://bun.sh/)
- [PostgreSQL](https://www.postgresql.org/) database instance
- [Mapbox Access Token](https://account.mapbox.com/)
- [AWS Cognito User Pool](https://aws.amazon.com/cognito/) (for authentication)

---

### 1. Clone the Repository
```bash
git clone https://github.com/Steve-madlad/real-estate.git
cd real-estate
```

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
bun install   # or npm install

# Configure Environment Variables
cp .env.example .env
```

Ensure your `backend/.env` has:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/realestate?schema=public"
PORT=8000
COGNITO_USER_POOL_ID="your-user-pool-id"
COGNITO_CLIENT_ID="your-client-id"
AWS_REGION="us-east-1"
```

Run Prisma migrations & seed demo data:
```bash
bunx prisma migrate dev --name init
bunx prisma db seed
```

Start backend development server:
```bash
bun dev   # or npm run dev
```

---

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
bun install   # or npm install

# Configure Environment Variables
cp .env.example .env.local
```

Ensure your `frontend/.env.local` contains:
```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000"
NEXT_PUBLIC_MAPBOX_TOKEN="your_mapbox_public_token"
NEXT_PUBLIC_COGNITO_USER_POOL_ID="your-user-pool-id"
NEXT_PUBLIC_COGNITO_CLIENT_ID="your-client-id"
```

Start the frontend development server:
```bash
bun dev   # or npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Containerized Setup

The repository-root `compose.yaml` runs the frontend and backend as separate
containers:

- The frontend is exposed at `http://localhost:3000` and is built from
  `frontend/Dockerfile.standalone`, using Next.js standalone output.
- The backend is exposed at `http://localhost:3001` and is built from
  `backend/Dockerfile`.
- PostgreSQL is not included in Compose. Configure `DATABASE_URL` to point to a
  database reachable by the backend container.

### Requirements

- Docker with Docker Compose and BuildKit support.
- A configured `backend/.env` file with the backend's runtime environment
  variables. Compose loads it into the backend container; the file is excluded
  from the image build context.
- `DATABASE_URL` set temporarily in the host shell before building. Prisma
  needs a datasource URL to generate its client, but client generation does not
  need to connect to the database. Use a dummy URL for this build-time value;
  Compose passes it to the backend build as a BuildKit secret, so it is not
  baked into the image. The backend still needs the actual database URL at
  runtime in `backend/.env`.
- Frontend build-argument values set in the host shell or `.env` file before building:
  `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_COGNITO_USER_POOL_ID`,
  `NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID`, `NEXT_PUBLIC_MAPBOX_TOKEN`, and
  See [frontend/README.Docker.md](./frontend/README.Docker.md) for shell examples.

### Start the application

From the repository root, set a temporary dummy `DATABASE_URL` in your shell
and start Compose. For PowerShell:

```powershell
$env:DATABASE_URL = "postgresql://user:password@localhost:5432/dummy?schema=public"
docker compose up --build
```

For bash, zsh, or a similar shell:

```sh
export DATABASE_URL='postgresql://user:password@localhost:5432/dummy?schema=public'
docker compose up --build
```

These commands set the variable only for the current shell session. The dummy
URL is used only during the image build for `prisma generate`; it is not a
database credential and does not replace the real runtime URL in `backend/.env`.
That file must contain a valid connection string for a database reachable by
the backend container.

The Compose configuration uses `depends_on` for startup order; it does not
wait for the backend or database to become healthy. To stop the services, run
`docker compose down`. For the configured rebuild-on-change watchers, run
`docker compose watch`.

Compose passes the frontend build arguments into the standalone image, where
they are embedded into the client-side application. Rebuild the frontend image
after changing them. Do not pass private credentials as build arguments. The
API base URL must be reachable from the browser; for local Compose usage, use
the published backend address `http://localhost:3001`.

### Frontend image variants

Two frontend Dockerfiles are provided:

- `frontend/Dockerfile.standalone` packages Next.js standalone output and is
  used by Compose. This matches the current `output: 'standalone'` setting in
  `frontend/next.config.ts`.
- `frontend/Dockerfile` packages the regular Next.js build with production
  dependencies and starts it with `next start`. To use this variant, configure
  Next.js for its regular (non-standalone) output before building.

For image-specific build and run commands, see
[frontend/README.Docker.md](./frontend/README.Docker.md). For backend image
details and build-secret usage, see
[backend/README.Docker.md](./backend/README.Docker.md).

---

## 📡 Key API Routes

| Method | Route | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/properties` | Public | Search and filter properties with query params |
| `GET` | `/properties/:id` | Public | Retrieve individual property specifications & coordinates |
| `POST` | `/properties` | Manager | Create new listing with amenities & specs |
| `GET` | `/applications` | Tenant / Manager | List user-specific rental applications |
| `GET` | `/applications/property/:propertyId` | Tenant / Manager | List applications for a specific listing |
| `POST` | `/applications` | Tenant | Submit a new digital rental application |
| `PUT` | `/applications/:id/process` | Manager | Approve or deny an application & generate lease |
| `GET` | `/leases` | Tenant / Manager | Fetch active leases and payment schedules |

---

## 🎨 Theme Customization

Rentiful includes a 3-tier theme system configured via CSS variables in `frontend/app/globals.css`:
- **Dark Mode (`dark`)**: Slate & Zinc deep tones with vibrant coral/rose highlights.
- **Light Mode (`light`)**: Clean, minimalist white backdrop with high-contrast typography.
- **Warm Sand (`theme-warm`)**: Earthy cream and amber palette for a warm editorial look.

Toggle themes dynamically from the navigation bar menu.

---

## 📄 License

This project is licensed under the MIT License.
