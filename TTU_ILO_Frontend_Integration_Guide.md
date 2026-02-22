# TTU Industrial Liaison Office — Student App
## Frontend Integration Implementation Guide
### Target: React Native (Expo or CLI) · REST API

> **Purpose:** This document is a directive for an AI model (or developer) to implement the complete service/hook/type/context layer for the TTU Internship Management Student Mobile App. Do **not** generate UI screens yet — build only the data layer (types, API services, React contexts, custom hooks, and error handling utilities). The UI layer will be implemented separately once this foundation is solid.

---

## Table of Contents

1. [Project Architecture Overview](#1-project-architecture-overview)
2. [Base Configuration](#2-base-configuration)
3. [TypeScript Type Definitions](#3-typescript-type-definitions)
4. [API Service Layer](#4-api-service-layer)
   - 4.1 Auth Service
   - 4.2 Profile Service
   - 4.3 Internship (Assumption of Duty) Service
   - 4.4 Supervisor & Zone Service
5. [React Context Providers](#5-react-context-providers)
6. [Custom Hooks](#6-custom-hooks)
7. [Error Handling Strategy](#7-error-handling-strategy)
8. [Token & Session Management](#8-token--session-management)
9. [Location Service](#9-location-service)
10. [File & Folder Structure](#10-file--folder-structure)
11. [Implementation Order](#11-implementation-order)

---

## 1. Project Architecture Overview

```
src/
├── types/           # All TypeScript interfaces and enums
├── services/        # Raw API call functions (no React)
├── contexts/        # React Context providers + reducers
├── hooks/           # Custom React hooks (consume contexts/services)
├── utils/           # Helpers: token storage, validators, error parsers
└── constants/       # API base URL, status enums, regex patterns
```

**Key Principles:**
- Services are pure async functions — no React, no hooks.
- Contexts hold global state (auth session, profile, internship status).
- Hooks wrap services + contexts into clean, component-ready interfaces.
- All API errors must be normalised into a single `AppError` shape before reaching the UI.

---

## 2. Base Configuration

### 2.1 API Base URL

```
Base URL: https://industrial-liason-api.onrender.com
```

Store this in `src/constants/api.ts`. Never hardcode it in service files.

### 2.2 HTTP Client Setup

- Use **axios** (preferred) or the native `fetch` API.
- Create a single axios instance (`apiClient`) with:
  - `baseURL` set to the constant above
  - `Content-Type: application/json` default header
  - A **request interceptor** that attaches the Bearer token from secure storage to every outgoing request (if a token exists).
  - A **response interceptor** that:
    - On `401` → clears stored token, dispatches a global logout action, and redirects to the Login screen.
    - On any error → passes the response body through the `parseApiError` utility before re-throwing.

### 2.3 Secure Storage

- Use **`expo-secure-store`** (Expo) or **`react-native-keychain`** (bare RN) to persist:
  - `access_token`
  - `refresh_token` (if the API issues one)
  - `user_id`
- Never store tokens in `AsyncStorage` (not encrypted).

---

## 3. TypeScript Type Definitions

Create one file per domain in `src/types/`. Export a barrel from `src/types/index.ts`.

### 3.1 `auth.types.ts`

```typescript
// Registration request body
interface RegisterRequest {
  email: string;        // Must match pattern: *@ttu.edu.gh
  password: string;     // Backend-enforced strength rules
  firstName: string;
  lastName: string;
}

// OTP verification request body
interface VerifyOtpRequest {
  email: string;
  otp: string;          // 6-digit string
}

// Login request body
interface LoginRequest {
  email: string;
  password: string;
}

// Password reset — step 1: request OTP
interface ForgotPasswordRequest {
  email: string;
}

// Password reset — step 2: submit new password with OTP
interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

// Auth API success response
interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
    hasProfile: boolean;  // Drives onboarding gate
  };
}

// Minimal session state stored in AuthContext
interface AuthSession {
  token: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  hasProfile: boolean;
}
```

### 3.2 `profile.types.ts`

```typescript
// Allowed enum values — derive these from the PDF; extend if API returns more
type Gender = 'MALE' | 'FEMALE' | 'OTHER';
type Session = 'Regular' | 'Weekend' | 'Evening';
type CertificateType =
  | 'BACHELOR of TECHNOLOGY'
  | 'HND'
  | 'DIPLOMA'
  | 'CERTIFICATE';

// Profile creation request body (one-time, immutable after submit)
interface CreateProfileRequest {
  indexNumber: string;       // Format: TTU/YYYY/XXXXXX
  faculty: string;
  department: string;
  programme: string;
  level: string;             // e.g. "100", "200", "300", "400"
  session: Session;
  certificateType: CertificateType;
  gender: Gender;
  dateOfBirth: string;       // ISO 8601: YYYY-MM-DD
  phoneNumber: string;       // E.164 format: +233XXXXXXXXX
}

// Full profile as returned by GET /profile/me
interface StudentProfile extends CreateProfileRequest {
  id: string;
  userId: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Profile image update — only editable field post-onboarding
interface UpdateProfileImageRequest {
  imageUri: string;          // Local file URI; service handles multipart/form-data upload
}
```

### 3.3 `internship.types.ts`

```typescript
// Internship status values — used for UI status indicator
type InternshipStatus =
  | 'NOT_REGISTERED'
  | 'REGISTERED_PENDING_ASSIGNMENT'
  | 'ASSIGNED';

// Assumption of Duty registration request body
interface AssumptionOfDutyRequest {
  periodId: string;          // UUID of the active internship period
  companyName: string;
  companyPhone: string;      // E.164 format
  companyEmail: string;
  companyAddress: string;
  companySupervisor: string;
  supervisorPhone: string;   // E.164 format
  companyCity: string;
  commencementDate: string;  // ISO 8601 datetime: YYYY-MM-DDTHH:mm:ssZ
  longitude: number;         // GPS — captured at submission time
  latitude: number;          // GPS — captured at submission time
}

// Assumption of Duty record as returned by API
interface AssumptionOfDutyRecord extends AssumptionOfDutyRequest {
  id: string;
  studentId: string;
  status: InternshipStatus;
  createdAt: string;
  updatedAt: string;
}

// Active internship period (fetched to populate periodId)
interface InternshipPeriod {
  id: string;                // UUID — use as periodId in registration
  name: string;              // e.g. "2026 Industrial Training Period"
  startDate: string;
  endDate: string;
  isActive: boolean;
}
```

### 3.4 `supervisor.types.ts`

```typescript
// Supervisor assigned to a student
interface AssignedSupervisor {
  id: string;
  name: string;
  email: string;
  phone: string;
  staffId: string;
}

// Zone assigned to a student
interface AssignedZone {
  id: string;
  name: string;
  description?: string;
  region: string;
}

// Combined assignment response
interface StudentAssignment {
  supervisor: AssignedSupervisor | null;  // null = not yet assigned
  zone: AssignedZone | null;              // null = not yet assigned
  assignmentStatus: 'PENDING' | 'ASSIGNED';
}
```

### 3.5 `api.types.ts`

```typescript
// Normalised error shape — all API errors are mapped to this
interface AppError {
  code: string;              // e.g. "INVALID_CREDENTIALS", "OTP_EXPIRED"
  message: string;           // Human-readable, safe to show in UI
  statusCode: number;        // HTTP status code
  fieldErrors?: Record<string, string>;  // Validation errors keyed by field name
}

// Generic API response wrapper (if API wraps responses)
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
```

---

## 4. API Service Layer

Each service file exports pure async functions. They receive typed request objects and return typed response objects. They throw `AppError` on failure (after normalisation by the interceptor or within the function itself).

### 4.1 `src/services/auth.service.ts`

#### `registerStudent(data: RegisterRequest): Promise<{ message: string }>`

- **Method:** `POST`
- **Endpoint:** `/auth/register`
- **Body:** `RegisterRequest`
- **Success (201):** Returns a message confirming OTP was sent to the provided email.
- **Errors to handle:**
  - `400` — Validation failed (e.g. non-TTU email, weak password). Map `fieldErrors`.
  - `409` — Email already registered. Message: `"An account with this email already exists."`
- **Post-call action:** Navigate user to OTP Verification screen, passing email as a param.

---

#### `verifyOtp(data: VerifyOtpRequest): Promise<{ message: string }>`

- **Method:** `POST`
- **Endpoint:** `/auth/verify-otp`
- **Body:** `VerifyOtpRequest`
- **Success (200):** Returns success message. Account is now verified.
- **Errors to handle:**
  - `400` — Invalid or expired OTP. Surface clear message to user.
  - `404` — Email not found.
- **Post-call action:** Navigate to Login screen.

---

#### `resendOtp(email: string): Promise<{ message: string }>`

- **Method:** `POST`
- **Endpoint:** `/auth/resend-otp`
- **Body:** `{ email }`
- **Success (200):** New OTP sent.
- **Errors to handle:**
  - `429` — Too many requests. Show cooldown message.
  - `400` — Account already verified.

---

#### `login(data: LoginRequest): Promise<AuthResponse>`

- **Method:** `POST`
- **Endpoint:** `/auth/login`
- **Body:** `LoginRequest`
- **Success (200):** Returns `AuthResponse` with JWT token and user details.
- **Errors to handle:**
  - `401` — Invalid credentials. Message: `"Incorrect email or password."`
  - `403` — Account not verified. Navigate to OTP screen.
  - `404` — Account not found.
- **Post-call actions:**
  1. Store `access_token` (and `refresh_token` if present) in secure storage.
  2. Dispatch `LOGIN_SUCCESS` to `AuthContext`.
  3. If `user.hasProfile === false` → navigate to Profile Onboarding screen.
  4. If `user.hasProfile === true` → navigate to Dashboard/Home screen.

---

#### `forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }>`

- **Method:** `POST`
- **Endpoint:** `/auth/forgot-password`
- **Body:** `ForgotPasswordRequest`
- **Success (200):** OTP/reset link sent.
- **Errors to handle:**
  - `404` — Email not found. Per security best practice, the API may still return 200 — do not confirm whether the email exists.

---

#### `resetPassword(data: ResetPasswordRequest): Promise<{ message: string }>`

- **Method:** `POST`
- **Endpoint:** `/auth/reset-password`
- **Body:** `ResetPasswordRequest`
- **Success (200):** Password updated.
- **Errors to handle:**
  - `400` — Expired OTP, password too weak, or OTP mismatch.
- **Post-call action:** Navigate to Login.

---

#### `logout(): Promise<void>`

- **Method:** `POST`
- **Endpoint:** `/auth/logout`
- **Auth required:** Yes (Bearer token)
- **Success (200):** Server-side session invalidated.
- **Post-call actions (regardless of API response):**
  1. Delete token from secure storage.
  2. Dispatch `LOGOUT` to `AuthContext`.
  3. Navigate to Login screen.

---

### 4.2 `src/services/profile.service.ts`

#### `createProfile(data: CreateProfileRequest): Promise<StudentProfile>`

- **Method:** `POST`
- **Endpoint:** `/profile` (or `/students/profile`)
- **Auth required:** Yes
- **Body:** `CreateProfileRequest`
- **Success (201):** Returns created `StudentProfile`.
- **Errors to handle:**
  - `400` — Validation errors on fields. Map to `fieldErrors` in `AppError`.
  - `409` — Profile already exists (one-time creation — block UI if already created).
- **Pre-call requirement:** Show a confirmation dialog ("Profile cannot be edited after submission. Are you sure?") and require explicit user confirmation before calling this function.
- **Post-call action:** Update `AuthContext` to set `hasProfile: true`.

---

#### `getMyProfile(): Promise<StudentProfile>`

- **Method:** `GET`
- **Endpoint:** `/profile/me`
- **Auth required:** Yes
- **Success (200):** Returns `StudentProfile`.
- **Errors to handle:**
  - `404` — Profile not yet created. Trigger onboarding flow.
  - `401` — Token expired. Interceptor handles redirect.

---

#### `updateProfileImage(data: UpdateProfileImageRequest): Promise<StudentProfile>`

- **Method:** `PATCH`
- **Endpoint:** `/profile/me/image`
- **Auth required:** Yes
- **Content-Type:** `multipart/form-data`
- **Body:** Form data with key `image` containing the file.
- **Success (200):** Returns updated `StudentProfile` with new `profileImageUrl`.
- **Errors to handle:**
  - `400` — Unsupported file type or file too large.
- **Note:** Use `react-native-image-picker` or `expo-image-picker` to select image; convert to form data before calling this service.

---

### 4.3 `src/services/internship.service.ts`

#### `getActivePeriod(): Promise<InternshipPeriod>`

- **Method:** `GET`
- **Endpoint:** `/internship-periods/active`
- **Auth required:** Yes
- **Success (200):** Returns the currently active `InternshipPeriod`.
- **Errors to handle:**
  - `404` — No active period. Display message: `"No internship period is currently open for registration."`
- **Note:** Call this when the user opens the Assumption of Duty registration screen. Use the returned `id` as `periodId` in the registration request.

---

#### `submitAssumptionOfDuty(data: AssumptionOfDutyRequest): Promise<AssumptionOfDutyRecord>`

- **Method:** `POST`
- **Endpoint:** `/assumption-of-duty`
- **Auth required:** Yes
- **Body:** `AssumptionOfDutyRequest`
- **Success (201):** Returns `AssumptionOfDutyRecord` with initial status `REGISTERED_PENDING_ASSIGNMENT`.
- **Errors to handle:**
  - `400` — Missing GPS coordinates, missing required fields, or invalid date format.
  - `404` — `periodId` does not exist or period is not active.
  - `409` — Student has already registered for this period.
  - `403` — Student profile not complete.
- **Pre-call requirements (enforced in the hook, not the service):**
  1. GPS permission must be granted.
  2. `longitude` and `latitude` must be non-null.
  3. `periodId` must be populated from a successful `getActivePeriod()` call.
- **Post-call action:** Update `InternshipContext` status to `REGISTERED_PENDING_ASSIGNMENT`.

---

#### `getMyAssumptionOfDuty(): Promise<AssumptionOfDutyRecord | null>`

- **Method:** `GET`
- **Endpoint:** `/assumption-of-duty/me`
- **Auth required:** Yes
- **Success (200):** Returns the student's existing record, or `null` / 404 if not yet registered.
- **Errors to handle:**
  - `404` — Not yet registered. Return `null`; do not throw. Status = `NOT_REGISTERED`.

---

### 4.4 `src/services/assignment.service.ts`

#### `getMyAssignment(): Promise<StudentAssignment>`

- **Method:** `GET`
- **Endpoint:** `/assignments/me`
- **Auth required:** Yes
- **Success (200):** Returns `StudentAssignment`. Both `supervisor` and `zone` may be `null` if assignment is still pending.
- **Errors to handle:**
  - `404` — No assignment record yet. Return a `StudentAssignment` with both fields `null` and status `PENDING`. Do **not** show an error screen; show the friendly pending message instead.
- **Polling guidance:** This endpoint can be called on screen focus (use `useFocusEffect` in React Navigation). Do not poll on a timer automatically — let the user refresh manually or check on app open.

---

## 5. React Context Providers

Create three context providers. Each one holds a slice of global state and exposes a dispatch function (via `useReducer`) plus convenience selectors.

### 5.1 `AuthContext`

**State shape:**
```
{
  session: AuthSession | null,
  isLoading: boolean,         // True during initial token check on app launch
  isAuthenticated: boolean,
}
```

**Actions:**
- `RESTORE_TOKEN` — Called on app launch after reading token from secure storage. Sets `session`, sets `isLoading: false`.
- `LOGIN_SUCCESS` — Stores `AuthResponse` data into state.
- `LOGOUT` — Clears all state and token.
- `PROFILE_CREATED` — Flips `session.hasProfile` to `true`.

**Provider responsibilities:**
- On mount, read token from secure storage and attempt to restore session (call a `/auth/me` or `/users/me` endpoint to validate the stored token). If the token is invalid or expired, dispatch `LOGOUT`.
- Wrap the entire app in this provider.

**Navigation gate logic (implement in a root navigator, not in the context itself):**
- If `isLoading` → show a Splash/Loading screen.
- If `!isAuthenticated` → show Auth stack (Register, Login, OTP, ForgotPassword).
- If `isAuthenticated && !session.hasProfile` → show Onboarding stack (Profile Creation).
- If `isAuthenticated && session.hasProfile` → show Main app stack.

---

### 5.2 `ProfileContext`

**State shape:**
```
{
  profile: StudentProfile | null,
  isLoading: boolean,
  error: AppError | null,
}
```

**Actions:**
- `LOAD_PROFILE_START` / `LOAD_PROFILE_SUCCESS` / `LOAD_PROFILE_ERROR`
- `UPDATE_PROFILE_IMAGE_SUCCESS`

**Provider responsibilities:**
- Fetch profile from `getMyProfile()` when the user is authenticated and `hasProfile` is true.
- Expose profile data to any screen that needs it without re-fetching.

---

### 5.3 `InternshipContext`

**State shape:**
```
{
  status: InternshipStatus,           // NOT_REGISTERED | REGISTERED_PENDING_ASSIGNMENT | ASSIGNED
  record: AssumptionOfDutyRecord | null,
  assignment: StudentAssignment | null,
  activePeriod: InternshipPeriod | null,
  isLoading: boolean,
  error: AppError | null,
}
```

**Actions:**
- `LOAD_STATUS_START` / `LOAD_STATUS_SUCCESS` / `LOAD_STATUS_ERROR`
- `REGISTRATION_SUCCESS` — Sets `record` and status to `REGISTERED_PENDING_ASSIGNMENT`.
- `ASSIGNMENT_LOADED` — Sets `assignment`. If both supervisor and zone are non-null, sets status to `ASSIGNED`.
- `SET_ACTIVE_PERIOD`

**Provider responsibilities:**
- On load (when authenticated and profile exists), call `getMyAssumptionOfDuty()` and `getMyAssignment()` to hydrate state.
- Derive `status` from the combination of `record` and `assignment`.

---

## 6. Custom Hooks

Hooks should be the **only** interface that screen components use — no screen should call a service directly.

### 6.1 `useAuth()`

Consumes `AuthContext`. Exposes:
- `session`, `isAuthenticated`, `isLoading`
- `login(data: LoginRequest): Promise<void>`
- `register(data: RegisterRequest): Promise<void>`
- `verifyOtp(data: VerifyOtpRequest): Promise<void>`
- `resendOtp(email: string): Promise<void>`
- `forgotPassword(email: string): Promise<void>`
- `resetPassword(data: ResetPasswordRequest): Promise<void>`
- `logout(): Promise<void>`
- `error: AppError | null` — last error from any auth operation
- `isSubmitting: boolean` — loading state during form submissions

Each method wraps the corresponding service call, sets `isSubmitting`, catches errors into local state, and dispatches to `AuthContext` on success.

---

### 6.2 `useProfile()`

Consumes `ProfileContext`. Exposes:
- `profile: StudentProfile | null`
- `isLoading`, `error`
- `createProfile(data: CreateProfileRequest): Promise<void>` — includes confirmation guard logic
- `updateProfileImage(uri: string): Promise<void>`
- `refetch(): Promise<void>`

---

### 6.3 `useInternship()`

Consumes `InternshipContext`. Exposes:
- `status: InternshipStatus`
- `record`, `assignment`, `activePeriod`
- `isLoading`, `error`
- `fetchActivePeriod(): Promise<void>`
- `submitRegistration(data: Omit<AssumptionOfDutyRequest, 'longitude' | 'latitude' | 'periodId'>): Promise<void>`
  - This hook method automatically:
    1. Gets current GPS location via the location service.
    2. Fetches `activePeriod.id` from context (or fetches if missing).
    3. Merges coordinates + periodId into the data.
    4. Calls `internship.service.submitAssumptionOfDuty()`.
- `refreshAssignment(): Promise<void>`

---

### 6.4 `useLocation()`

A standalone hook (not tied to a context). Exposes:
- `location: { latitude: number; longitude: number } | null`
- `permissionStatus: 'undetermined' | 'granted' | 'denied'`
- `isLoading: boolean`
- `error: AppError | null`
- `requestPermission(): Promise<boolean>` — returns `true` if granted
- `getCurrentLocation(): Promise<{ latitude: number; longitude: number }>` — throws `AppError` if permission denied or location unavailable

---

### 6.5 `useFormValidation(schema: ZodSchema)`

A generic hook wrapping **Zod** for form validation. Exposes:
- `errors: Record<string, string>`
- `validate(data: unknown): boolean`
- `clearErrors(): void`

Define Zod schemas for each form in `src/validators/`:
- `registerSchema` — email must end in `@ttu.edu.gh`, password min requirements
- `loginSchema`
- `otpSchema` — exactly 6 digits
- `profileSchema` — all required fields, phone in E.164, date format
- `assumptionOfDutySchema` — all fields required, valid phone, valid email

---

## 7. Error Handling Strategy

### 7.1 `parseApiError(error: unknown): AppError`

Create this utility in `src/utils/error.utils.ts`. It accepts any thrown value and returns a normalised `AppError`.

**Mapping logic:**

| HTTP Status | Code Constant | Default User Message |
|-------------|--------------|----------------------|
| 400 | `VALIDATION_ERROR` | "Please check the information you entered." |
| 401 | `UNAUTHORIZED` | "Your session has expired. Please log in again." |
| 403 | `FORBIDDEN` | "You are not allowed to perform this action." |
| 404 | `NOT_FOUND` | "The requested resource was not found." |
| 409 | `CONFLICT` | "This action conflicts with existing data." |
| 422 | `UNPROCESSABLE` | "Some fields contain invalid data." |
| 429 | `RATE_LIMITED` | "Too many attempts. Please wait and try again." |
| 500+ | `SERVER_ERROR` | "Something went wrong on our end. Please try again later." |
| Network error | `NETWORK_ERROR` | "No internet connection. Please check your network." |

- Attempt to parse `error.response.data` for a `message` string and `errors` object from the API response body.
- If the API returns field-level errors, map them into `fieldErrors: Record<string, string>`.
- Always fall back to the default message if the API body is unparseable.

### 7.2 Error Display Guidelines (for hooks)

- **Field-level errors** (`fieldErrors`) → pass to form components to display inline under each input.
- **Global errors** → surface via a toast or an alert banner at the top of the screen.
- **Network errors** → show a persistent banner, not a modal.
- **401 errors** → interceptor handles silently by redirecting to Login; do not show an error to the user.

---

## 8. Token & Session Management

### 8.1 Token Storage Keys

Define constants in `src/constants/storage.ts`:
```
ACCESS_TOKEN_KEY = 'ilo_access_token'
REFRESH_TOKEN_KEY = 'ilo_refresh_token'
USER_SESSION_KEY = 'ilo_user_session'
```

### 8.2 Session Restoration on App Launch

In `AuthContext`'s `useEffect` on mount:
1. Read `ACCESS_TOKEN_KEY` from secure storage.
2. If no token → dispatch `RESTORE_TOKEN(null)`, show Auth stack.
3. If token exists → call a lightweight authenticated endpoint (e.g. `GET /users/me` or `GET /auth/me`) to validate.
4. If valid → dispatch `RESTORE_TOKEN(session)`, show appropriate stack.
5. If invalid (401) → clear storage, dispatch `RESTORE_TOKEN(null)`.

### 8.3 Token Attachment

Handled by the axios request interceptor — reads from secure storage and sets `Authorization: Bearer <token>` header.

### 8.4 Refresh Token Flow (implement only if API supports it)

- If a `refresh_token` is issued at login, store it separately.
- On `401`, before logging out, attempt one refresh call to `/auth/refresh` with the refresh token.
- If refresh succeeds → store new access token, retry the original request.
- If refresh fails → logout.

---

## 9. Location Service

### 9.1 `src/services/location.service.ts`

Use **`expo-location`** (Expo) or **`@react-native-community/geolocation`** (bare RN).

#### `requestLocationPermission(): Promise<boolean>`

- Calls the OS-level permission request.
- Returns `true` if granted, `false` if denied.
- On denial, store the denial in context so the UI can show a "permission required" state without re-requesting.

#### `getCurrentCoordinates(): Promise<{ latitude: number; longitude: number }>`

- Calls the location API with **high accuracy** mode.
- Timeout: 15 seconds.
- On failure → throw `AppError` with `code: 'LOCATION_UNAVAILABLE'` and message: `"Unable to retrieve your current location. Please ensure GPS is enabled."`

### 9.2 Location Permission UX Rules (enforce in `useLocation` hook)

- **Never** submit the Assumption of Duty form without valid coordinates.
- If permission is denied → show an inline warning with a button to open app settings.
- If location fetch times out → show a retry option.
- Do **not** cache GPS coordinates across sessions — always fetch fresh at submission time.

---

## 10. File & Folder Structure

```
src/
├── constants/
│   ├── api.ts              # BASE_URL
│   ├── storage.ts          # Secure storage key constants
│   └── status.ts           # InternshipStatus enum values
│
├── types/
│   ├── auth.types.ts
│   ├── profile.types.ts
│   ├── internship.types.ts
│   ├── supervisor.types.ts
│   ├── api.types.ts        # AppError, ApiResponse<T>
│   └── index.ts            # Barrel export
│
├── services/
│   ├── apiClient.ts        # Axios instance with interceptors
│   ├── auth.service.ts
│   ├── profile.service.ts
│   ├── internship.service.ts
│   ├── assignment.service.ts
│   └── location.service.ts
│
├── contexts/
│   ├── AuthContext.tsx      # Provider + reducer + useAuthContext hook
│   ├── ProfileContext.tsx
│   ├── InternshipContext.tsx
│   └── index.ts            # Combined AppProvider wrapper
│
├── hooks/
│   ├── useAuth.ts
│   ├── useProfile.ts
│   ├── useInternship.ts
│   ├── useLocation.ts
│   └── useFormValidation.ts
│
├── validators/
│   ├── auth.schemas.ts     # Zod schemas for auth forms
│   ├── profile.schemas.ts
│   └── internship.schemas.ts
│
└── utils/
    ├── error.utils.ts      # parseApiError()
    ├── token.utils.ts      # read/write/delete token from secure storage
    └── format.utils.ts     # Date formatting, phone display helpers
```

---

## 11. Implementation Order

Follow this sequence to avoid dependency issues:

1. **Constants** — `api.ts`, `storage.ts`, `status.ts`
2. **Types** — all `*.types.ts` files, then `index.ts` barrel
3. **Validators** — Zod schemas (no dependencies on services)
4. **Utils** — `error.utils.ts`, `token.utils.ts`, `format.utils.ts`
5. **API Client** — `apiClient.ts` with interceptors (depends on utils + constants)
6. **Services** — in order: `auth` → `profile` → `internship` → `assignment` → `location`
7. **Contexts** — `AuthContext` first (others depend on auth state), then `ProfileContext`, then `InternshipContext`
8. **Hooks** — `useAuth` → `useProfile` → `useInternship` → `useLocation` → `useFormValidation`
9. **AppProvider** — combine all context providers into a single wrapper component
10. **Navigation gate** — implement the root navigator logic that reads from `AuthContext` to route between Auth / Onboarding / Main stacks

---

## Appendix A: Known API Constraints

| Constraint | Implementation Note |
|-----------|---------------------|
| Profile is immutable after creation | Disable all profile form fields after submit; only expose image update UI |
| Internship registration requires live GPS | Block submit button until coordinates are fetched; never use cached/stale coordinates |
| OTP verification required before login | After registration, immediately route to OTP screen; block login if `isVerified: false` |
| Assignments are asynchronous | After registration, poll `getMyAssignment()` on each screen focus — do not block UI waiting for assignment |
| Only TTU emails allowed | Validate `@ttu.edu.gh` domain client-side before API call to give instant feedback |
| Active period required for registration | Always fetch `getActivePeriod()` before showing registration form; show "no open period" state if 404 |

---

## Appendix B: Status Indicator Mapping

The UI must always display one of three internship status states. The `InternshipContext` derives these automatically:

| `status` value | Condition | Display Label | Display Colour |
|---------------|-----------|--------------|---------------|
| `NOT_REGISTERED` | No `record` found | "Not Registered" | Red / Warning |
| `REGISTERED_PENDING_ASSIGNMENT` | `record` exists, `assignment.supervisor` is null | "Registered – Awaiting Assignment" | Amber / Info |
| `ASSIGNED` | `record` exists, `assignment.supervisor` is non-null | "Assigned" | Green / Success |

When status is `REGISTERED_PENDING_ASSIGNMENT`, display the message:
> *"Your supervisor and zone are being assigned. Please check back later."*

Never show a blank screen or a raw API error for the pending state.

---

*End of Implementation Guide — v1.0 · TTU Industrial Liaison Office*
