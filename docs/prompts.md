# AI Development Prompts – Bakka Training Center

Use these prompts in order with your coding agent. Provide the agent with the project documentation files before starting.

## Prompt 1 – Project Setup and Planning

```text
You are a senior full-stack engineer. Build the Bakka Training Center Administration System using the requirements in overview.md, tech_stach.md, and agent_rules.md.

Technology constraints:
- Frontend: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui.
- Backend: Node.js + Express using JavaScript `.js` files only.
- Database: MySQL using Prisma.
- Frontend and backend must be separate applications.

First inspect the repository. Do not start by generating every feature at once.
Return:
1. Existing project assessment.
2. Proposed folder structure.
3. Implementation phases and dependencies.
4. Important assumptions or questions.
Then set up the frontend, backend, shared API conventions, environment examples, linting, and README. Do not implement fake authentication or insecure placeholder authorization.
```

## Prompt 2 – Database Design and Migrations

```text
Design the MySQL database for Bakka Training Center based on overview.md.

Create Prisma schema and migrations for users, roles, permissions, students, staff, courses, batches, batch_staff, enrollments, sessions, attendance, optional assessments/results, certificates, announcements, and audit_logs.

Requirements:
- Add foreign keys, indexes, unique identifiers, and appropriate status enums.
- Preserve enrollment and certificate history.
- Support staff assignment to batches.
- Support role-based and granular permissions.
- Prevent duplicate active enrollment in a batch.
- Ensure capacity checks can be performed safely inside a transaction.
- Add realistic development-only seed data clearly marked as fake.
Explain the relationships and migration commands. Backend code must remain JavaScript.
```

## Prompt 3 – Authentication and Authorization

```text
Implement secure authentication for the system.

Create login, logout, current-user, and password-reset foundations. Hash passwords using Argon2 or bcrypt. Use a secure, consistent session or access/refresh-token strategy and document it.

Implement backend middleware for:
- Authentication.
- Role checks.
- Permission checks.
- Record-level checks for student ownership and staff batch assignment.

Roles: admin, staff, student.

Rules:
- Admin can access system-wide features according to admin permissions.
- Staff can only access assigned batches and permitted operations.
- Students can only access their own records.
- Never trust role, user ID, or permissions supplied by the browser.
- Add rate limiting, Helmet, CORS allowlist, validation, and centralized error handling.

Write automated tests proving that unauthorized direct API calls are rejected. Frontend is TypeScript; backend is JavaScript `.js`.
```

## Prompt 4 – Application Layout and Role Dashboards

```text
Build a polished, responsive dashboard experience for Bakka Training Center using Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui.

Create separate layouts, navigation, route protection, and dashboards for:
1. Admin.
2. Staff.
3. Student.

Admin dashboard: student count, staff count, active courses/batches, pending enrollments, certificates, recent activity, and reports.
Staff dashboard: assigned batches, assigned students, upcoming sessions, attendance tasks, and recent activity.
Student dashboard: profile summary, current courses, schedule, attendance/progress, and certificates.

Load dashboard data from authenticated backend endpoints. Do not use hardcoded statistics as if they were real. Show useful loading, error, and empty states. The backend must enforce access even when a user manually enters a URL.
```

## Prompt 5 – Student and Staff Management

```text
Implement Student Management and Staff Management.

Student features:
- Create and edit student profiles.
- Generate unique student numbers on the server.
- Search, filter, sort, and paginate.
- View student profile, enrollment history, attendance, progress, and certificates.
- Deactivate records without destroying history.

Staff features:
- Create and edit staff profiles.
- Generate unique staff numbers.
- Assign staff to batches/courses.
- Configure permissions according to admin policy.

Restrict every action through backend permissions. Students must not access other students' records. Staff must not access students outside their assigned batches unless explicitly granted. Add validation, audit logs, and tests.
```

## Prompt 6 – Courses and Batches

```text
Implement Course and Batch Management.

Course fields should include title, code, description, category, duration, fee if applicable, prerequisites, and status.
Batch fields should include course, batch name/code, start date, end date, capacity, schedule, location/online details, and status.

Allow authorized admins to create, edit, publish, archive, and manage courses and batches. Allow admins to assign staff to batches. Provide searchable and paginated tables and clear forms.

Validate dates, capacity, duplicate course codes, and staff assignment. Staff can view only assigned batches. Add backend tests and migrations if needed.
```

## Prompt 7 – Student Registration and Course Enrollment

```text
Implement student registration and course enrollment as two separate workflows.

Workflow:
1. Authorized user creates a student profile.
2. Backend generates a unique student number.
3. Authorized user selects an available course batch.
4. Backend checks prerequisites, batch status, capacity, and duplicate active enrollment.
5. Enrollment is saved with an explicit status and audit information.
6. If approval is required, keep it pending until an authorized user approves it.
7. Student sees their own enrollment and status in their dashboard.

Use a database transaction and a concurrency-safe capacity check. Preserve previous enrollments. Add filters for pending, approved, active, completed, withdrawn, and rejected enrollments. Write tests for duplicate enrollment, full batches, unauthorized enrollment, and concurrent requests.
```

## Prompt 8 – Attendance and Progress

```text
Implement class sessions, attendance, and student progress.

Authorized staff should be able to create/view sessions for assigned batches and record attendance statuses: present, absent, late, excused. Support correction history and audit logs.

If assessments/results are enabled, allow authorized staff to record scores and progress for assigned students only. Students can view only their own attendance and published results. Admins can view center-wide reports.

Validate session/batch membership and prevent duplicate attendance entries for the same student and session. Add tests for all role boundaries.
```

## Prompt 9 – Certificate Management

```text
Implement certificate eligibility, approval, issuance, download, and public verification.

Rules:
- Define completion requirements in a configurable, documented way; do not invent a grading or attendance threshold without confirmation.
- Only eligible students may be submitted for certificate review.
- Admin approval is required before issuance by default.
- Generate unique certificate numbers and secure random verification codes on the backend.
- Store student, course, batch, issue date, issuer, and status.
- Generate a professional printable/downloadable PDF.
- Provide a public verification page that reveals only minimum verification details.
- Support revocation with a required reason and audit trail.
- Students can view/download only their own certificates.

Add tests for ineligible students, unauthorized issuance, revoked certificates, and valid/invalid verification codes.
```

## Prompt 10 – Reports, Search, and Audit Logs

```text
Implement reports and audit logs for Bakka Training Center.

Reports may include student registrations, course/batch enrollment, attendance, completion, and certificate issuance. Admins can access center-wide reports. Staff can access reports only for assigned batches. Students can see only personal summaries.

Add date filters, course/batch filters, pagination, and CSV export if appropriate. Audit logs must record actor, action, target, timestamp, and safe metadata for sensitive operations. Do not log passwords, tokens, or unnecessary personal data. Enforce permissions on report and export endpoints.
```

## Prompt 11 – Quality Assurance and Security Review

```text
Perform a complete quality and security review of the Bakka Training Center system.

Check:
- Admin, staff, and student authentication and dashboard routing.
- Backend RBAC, granular permissions, record ownership, and staff assignment boundaries.
- Input validation and error handling.
- SQL/ORM safety, secrets handling, CORS, rate limiting, and secure cookies/tokens.
- Enrollment duplication and capacity race conditions.
- Certificate eligibility, approval, revocation, and verification.
- Responsive UI, accessibility, loading/error/empty states.
- Database migrations, indexes, foreign keys, and backups documentation.

Run lint, frontend type checks, backend tests, frontend tests, end-to-end tests, and production builds where configured. Fix confirmed defects. Report exact commands and results; never claim tests passed if they were not run.
```

## Prompt 12 – Final Documentation and Handover

```text
Prepare the project for handover.

Update README with:
- Project overview and architecture.
- Requirements and installation steps.
- Environment variables.
- MySQL database creation and migration commands.
- Development commands for frontend and backend.
- Test and build commands.
- Default development account setup instructions without hardcoding production credentials.
- Deployment and backup notes.
- API documentation location.
- Known limitations and future improvements.

Summarize implemented modules, role permissions, important API routes, database entities, tests run, and remaining tasks. Verify that no secrets or real personal data are included in the repository.
```

## Optional design direction prompt

```text
Use a modern, professional education-management visual style for Bakka Training Center. Create a clean sidebar dashboard, clear page titles, compact statistic cards, readable data tables, consistent forms, and restrained accent colors. Make Admin, Staff, and Student dashboards visually related but tailored to each role. Prioritize clarity, accessibility, responsive behavior, and fast daily workflows over decorative effects.
```
