# Technology Stack – Bakka Training Center

> Requested filename: `tech_stach.md`. The intended stack is Next.js + TypeScript frontend, Node.js + JavaScript backend, and MySQL database.

## 1. Architecture
Use a separated frontend/backend architecture:

- **Frontend:** Next.js (App Router) with TypeScript.
- **Backend:** Node.js REST API using JavaScript (`.js` files; do not use TypeScript in the backend).
- **Database:** MySQL.
- **ORM / database access:** Prisma is recommended, with schema and migrations managed through Prisma. Backend application code remains JavaScript.
- **API contract:** REST with JSON and documented endpoints (OpenAPI/Swagger recommended).

The Next.js frontend communicates with the Node.js API. The backend is the only application layer that directly accesses MySQL.

## 2. Frontend
- Next.js (App Router)
- TypeScript (`.ts` / `.tsx`)
- Tailwind CSS
- shadcn/ui components
- React Hook Form for forms
- Zod for frontend schema validation (mirror backend validation; backend remains authoritative)
- TanStack Query for server state and API caching, if useful
- Recharts for dashboard charts, if required
- Lucide icons

Frontend requirements:
- Role-specific dashboard layouts and navigation.
- Reusable tables with search, filters, sorting, pagination, and row actions.
- Accessible forms and dialogs.
- Loading, error, empty, and success states.
- Responsive layouts.
- Do not rely on client-side role checks as the security boundary.

## 3. Backend
- Node.js LTS
- Express.js (JavaScript)
- JavaScript only (`.js`, optionally `.mjs` if the project deliberately uses ES modules).
- Prisma Client for MySQL access.
- Zod or Joi for request validation.
- JWT access tokens with a secure refresh-token strategy, or secure cookie-based sessions. Choose one approach and implement it consistently.
- bcrypt or Argon2 for password hashing.
- Helmet, CORS allowlist, rate limiting, and centralized error handling.
- OpenAPI/Swagger for API documentation.

Backend requirements:
- REST API organized by routes, controllers, services, middleware, and validators.
- Centralized authentication and authorization middleware.
- Permission checks at endpoint and record level.
- Transactions for enrollment and certificate workflows.
- Audit logging for sensitive actions.
- Never trust role, user ID, price, enrollment status, or certificate status supplied by the browser without server-side verification.

## 4. Database
- MySQL 8.x (or a currently supported MySQL release).
- Use InnoDB, foreign keys, indexes, and appropriate unique constraints.
- Store timestamps consistently; document the chosen timezone policy.
- Use migrations for every schema change.
- Use parameterized ORM queries; never concatenate untrusted input into SQL.

Suggested entities/tables:
- `users` – login identity, password hash, account status.
- `roles` – admin, staff, student.
- `permissions` – granular capabilities.
- `user_roles` – role assignments if multiple roles are supported; otherwise enforce one primary role.
- `role_permissions` – role-to-permission mapping.
- `students` – student profile and student number.
- `staff` – staff profile and staff number.
- `courses` – course catalog.
- `batches` – course intake/class instance and capacity.
- `batch_staff` – staff assigned to batches.
- `enrollments` – student-to-batch registration history.
- `sessions` – scheduled class sessions.
- `attendance` – attendance per student/session.
- `assessments` and `results` – optional progress/assessment tracking.
- `certificates` – issued certificate metadata and verification code.
- `announcements` – course or center announcements.
- `audit_logs` – actor, action, target, timestamp, and safe metadata.
- `password_reset_tokens` / `refresh_tokens` – if required by the chosen auth strategy.

Important constraints:
- Unique `student_number`, `staff_number`, course code, certificate number, and certificate verification code.
- Prevent duplicate active enrollment for the same student and batch through transaction-safe service logic and an appropriate database constraint/design.
- Enforce batch capacity inside a transaction to avoid race conditions.
- Use soft deletion or deactivation for important records; preserve enrollment and certificate history.

## 5. Suggested Project Structure

```text
bakka-training-center/
├── frontend/
│   ├── app/
│   │   ├── (auth)/login/
│   │   ├── (admin)/admin/
│   │   ├── (staff)/staff/
│   │   ├── (student)/student/
│   │   └── verify-certificate/[code]/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── forms/
│   │   └── tables/
│   ├── features/
│   │   ├── students/
│   │   ├── staff/
│   │   ├── courses/
│   │   ├── enrollments/
│   │   └── certificates/
│   ├── lib/
│   ├── hooks/
│   └── types/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── validators/
│   │   ├── utils/
│   │   └── app.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── tests/
│   └── server.js
│
├── docs/
│   ├── overview.md
│   ├── tech_stach.md
│   ├── agent_rules.md
│   └── prompts.md
└── README.md
```

## 6. Environment Variables
Use `.env` files locally and secret management in production. Commit only `.env.example`.

Example backend variables:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/bakka_training_center"
JWT_ACCESS_SECRET="replace-with-a-long-random-secret"
JWT_REFRESH_SECRET="replace-with-another-long-random-secret"
FRONTEND_URL="http://localhost:3000"
```

Example frontend variable:
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

Never expose database credentials, JWT secrets, or private API keys through `NEXT_PUBLIC_*`.

## 7. Testing and Quality
- Backend: Jest or Vitest + Supertest.
- Frontend: Vitest/React Testing Library.
- End-to-end: Playwright.
- Test role permissions, object-level access, validation, duplicate enrollment, capacity race conditions, and certificate verification.
- Add linting and formatting (ESLint + Prettier).
- CI should run lint, type checks, tests, and build.

## 8. Deployment
- Deploy Next.js frontend and Node.js API as separate services or managed applications.
- Use managed MySQL or a secured MySQL server with private network access.
- Enable HTTPS, database backups, monitoring, and centralized logs.
- Run migrations as a controlled deployment step.
