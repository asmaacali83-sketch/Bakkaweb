# Bakka Training Center Administration System

A separated Next.js and Node.js administration platform for managing students,
staff, courses, batches, enrollments, attendance, certificates, and reports.

## Architecture

- `frontend/`: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui
- `backend/`: Node.js and Express REST API using JavaScript
- `backend/prisma/`: MySQL schema and migrations
- `docs/`: Product requirements and implementation prompts

The Next.js application never accesses MySQL directly. All protected operations
must be authenticated and authorized by the backend.

## Existing setup

At this stage, the repository contains the frontend and backend scaffolds plus
a backend health endpoint. Authentication, database entities, dashboards, and
administrative modules are implementation phases rather than placeholder
features.

## Prerequisites

- Node.js LTS
- npm
- MySQL 8.x

## Installation

```powershell
cd frontend
npm install
Copy-Item .env.example .env.local

cd ..\backend
npm install
Copy-Item .env.example .env
```

Configure `DATABASE_URL` and both JWT secrets before starting authenticated
features. Use development-only values only.

## Development commands

```powershell
# Frontend
cd frontend
npm run dev

# Backend
cd backend
npm run dev
```

Frontend: `http://localhost:3000`

Backend health check: `http://localhost:5000/api/health`
Student self-registration: `http://localhost:3000/register`

## Environment variables

Backend:

- `NODE_ENV`
- `PORT`
- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `FRONTEND_URL`

Frontend:

- `BACKEND_API_ORIGIN` (server-side API origin used by the Next.js proxy)

Never place database credentials or JWT secrets in `NEXT_PUBLIC_*` variables.

## API conventions

Successful responses use:

```json
{
  "success": true,
  "data": {}
}
```

Errors use:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

Protected endpoints use server-side authentication. Public registration is
limited to student accounts: the backend assigns the role, hashes the password,
creates the login and student profile in one transaction, and rate-limits
registration attempts. Admin and staff accounts must be provisioned by
authorized administrators.

## Database setup

The checked-in SQL schema is in `database/schema.sql`; the follow-up migration
expands the original setup tables without deleting existing records.

```powershell
& "C:\xampp\mysql\bin\mysql.exe" -u root --execute="source C:/Users/cxc/Downloads/bakka_training_center_documentation/database/schema.sql"
& "C:\xampp\mysql\bin\mysql.exe" -u root --execute="source C:/Users/cxc/Downloads/bakka_training_center_documentation/database/migrations/001_expand_existing_schema.sql"
cd backend
npm run db:init
```

The SQL creates `bakka_training_center` and its roles, permissions, users,
students, staff, courses, batches, enrollments, sessions, attendance, results,
certificates, announcements, settings, and audit-log tables. Existing data is
preserved. XAMPP stores the live database files under `C:\xampp\mysql\data`;
the repository stores the reproducible SQL schema, not the live data files.

The backend connection is configured in `backend/.env` using `DATABASE_URL`.
For the default XAMPP root account with no password:
`mysql://root:@localhost:3306/bakka_training_center`.

Back up the database before schema changes:

```powershell
& "C:\xampp\mysql\bin\mysqldump.exe" -u root --databases bakka_training_center --result-file="bakka-backup.sql"
```

## Validation commands

```powershell
cd frontend
npm run lint
npm run typecheck
npm run build

cd ..\backend
npm run lint
npm test
```

## Documentation

- [Project overview](docs/overview.md)
- [Technology stack](docs/tech_stach.md)
- [Mandatory agent rules](docs/agent_rules.md)
- [Implementation prompts](docs/prompts.md)

## Implementation sequence

1. Database schema and migrations
2. Authentication and authorization
3. Role layouts and dashboards
4. Student and staff management
5. Courses and batches
6. Enrollment
7. Attendance and progress
8. Certificates
9. Reports and audit logs
10. Quality assurance and handover

# Bakkaweb
