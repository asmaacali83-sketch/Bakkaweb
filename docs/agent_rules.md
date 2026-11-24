# Agent Rules – Bakka Training Center

These rules are mandatory for any AI coding agent or developer working on this project.

## 1. Follow the Agreed Stack
- Frontend must use Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui.
- Backend must use Node.js and JavaScript only. Backend source files must use `.js` (or `.mjs` only if explicitly configured).
- Database must be MySQL.
- Do not replace the stack or introduce another database without explicit approval.

## 2. Understand Before Editing
- Inspect the existing repository and its package files before creating or changing files.
- Respect existing conventions and avoid overwriting working code unnecessarily.
- Read `overview.md` and `tech_stach.md` before implementation.
- If a requirement is unclear and materially affects data design or security, ask one concise clarification rather than inventing a business rule.

## 3. Security Is Mandatory
- Enforce authentication and authorization on the backend for every protected endpoint.
- Use role-based access control (RBAC) plus granular permissions and record-level ownership/assignment checks.
- Never treat hidden frontend navigation or client-side checks as security.
- Admin, staff, and student access must be separated.
- Students may only read/update explicitly allowed fields on their own profile and may only access their own enrollments, attendance, progress, and certificates.
- Staff may access only records within their assigned courses/batches and granted permissions.
- Only authorized admins may manage global users, roles, permissions, system settings, and certificate issuance/revocation.
- Hash passwords with bcrypt or Argon2. Never store plaintext passwords.
- Validate and sanitize all inputs on the backend.
- Use secure cookies or a carefully implemented token strategy, rate limiting, CORS allowlists, Helmet, and HTTPS in production.
- Do not log passwords, tokens, or unnecessary sensitive personal data.
- Never commit secrets. Provide `.env.example` with placeholders.

## 4. Data Integrity
- Use foreign keys, indexes, unique constraints, and database migrations.
- Use transactions for enrollment, capacity checks, certificate issuance, and other multi-step operations.
- Prevent duplicate active enrollment in the same batch.
- Enforce batch capacity on the server under transaction/locking or an equivalent safe strategy.
- Preserve historical enrollment and certificate records. Prefer status changes/deactivation over destructive deletion.
- Record actor and timestamp for important state changes.
- Do not fabricate student, staff, course, attendance, or certificate data in production seed scripts.

## 5. User Experience
- Create distinct dashboard experiences for Admin, Staff, and Student.
- Redirect each authenticated user to the correct dashboard based on verified server-side identity and role.
- Use consistent design tokens, spacing, typography, and reusable components.
- Make all pages responsive and accessible.
- Include loading, empty, error, success, and confirmation states.
- Use clear form labels and actionable validation messages.
- Tables must support practical search, filtering, pagination, and appropriate sorting.

## 6. Code Quality
- Use feature-based organization and separate UI, API, business logic, and database concerns.
- Keep controllers thin; put business rules in services.
- Use centralized error handling and consistent API response shapes.
- Use TypeScript types in the frontend; do not silently use `any` where a useful type can be defined.
- Use JavaScript in the backend as specified.
- Avoid duplicated logic and giant components.
- Add comments for non-obvious business rules, not for every line.
- Do not add dependencies unless they solve a real project need.

## 7. Required Work Process
1. Inspect the repository.
2. Read all project documentation.
3. Propose or confirm the implementation plan.
4. Define database schema and migrations.
5. Implement authentication and authorization first.
6. Implement role-specific layouts and dashboards.
7. Implement core modules in dependency order: users, students/staff, courses/batches, enrollments, attendance/progress, certificates, reports.
8. Add tests as each module is implemented.
9. Run lint, type checks, tests, and production builds.
10. Summarize completed work, changed files, commands run, test results, and remaining tasks.

## 8. Definition of Done
A feature is not complete until:
- Its UI is responsive and has loading/error/empty states.
- Its backend endpoint validates input and enforces permissions.
- Its database changes have migrations and integrity constraints.
- Important actions are audited.
- Relevant automated tests pass.
- No secrets or credentials are committed.
- Documentation is updated where necessary.

## 9. Do Not
- Do not put all business logic in frontend components.
- Do not trust a role or user ID sent by the client.
- Do not expose all students to every staff member.
- Do not allow students to access another student's records.
- Do not issue certificates just because a button is clicked; validate eligibility and approval.
- Do not delete historical enrollments or issued certificates without an approved retention policy.
- Do not claim a feature or test is complete unless it has actually been implemented or run.
