# TTU Industrial Liaison Office — Student App
## Screen Flow, UI Specification & Component Guide
### Platform: Expo (React Native) · Expo Router v3 · File-based Routing

> **Purpose:** This document directs an AI model to build the complete UI layer of the TTU ILO Student Mobile App using Expo and Expo Router. The data layer (services, hooks, contexts) is already implemented. This doc covers: Expo Router file structure, every screen's layout, component breakdown, element positioning, user flows, navigation transitions, and design system tokens. Do **not** re-implement services or hooks — import and consume them as described in the Integration Guide.

---

## Table of Contents

1. [Design System](#1-design-system)
2. [Expo Router File Structure](#2-expo-router-file-structure)
3. [Root Layout & Navigation Gates](#3-root-layout--navigation-gates)
4. [Auth Stack Screens](#4-auth-stack-screens)
   - 4.1 Welcome / Splash
   - 4.2 Register
   - 4.3 OTP Verification
   - 4.4 Login
   - 4.5 Forgot Password
   - 4.6 Reset Password
5. [Onboarding Stack — Profile Creation](#5-onboarding-stack--profile-creation)
6. [Main App — Tab Navigator](#6-main-app--tab-navigator)
   - 6.1 Home (Dashboard)
   - 6.2 Internship Registration (Assumption of Duty)
   - 6.3 My Assignment
   - 6.4 Profile
7. [Shared / Reusable Components](#7-shared--reusable-components)
8. [Screen Transition Rules](#8-screen-transition-rules)
9. [Empty States & Feedback Screens](#9-empty-states--feedback-screens)
10. [Accessibility & UX Rules](#10-accessibility--ux-rules)

---

## 1. Design System

All screens must use these tokens. Define them in `src/theme/tokens.ts` and consume via a `useTheme()` hook or direct import. Do **not** hardcode hex values or font sizes inside components.

### 1.1 Colour Palette

```
Primary:        #1A3C6E   (TTU deep navy — brand primary)
Primary Light:  #2A5BA8   (interactive states, links)
Accent:         #F4A622   (TTU gold — CTAs, highlights)
Accent Light:   #FBBF4A   (hover/pressed state of accent)

Background:     #F5F6FA   (app background — off-white)
Surface:        #FFFFFF   (cards, modals, inputs)
Surface Alt:    #EEF1F8   (subtle section backgrounds)

Text Primary:   #111827   (headings, body)
Text Secondary: #6B7280   (subtitles, captions, placeholders)
Text Disabled:  #9CA3AF

Border:         #E5E7EB   (input borders, dividers)
Border Focus:   #1A3C6E   (primary on focus)

Success:        #16A34A
Success Light:  #DCFCE7
Warning:        #D97706
Warning Light:  #FEF3C7
Error:          #DC2626
Error Light:    #FEE2E2
Info:           #2563EB
Info Light:     #DBEAFE

Status — Not Registered:       Error + Error Light
Status — Pending Assignment:   Warning + Warning Light
Status — Assigned:             Success + Success Light
```

### 1.2 Typography

Use **`expo-google-fonts`** with the following pair:
- **Display / Headings:** `Outfit_700Bold`, `Outfit_600SemiBold`
- **Body / Labels:** `Inter_400Regular`, `Inter_500Medium`, `Inter_600SemiBold`

```
Display Large:   Outfit Bold,   28px, lineHeight 34, letterSpacing -0.5
Display Medium:  Outfit Bold,   24px, lineHeight 30, letterSpacing -0.3
Heading 1:       Outfit SemiBold, 20px, lineHeight 26
Heading 2:       Outfit SemiBold, 17px, lineHeight 22
Body Large:      Inter Regular, 16px, lineHeight 24
Body:            Inter Regular, 14px, lineHeight 22
Body Small:      Inter Regular, 12px, lineHeight 18
Label:           Inter Medium,  13px, lineHeight 18, letterSpacing 0.2
Caption:         Inter Regular, 11px, lineHeight 16, color Text Secondary
Button:          Inter SemiBold, 15px, letterSpacing 0.3
```

### 1.3 Spacing Scale

Base unit: 4px. All spacing values are multiples.

```
xs:   4px
sm:   8px
md:  16px
lg:  24px
xl:  32px
2xl: 48px
3xl: 64px
```

Screen horizontal padding: `md` (16px) on all sides.

### 1.4 Border Radius

```
sm:   6px   (tags, chips)
md:  10px   (inputs, small cards)
lg:  16px   (cards, modals)
xl:  24px   (bottom sheets, large cards)
full: 9999px (pills, avatar circles, FABs)
```

### 1.5 Shadows (iOS/Android cross-platform)

```
card:
  shadowColor: #000
  shadowOffset: { width: 0, height: 2 }
  shadowOpacity: 0.06
  shadowRadius: 8
  elevation: 3

elevated:
  shadowColor: #1A3C6E
  shadowOffset: { width: 0, height: 4 }
  shadowOpacity: 0.12
  shadowRadius: 16
  elevation: 6
```

### 1.6 Animation Defaults

Use **`react-native-reanimated`** for all animations.

```
durationFast:   150ms   (micro-interactions, toggles)
durationNormal: 250ms   (screen elements, inputs)
durationSlow:   400ms   (screen transitions, modals)
easing:         Easing.bezier(0.25, 0.1, 0.25, 1)  (ease-out default)
```

---

## 2. Expo Router File Structure

```
app/
├── _layout.tsx                   # Root layout — AuthContext provider + navigation gate
├── index.tsx                     # Redirect only — determines initial route
│
├── (auth)/                       # Auth group — no tab bar
│   ├── _layout.tsx               # Stack layout for auth screens
│   ├── welcome.tsx               # Welcome / landing screen
│   ├── register.tsx
│   ├── verify-otp.tsx
│   ├── login.tsx
│   ├── forgot-password.tsx
│   └── reset-password.tsx
│
├── (onboarding)/                 # Onboarding group — shown after login if no profile
│   ├── _layout.tsx               # Stack layout, no back navigation to auth
│   └── create-profile.tsx        # Multi-step profile creation
│
└── (app)/                        # Main app group — authenticated users with profile
    ├── _layout.tsx               # Tab navigator layout
    ├── index.tsx                 # Home / Dashboard tab
    ├── register-internship.tsx   # Assumption of Duty tab
    ├── assignment.tsx            # My Assignment tab
    └── profile.tsx               # Profile tab

src/
├── components/
│   ├── ui/                       # Primitives: Button, Input, Card, Badge, etc.
│   ├── forms/                    # Form-specific composites: FormField, OtpInput, etc.
│   ├── internship/               # Domain: StatusCard, AssignmentCard, PeriodBanner
│   ├── profile/                  # Domain: ProfileHeader, InfoRow, ImagePicker
│   └── layout/                   # ScreenWrapper, KeyboardAware, SectionHeader
├── theme/
│   └── tokens.ts
└── (services, hooks, contexts — already implemented)
```

---

## 3. Root Layout & Navigation Gates

### `app/_layout.tsx`

**Role:** Wraps the entire app in the `AppProvider` (all contexts combined). Reads `AuthContext` to decide which route group to show. This is the single source of truth for navigation gating.

**Logic (implement with `useEffect` + `router.replace`):**

```
On mount:
  → AuthContext.isLoading === true
    → Render <SplashScreen /> (full-screen loading, TTU logo centred, Primary background)

  → AuthContext.isLoading === false:
    → !isAuthenticated
        → router.replace('/(auth)/welcome')

    → isAuthenticated && !session.hasProfile
        → router.replace('/(onboarding)/create-profile')

    → isAuthenticated && session.hasProfile
        → router.replace('/(app)/')
```

**Splash Screen (rendered inline during isLoading):**
- Full screen, background: Primary (`#1A3C6E`)
- Centre: TTU logo (image asset) — 120×120px
- Below logo: App name "ILO Student Portal" — Display Medium, colour White
- Below name: "Takoradi Technical University" — Caption, colour `rgba(255,255,255,0.6)`
- Bottom: `ActivityIndicator` — colour Accent (`#F4A622`)
- No status bar content visible (use `expo-status-bar` with `style="light"`)

---

### `app/(auth)/_layout.tsx`

- `Stack` navigator with `headerShown: false` for all screens.
- Screen options: `animation: 'slide_from_right'` (default).
- `welcome.tsx` → `animation: 'none'` (no back navigation possible).

### `app/(onboarding)/_layout.tsx`

- `Stack` navigator, `headerShown: false`.
- Prevent back gesture to auth screens (use `gestureEnabled: false`).

### `app/(app)/_layout.tsx`

- `Tabs` navigator.
- Tab bar: background Surface (`#FFFFFF`), border top `Border` colour, height 64px (account for safe area).
- **4 tabs**, in order:

| Tab | Icon (lucide-react-native) | Label | Route |
|-----|---------------------------|-------|-------|
| Home | `LayoutDashboard` | Home | `index` |
| Internship | `ClipboardList` | Internship | `register-internship` |
| Assignment | `UserCheck` | Assignment | `assignment` |
| Profile | `UserCircle` | Profile | `profile` |

- Active tab: icon + label colour = Primary (`#1A3C6E`).
- Inactive tab: icon + label colour = Text Secondary (`#6B7280`).
- Active indicator: small 3px rounded pill above icon, colour Accent (`#F4A622`).
- Tab labels: Caption style.

---

## 4. Auth Stack Screens

### 4.1 `(auth)/welcome.tsx` — Welcome Screen

**Purpose:** Entry point for unauthenticated users. Introduces the app and offers Login / Register.

**Layout (full screen, no scroll):**

```
┌─────────────────────────────────┐
│  [Status Bar — light content]   │
│                                 │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  ← Background: Primary gradient
│  ░  [Illustration / Graphic]  ░  │    (#1A3C6E → #2A5BA8, top 55% of screen)
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                 │
│  ╔═════════════════════════════╗│  ← White rounded top sheet (borderRadius xl top)
│  ║  TTU Logo (small, 48×48)   ║│    starts at 55% mark, slides up on mount
│  ║                             ║│
│  ║  "Welcome to ILO Portal"   ║│  ← Display Medium, Text Primary
│  ║                             ║│
│  ║  "The official internship  ║│  ← Body, Text Secondary, centred
│  ║   management platform for  ║│
│  ║   TTU students."           ║│
│  ║                             ║│
│  ║  [  Get Started  ]  ← CTA  ║│  ← Primary Button, full width, Accent bg
│  ║                             ║│
│  ║  [  Sign In  ]  ← secondary║│  ← Outline Button, full width, Primary border
│  ║                             ║│
│  ║  "By continuing, you agree ║│  ← Caption, Text Secondary, centred, linked
│  ║   to our Terms of Service" ║│
│  ╚═════════════════════════════╝│
└─────────────────────────────────┘
```

**Illustration area:** Use an SVG illustration of a student/graduation/office concept (embed as a local asset). Overlay TTU logo centred at the bottom of the illustration area.

**Animations (on mount):**
- Illustration fades in: 0 → 1 opacity over 400ms, delay 100ms.
- White sheet slides up: translateY(60) → 0 over 400ms, easing ease-out, delay 200ms.
- Buttons fade in staggered: 300ms delay apart.

**Navigation:**
- "Get Started" → `router.push('/(auth)/register')`
- "Sign In" → `router.push('/(auth)/login')`

---

### 4.2 `(auth)/register.tsx` — Registration Screen

**Purpose:** Student creates their account using a TTU email.

**Layout (scrollable, KeyboardAwareScrollView):**

```
┌─────────────────────────────────┐
│  ← Back  [Header: "Create      │  ← Custom header: back chevron left,
│           Account"]             │    title centred, Heading 1
│─────────────────────────────────│
│  "Join the ILO Student Portal"  │  ← Body, Text Secondary, top padding lg
│                                 │
│  [First Name Input]             │  ← FormField component
│  [Last Name Input]              │
│  [University Email Input]       │  ← Keyboard type: email, autocapitalize: none
│                                 │    Hint text: "Use your @ttu.edu.gh email"
│  [Password Input]               │  ← secureTextEntry, show/hide toggle icon
│  [Confirm Password Input]       │  ← Validate match client-side
│                                 │
│  [Password strength indicator]  │  ← 4-segment bar: red/orange/yellow/green
│                                 │
│  [  Create Account  ]           │  ← Primary Button, full width
│                                 │
│  ─────────── or ──────────      │
│                                 │
│  Already have an account?       │  ← Body Small, centred
│  [Sign In]                      │  ← Text link, Primary Light colour
└─────────────────────────────────┘
```

**Validation (client-side, before API call):**
- Email: must end in `@ttu.edu.gh`. Show inline error immediately on blur.
- Password: min 8 chars, must contain uppercase, lowercase, number, special char.
- Passwords must match.
- First/Last name: non-empty.

**States:**
- Default → all inputs empty.
- Loading → Button shows `ActivityIndicator`, disabled, all inputs disabled.
- Field error → input border turns Error colour, error message below input in Error colour, Body Small.
- Global error (e.g. 409 conflict) → `ErrorBanner` component at top of form.

**On success:** `router.replace('/(auth)/verify-otp')` passing `email` as a route param.

---

### 4.3 `(auth)/verify-otp.tsx` — OTP Verification

**Purpose:** Student enters the 6-digit OTP sent to their TTU email.

**Layout (centred, no scroll needed):**

```
┌─────────────────────────────────┐
│  ← Back  [Header: "Verify       │
│           Email"]               │
│─────────────────────────────────│
│                                 │
│  [Email icon — large, centred]  │  ← Lucide `Mail`, size 64, colour Primary
│                                 │
│  "Check your email"             │  ← Display Medium, centred
│                                 │
│  "We sent a 6-digit code to"   │  ← Body, Text Secondary, centred
│  "student@ttu.edu.gh"          │  ← Body SemiBold, Primary colour, centred
│                                 │
│  [  OTP Input — 6 boxes  ]      │  ← OtpInput component (see §7)
│                                 │
│  [  Verify Email  ]             │  ← Primary Button, full width
│                                 │
│  Didn't receive it?             │  ← Body Small, Text Secondary
│  [Resend Code] (countdown timer)│  ← Text link; disabled with 60s countdown
│                                 │
└─────────────────────────────────┘
```

**OTP Input behaviour:**
- 6 individual `TextInput` boxes in a row, equal width, bordered.
- Auto-advances focus to next box on each digit entry.
- On backspace in empty box, moves focus to previous box.
- On paste, distributes digits across all boxes.
- Focused box: border Primary, subtle scale-up animation.

**Resend countdown:**
- On screen load, start 60-second countdown.
- "Resend Code" is a disabled grey text link during countdown.
- Display: "Resend in 0:42" while counting.
- After countdown, link becomes active Primary colour.
- On tap, call `resendOtp()` and restart countdown.

**On success:** `router.replace('/(auth)/login')`, show a success toast.

---

### 4.4 `(auth)/login.tsx` — Login Screen

**Purpose:** Verified students sign in.

**Layout (scrollable):**

```
┌─────────────────────────────────┐
│  (No back button — root of      │
│   auth flow after Welcome)      │
│─────────────────────────────────│
│  [TTU Logo — 56×56, top-left]  │
│                                 │
│  "Welcome back"                 │  ← Display Medium
│  "Sign in to continue"          │  ← Body, Text Secondary
│                                 │
│  [University Email Input]       │
│  [Password Input]               │  ← secureTextEntry + show/hide
│                                 │
│  [Forgot Password?]             │  ← Text link, right-aligned, Primary Light
│                                 │
│  [  Sign In  ]                  │  ← Primary Button, full width
│                                 │
│  Don't have an account?         │  ← Body Small, centred
│  [Create Account]               │  ← Text link
└─────────────────────────────────┘
```

**Error states:**
- `401` → Inline error banner: "Incorrect email or password. Please try again."
- `403` (unverified) → Error banner with an action link: "Verify your email →" that navigates to OTP screen passing the email.

**On success:**
- `hasProfile === false` → `router.replace('/(onboarding)/create-profile')`
- `hasProfile === true` → `router.replace('/(app)/')`

---

### 4.5 `(auth)/forgot-password.tsx` — Forgot Password

**Layout:**

```
┌─────────────────────────────────┐
│  ← Back  ["Forgot Password"]    │
│─────────────────────────────────│
│  [Lock icon — 56px, Primary]    │  ← centred
│                                 │
│  "Reset your password"          │  ← Display Medium, centred
│  "Enter your university email   │  ← Body, Text Secondary, centred
│   and we'll send you a reset   │
│   code."                        │
│                                 │
│  [University Email Input]       │
│                                 │
│  [  Send Reset Code  ]          │  ← Primary Button
│                                 │
│  [Back to Sign In]              │  ← Text link, centred
└─────────────────────────────────┘
```

**On success:** Navigate to `reset-password.tsx` passing email as param. Show info banner: "If this email is registered, a code has been sent."

---

### 4.6 `(auth)/reset-password.tsx` — Reset Password

**Layout:**

```
┌─────────────────────────────────┐
│  ← Back  ["Reset Password"]     │
│─────────────────────────────────│
│  "Enter the code sent to"       │  ← Body, centred
│  "[email]"                      │  ← Body SemiBold, Primary
│                                 │
│  [OTP Input — 6 boxes]          │  ← Same OtpInput component
│                                 │
│  [New Password Input]           │
│  [Confirm Password Input]       │
│                                 │
│  [  Reset Password  ]           │  ← Primary Button
└─────────────────────────────────┘
```

**On success:** `router.replace('/(auth)/login')` + success toast: "Password reset successfully. Please sign in."

---

## 5. Onboarding Stack — Profile Creation

### `(onboarding)/create-profile.tsx`

**Purpose:** One-time profile creation. Presented as a **multi-step form** (not a single long scroll). This emphasises the importance and irreversibility of the data.

**Step structure:** Use a step indicator at the top and animate between steps with a slide transition.

```
Total Steps: 3
Step 1 — Personal Information
Step 2 — Academic Information
Step 3 — Review & Submit
```

**Top area (persistent across all steps):**

```
┌─────────────────────────────────┐
│  "Complete Your Profile"        │  ← Heading 1, top padding lg
│  "Step 2 of 3"                  │  ← Body Small, Text Secondary
│                                 │
│  [━━━━━━━━━━━━━━━░░░░░░░░░░░]   │  ← Progress bar, Accent fill, Border bg
│                                 │    animated width change between steps
└─────────────────────────────────┘
```

---

**Step 1 — Personal Information:**

```
Fields (in order, stacked):
  - Gender           → SegmentedControl (MALE / FEMALE / OTHER)
  - Date of Birth    → DatePicker (opens native date picker on tap)
                       Display format: DD/MM/YYYY
  - Phone Number     → TextInput, keyboard: phone-pad, placeholder: +233XXXXXXXXX
                       Prefix flag/code selector optional enhancement
```

**Step 2 — Academic Information:**

```
Fields (in order, stacked):
  - Index Number     → TextInput, placeholder: TTU/2024/001234
  - Faculty          → Dropdown / ModalPicker (searchable list)
  - Department       → Dropdown / ModalPicker (filtered by Faculty)
  - Programme        → TextInput
  - Level            → SegmentedControl: 100 | 200 | 300 | 400 | 500
  - Session          → SegmentedControl: Regular | Weekend | Evening
  - Certificate Type → DropdownPicker
                       Options: BACHELOR of TECHNOLOGY | HND | DIPLOMA | CERTIFICATE
```

**Step 3 — Review & Submit:**

```
┌─────────────────────────────────┐
│  "Review your information"      │  ← Heading 1
│  "This cannot be changed        │  ← Body, Text Secondary
│   after submission."            │
│                                 │
│  ╔═══════════════════════════╗  │
│  ║  Personal Details         ║  │  ← InfoCard component
│  ║  ─────────────────────    ║  │
│  ║  Gender:       Male       ║  │  ← InfoRow: label left, value right
│  ║  Date of Birth: 15/01/2000║  │
│  ║  Phone:   +233501234567   ║  │
│  ╚═══════════════════════════╝  │
│                                 │
│  ╔═══════════════════════════╗  │
│  ║  Academic Details         ║  │
│  ║  ─────────────────────    ║  │
│  ║  Index No: TTU/2024/001   ║  │
│  ║  Faculty:  Engineering    ║  │
│  ║  ...                      ║  │
│  ╚═══════════════════════════╝  │
│                                 │
│  ⚠️  "Once submitted, your     │  ← WarningBanner component
│  profile data cannot be edited. │    Warning bg, Warning border, icon left
│  Contact the ILO for changes."  │
│                                 │
│  [  Submit Profile  ]           │  ← Accent Button (gold), full width
│  [  ← Go Back & Edit  ]        │  ← Ghost button, centred
└─────────────────────────────────┘
```

**Submit button tap → Confirmation modal (ConfirmationSheet):**

```
Bottom sheet slides up:
  Title:   "Are you sure?"
  Body:    "Your profile information cannot be changed after you submit. 
            Please make sure all details are correct."
  Buttons:
    [Yes, Submit My Profile]  → Accent, calls createProfile()
    [Cancel]                  → Ghost, dismisses sheet
```

**On success:**
- Update AuthContext `hasProfile: true`.
- `router.replace('/(app)/')`.
- Show welcome toast: "Profile created! Welcome to ILO Portal."

**Step navigation:**
- "Next" button advances step (validates current step's fields first via Zod).
- "Back" button within steps goes to previous step (no API call).
- Hardware back / gesture on Step 1 → shows a "Leave setup?" alert.

---

## 6. Main App — Tab Navigator

### 6.1 `(app)/index.tsx` — Home / Dashboard

**Purpose:** Central status overview. Shows the student's current internship status, quick actions, and key information at a glance.

**Layout (ScrollView, no pull-to-refresh needed):**

```
┌─────────────────────────────────┐
│  [Safe Area top]                │
│                                 │
│  ┌─ Header Row ────────────────┐│
│  │ "Good morning, John 👋"    ││  ← Display Medium, Text Primary
│  │ "TTU/2024/001234"          ││  ← Caption, Text Secondary
│  │                   [Avatar] ││  ← 40×40, circular, profile image or initials
│  └────────────────────────────┘│
│                                 │
│  ┌─ Internship Status Card ───┐ │  ← Prominent card, shadow elevated
│  │ [Status Badge]             │ │    Badge: NOT REGISTERED (red) / PENDING (amber)
│  │                            │ │           / ASSIGNED (green)
│  │ Status Title               │ │  ← Heading 1
│  │ Status Description         │ │  ← Body, Text Secondary
│  │                            │ │
│  │ [Primary Action Button]    │ │  ← Changes based on status (see below)
│  └────────────────────────────┘ │
│                                 │
│  "Quick Actions"                │  ← Heading 2, section label
│                                 │
│  ┌──────────┐  ┌──────────┐    │  ← 2-column grid of QuickActionCards
│  │ 📋       │  │ 👤       │    │
│  │ Register │  │ Assignment│    │
│  │ Internship│  │ Details  │    │
│  └──────────┘  └──────────┘    │
│  ┌──────────┐  ┌──────────┐    │
│  │ 🏫       │  │ ❓       │    │
│  │ My Profile│  │ Help &   │    │
│  │          │  │ Contact  │    │
│  └──────────┘  └──────────┘    │
│                                 │
│  "Important Notice"             │  ← Only shown if an active internship period exists
│  ┌─ PeriodBanner ─────────────┐ │
│  │ 📅 "2026 Industrial        │ │  ← Info colour scheme
│  │     Training Period is Open"│ │
│  │  Deadline: 30 June 2026    │ │
│  └────────────────────────────┘ │
└─────────────────────────────────┘
```

**Status Card Content by Status:**

| Status | Badge | Title | Description | Button |
|--------|-------|-------|-------------|--------|
| `NOT_REGISTERED` | 🔴 Not Registered | "Register for Internship" | "You haven't registered for the current internship period yet." | "Register Now →" → navigate to Internship tab |
| `REGISTERED_PENDING_ASSIGNMENT` | 🟡 Pending Assignment | "Registration Complete" | "Your supervisor and zone are being assigned. Check back later." | "View My Registration →" → navigate to Assignment tab |
| `ASSIGNED` | 🟢 Assigned | "Supervisor Assigned!" | "Your supervisor and zone have been assigned." | "View Assignment →" → navigate to Assignment tab |

**Quick Action Cards:** `QuickActionCard` — square card, Surface background, border Border, icon centred top, label below. Tap navigates to the relevant tab or screen.

---

### 6.2 `(app)/register-internship.tsx` — Assumption of Duty Registration

**Purpose:** Student registers their internship with company and location details.

**Logic gate at screen mount:**
1. Call `useInternship().status`.
2. If `REGISTERED_PENDING_ASSIGNMENT` or `ASSIGNED` → show `AlreadyRegisteredState` (see §9).
3. If `NOT_REGISTERED` → show the registration form.
4. Call `fetchActivePeriod()` on mount. If no active period → show `NoPeriodState` (see §9).

**Layout (KeyboardAwareScrollView):**

```
┌─────────────────────────────────┐
│  [Header: "Internship           │
│   Registration"]                │
│─────────────────────────────────│
│                                 │
│  ┌─ PeriodBanner ─────────────┐ │  ← Info card: active period name + dates
│  │ 📅 "2026 Industrial        │ │
│  │     Training Period"        │ │
│  │  Jun 1 – Aug 31, 2026      │ │
│  └────────────────────────────┘ │
│                                 │
│  ── Company Information ──      │  ← SectionHeader component
│                                 │
│  [Company Name *]               │
│  [Company Email *]              │
│  [Company Phone *]              │
│  [Company Address *]            │
│  [Company City *]               │
│                                 │
│  ── Supervisor Information ──   │
│                                 │
│  [Company Supervisor Name *]    │
│  [Supervisor Phone *]           │
│                                 │
│  ── Internship Dates ──         │
│                                 │
│  [Commencement Date *]          │  ← DatePicker, min: today
│                                 │
│  ── Your Location ──            │
│                                 │
│  ┌─ LocationCapture ──────────┐ │  ← LocationCaptureCard component (see §7)
│  │ [Map pin icon]              │ │
│  │ "Your GPS location will    │ │
│  │  be captured at submission"│ │
│  │ [Capture Location]  ← btn  │ │
│  │ ✅ Location captured        │ │  (state changes after capture)
│  └────────────────────────────┘ │
│                                 │
│  ⚠️  "You must be physically    │  ← WarningBanner
│  present at your workplace      │
│  during registration."          │
│                                 │
│  [  Submit Registration  ]      │  ← Accent button, full width
│                                 │    Disabled until location captured
└─────────────────────────────────┘
```

**Location Capture Card states:**

| State | Icon | Text | Button |
|-------|------|------|--------|
| Initial | 📍 grey | "Tap to capture your current location" | "Capture Location" (Primary outline) |
| Loading | Spinner | "Getting your location..." | Disabled |
| Captured | ✅ green | "Location captured successfully" + coordinates in Caption | "Recapture" (ghost small) |
| Error | ❌ red | Error message (permission denied / timeout) | "Try Again" or "Open Settings" |

**Permission denied state:** Replace button with: "Location permission is required. [Open App Settings →]" — link opens `Linking.openSettings()`.

**Submit loading state:**
- Button shows spinner + "Submitting..."
- All form fields disabled.
- Location card locked.

**On success:** Show `SuccessSheet` bottom sheet (see §9), then navigate to Home tab.

---

### 6.3 `(app)/assignment.tsx` — My Assignment

**Purpose:** Shows supervisor and zone details once assigned, or a pending message if not.

**Layout:**

```
┌─────────────────────────────────┐
│  [Header: "My Assignment"]      │
│─────────────────────────────────│
│                                 │
│  ┌─ Status Badge Row ─────────┐ │
│  │  [Status badge — large]    │ │  ← Same StatusBadge component from Home
│  └────────────────────────────┘ │
```

**If `NOT_REGISTERED`:**
```
│  ┌─ Empty State ───────────────┐ │
│  │    [Clipboard icon, 80px]  │ │
│  │  "No Registration Found"   │ │
│  │  "Register for the current │ │
│  │   internship period first" │ │
│  │  [Register Now →]          │ │  ← navigates to Internship tab
│  └────────────────────────────┘ │
```

**If `REGISTERED_PENDING_ASSIGNMENT`:**
```
│  ┌─ Pending State ─────────────┐ │
│  │  [Hourglass animation]     │ │  ← Lottie or simple animated SVG
│  │  "Assignment in Progress"  │ │  ← Heading 1
│  │  "Your supervisor and zone │ │  ← Body, Text Secondary
│  │   are being assigned.      │ │
│  │   Please check back later."│ │
│  │                             │ │
│  │  [Refresh]  ← ghost btn    │ │  ← calls refreshAssignment()
│  └────────────────────────────┘ │
```

**If `ASSIGNED`:**
```
│  ── Your Supervisor ──          │  ← SectionHeader
│                                 │
│  ┌─ SupervisorCard ───────────┐ │
│  │  [Avatar circle — initials]│ │  ← 56×56, Primary background, white text
│  │  "Dr. Jane Smith"          │ │  ← Heading 2
│  │  "Staff ID: ILO-2024-042"  │ │  ← Caption, Text Secondary
│  │  ──────────────────────────│ │
│  │  📧 jane.smith@ttu.edu.gh  │ │  ← Tappable — opens email client
│  │  📞 +233501234567          │ │  ← Tappable — opens phone dialler
│  └────────────────────────────┘ │
│                                 │
│  ── Your Zone ──                │
│                                 │
│  ┌─ ZoneCard ─────────────────┐ │
│  │  [Map icon]                │ │
│  │  "Zone A — Greater Accra"  │ │  ← Heading 2
│  │  "Covers Accra, Tema, and  │ │  ← Body, Text Secondary
│  │   surrounding districts"   │ │
│  └────────────────────────────┘ │
│                                 │
│  ── My Registration ──          │
│                                 │
│  ┌─ RegistrationSummary ──────┐ │  ← Collapsed card with expand toggle
│  │  Company: Tech Solutions   │ │
│  │  City: Accra               │ │
│  │  Started: 1 June 2026      │ │
│  │  [Show More ▾]             │ │
│  └────────────────────────────┘ │
└─────────────────────────────────┘
```

---

### 6.4 `(app)/profile.tsx` — Profile Screen

**Purpose:** View profile details, update profile image, and log out.

**Layout:**

```
┌─────────────────────────────────┐
│  [Header: "My Profile"          │
│   with logout icon top-right]   │  ← Logout tap → ConfirmationSheet
│─────────────────────────────────│
│                                 │
│  ┌─ ProfileHeader ─────────────┐│
│  │     [Profile Image          ││  ← 96×96, circle, shadow card
│  │      + edit overlay icon]   ││    Tap → image picker
│  │  "John Doe"                 ││  ← Display Medium, centred
│  │  "student@ttu.edu.gh"       ││  ← Body, Text Secondary, centred
│  │  "TTU/2024/001234"          ││  ← Caption, Text Secondary
│  └─────────────────────────────┘│
│                                 │
│  ── Personal Details ──         │
│                                 │
│  ┌─ InfoCard ─────────────────┐ │
│  │  Gender        │ Male       │ │  ← InfoRow: label (Text Secondary) | value (Text Primary)
│  │  Date of Birth │ 15 Jan 2000│ │
│  │  Phone         │ +233...    │ │
│  └────────────────────────────┘ │
│                                 │
│  ── Academic Details ──         │
│                                 │
│  ┌─ InfoCard ─────────────────┐ │
│  │  Index Number │ TTU/2024/..│ │
│  │  Faculty      │ Engineering │ │
│  │  Department   │ Comp. Sci.  │ │
│  │  Programme    │ BSc. CompSc │ │
│  │  Level        │ 300         │ │
│  │  Session      │ Regular     │ │
│  │  Certificate  │ B.Tech      │ │
│  └────────────────────────────┘ │
│                                 │
│  ┌─ Notice Banner ─────────────┐│
│  │ ℹ️ "To update your profile  ││  ← Info colour scheme
│  │ data, contact the ILO office"││
│  └─────────────────────────────┘│
│                                 │
│  [  Sign Out  ]                 │  ← Danger/Error outlined button, full width
│                                 │
└─────────────────────────────────┘
```

**Profile image update flow:**
1. Tap image → `expo-image-picker` action sheet appears (Camera / Photo Library / Cancel).
2. Image selected → preview shown with a "Save" / "Retake" option.
3. "Save" → calls `updateProfileImage()` → loading spinner overlay on image.
4. Success → new image displayed + success toast.

**Logout flow:**
- Logout icon or button tap → `ConfirmationSheet`:
  - Title: "Sign Out?"
  - Body: "Are you sure you want to sign out?"
  - Confirm button: "Yes, Sign Out" (Error colour)
  - Cancel: ghost button

---

## 7. Shared / Reusable Components

All components live in `src/components/`. Build them before building screens.

### 7.1 `ui/Button.tsx`

**Variants:** `primary` | `accent` | `outline` | `ghost` | `danger`
**Sizes:** `sm` | `md` | `lg`
**Props:** `title`, `onPress`, `isLoading`, `disabled`, `leftIcon`, `rightIcon`, `fullWidth`

Behaviour:
- `isLoading` → replaces title with `ActivityIndicator` + optional loading text, disables press.
- `disabled` → reduced opacity (0.5), non-interactive.
- Press animation: scale down to 0.97 on press (Reanimated).

| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| primary | Primary | White | none |
| accent | Accent | White | none |
| outline | Transparent | Primary | Primary 1.5px |
| ghost | Transparent | Primary | none |
| danger | Transparent | Error | Error 1.5px |

---

### 7.2 `forms/FormField.tsx`

Wraps a `TextInput` with:
- **Label** above (Label style, Text Primary)
- **Required asterisk** in Error colour if `required`
- **Input container** with border (Border → Border Focus on focus, Error on error)
- **Left/Right icon** slots
- **Error message** below (Body Small, Error colour) — only visible when `error` prop is set
- **Hint text** below (Caption, Text Secondary) — shown when no error

States: default | focused | error | disabled

---

### 7.3 `forms/OtpInput.tsx`

- 6 `TextInput` boxes in a horizontal row.
- Equal flex spacing, gap sm between boxes.
- Each box: 48×56px, border md radius, centred text, Display Medium font.
- Focused: Primary border, subtle shadow.
- Filled: Surface Alt background.
- Auto-advance, backspace behaviour, paste handling (described in §4.3).
- Exposes `onComplete(otp: string)` callback when all 6 digits entered.

---

### 7.4 `ui/StatusBadge.tsx`

Props: `status: InternshipStatus`

| Status | Background | Text | Icon |
|--------|-----------|------|------|
| `NOT_REGISTERED` | Error Light | Error | `XCircle` |
| `REGISTERED_PENDING_ASSIGNMENT` | Warning Light | Warning | `Clock` |
| `ASSIGNED` | Success Light | Success | `CheckCircle` |

Pill shape (border radius full), padding `xs` vertical `sm` horizontal, Label style.

---

### 7.5 `ui/Card.tsx`

Base card container. Props: `style`, `shadow` (`card` | `elevated` | `none`), `children`.
Background: Surface, border radius lg, border Border (1px), shadow as specified.

---

### 7.6 `ui/ErrorBanner.tsx`

Props: `message`, `onDismiss?`

Horizontal bar at top of form/screen. Error Light background, Error left border (3px), error icon left, message text, optional close icon right. Slides in from top with Reanimated on mount.

---

### 7.7 `ui/Toast.tsx`

Global toast system. Implement with a `ToastProvider` at root layout level.

- Appears at bottom of screen, above tab bar.
- Auto-dismisses after 3 seconds.
- Types: `success` | `error` | `info` | `warning` — each has corresponding colour + icon.
- Slides up from bottom on appear, fades out on dismiss.
- Expose `showToast(message, type)` via a `useToast()` hook.

---

### 7.8 `layout/ScreenWrapper.tsx`

Wraps every screen content. Provides:
- `SafeAreaView` with correct edges
- Background colour `Background`
- Optional `scrollable` prop → wraps children in `KeyboardAwareScrollView`
- Optional `header` prop → renders custom header row
- Consistent horizontal padding `md`

---

### 7.9 `internship/LocationCaptureCard.tsx`

Self-contained component that manages location state internally using `useLocation()` hook.

Emits `onLocationCaptured(coords: { lat, lng })` to parent when capture succeeds.

States and layouts described in §6.2 Location Capture Card states table.

---

### 7.10 `ui/ConfirmationSheet.tsx`

Bottom sheet modal (use `@gorhom/bottom-sheet`).

Props: `visible`, `title`, `body`, `confirmLabel`, `confirmVariant`, `onConfirm`, `onCancel`

- Slides up from bottom, backdrop dims to `rgba(0,0,0,0.5)`.
- Handle bar at top centre.
- Border radius xl on top corners.
- Content padding lg.
- Confirm button on top (full width), Cancel below (ghost full width).
- Dismissible by tapping backdrop or handle.

---

### 7.11 `layout/SectionHeader.tsx`

Simple horizontal section divider.

```
[Section Title]  ─────────────────
```

Props: `title`. Title: Heading 2, Text Primary. Line: Border colour, flex-1, height 1, left margin sm.

---

### 7.12 `profile/InfoRow.tsx`

Single row inside an InfoCard.

```
[Label]          [Value]
```

- Label: Body Small, Text Secondary, flex 1.
- Value: Body, Text Primary, flex 1, text-align right.
- Bottom border Border colour (except last row).
- Padding `sm` vertical.

---

## 8. Screen Transition Rules

| Transition | Type | Direction |
|-----------|------|-----------|
| Auth stack navigation (forward) | `slide_from_right` | LTR |
| Auth stack navigation (back) | `slide_from_left` | RTL |
| Welcome → any | `slide_from_bottom` | ↑ |
| Onboarding → App | `fade` | — |
| Tab switching | `fade` | — (no slide on tabs) |
| Bottom sheets | `slide_from_bottom` | ↑ |
| Step navigation inside Profile form | Custom slide (Reanimated) | LTR/RTL based on direction |

**Profile form step animation (implement manually):**
- Use a `SharedValue` for `x` offset.
- Animate `translateX` from ±screen width to 0 when switching steps.
- Direction: advancing = slide from right; going back = slide from left.

---

## 9. Empty States & Feedback Screens

These are reusable state components, not full screens. Render them conditionally inside screen layouts.

### 9.1 `AlreadyRegisteredState`

Shown on `register-internship.tsx` when student has already submitted.

```
[CheckCircle icon — 72px, Success colour]
"Already Registered"                        ← Heading 1, centred
"You have successfully registered for       ← Body, Text Secondary, centred
 the current internship period."
[View My Registration →]                    ← Primary outline button → Assignment tab
```

---

### 9.2 `NoPeriodState`

Shown when no active internship period exists.

```
[CalendarOff icon — 72px, Text Secondary]
"No Open Period"                            ← Heading 1, centred
"There is no active internship period       ← Body, Text Secondary, centred
 at this time. Check back later."
[Refresh]                                   ← Ghost button → retry getActivePeriod()
```

---

### 9.3 `SuccessSheet`

Bottom sheet shown after successful Assumption of Duty registration.

```
[CheckCircle animation — Lottie or animated SVG, Success green]
"Registration Successful!"                  ← Display Medium, centred
"Your internship has been registered.       ← Body, Text Secondary, centred
 A supervisor will be assigned shortly."
[Go to Dashboard]                           ← Primary button → (app)/ Home tab
```

Auto-dismisses after 5 seconds if not tapped.

---

### 9.4 `PendingAssignmentState`

Shown on Assignment screen when registered but not yet assigned.

```
[Animated hourglass or clock — amber colour]
"Assignment in Progress"                    ← Heading 1
"Your supervisor and zone are being         ← Body, Text Secondary
 assigned. Please check back later."
[Refresh ↺]                                 ← Ghost small button, refreshAssignment()
```

---

### 9.5 `GenericErrorState`

Shown when a screen-level data fetch fails (e.g. profile fetch error).

```
[WifiOff or AlertTriangle icon — 64px, Text Secondary]
"Something went wrong"                      ← Heading 1
[Error message from AppError]               ← Body, Text Secondary
[Try Again]                                 ← Primary outline → retry function
```

---

## 10. Accessibility & UX Rules

### 10.1 Loading States

- Every button that triggers an async operation must show `isLoading` state.
- Screen-level loading (initial data fetch): full-screen skeleton loader or centred `ActivityIndicator` on Surface background. Never show blank screens.
- Never use `setTimeout` to fake loading — all loading states must be tied to actual async operations.

### 10.2 Form UX Rules

- Validate on blur (not on keystroke) to avoid aggressive errors.
- On form submission, validate all fields first; if errors exist, scroll to the first errored field automatically.
- Required fields marked with `*` and an asterisk in Error colour.
- Keyboard type must match input: `email-address` for emails, `phone-pad` for phones, `numeric` for OTP.
- `returnKeyType` should advance focus to the next field or submit the form.

### 10.3 Navigation Rules

- After a destructive/irreversible action (profile submit, internship registration), always use `router.replace()` not `router.push()` so the back button cannot re-submit.
- Prevent double-submission: disable all action buttons immediately on first tap.

### 10.4 Safe Area

- Always wrap screens in `SafeAreaView` from `react-native-safe-area-context`.
- Tab bar must account for bottom safe area inset.
- On Android, ensure `StatusBar` background colour matches screen header.

### 10.5 Keyboard Handling

- All forms with inputs below the fold must use `KeyboardAwareScrollView` (from `react-native-keyboard-aware-scroll-view` or Expo equivalent).
- Ensure the focused input is always scrolled into view above the keyboard.

### 10.6 Network & Offline Handling

- Detect network status using `@react-native-community/netinfo`.
- On network loss, show a persistent top banner: "No internet connection" (Error colour) that auto-dismisses when connection returns.
- Do not disable the app; allow users to view cached data.

### 10.7 Touch Targets

- All interactive elements must have a minimum touch target of 44×44px.
- Use `hitSlop` on small icons and text links to expand touch area.

---

## Appendix A: Screen → Hook Dependency Map

| Screen | Hooks Used |
|--------|-----------|
| `welcome.tsx` | none |
| `register.tsx` | `useAuth()` |
| `verify-otp.tsx` | `useAuth()` |
| `login.tsx` | `useAuth()` |
| `forgot-password.tsx` | `useAuth()` |
| `reset-password.tsx` | `useAuth()` |
| `create-profile.tsx` | `useProfile()`, `useAuth()` |
| `(app)/index.tsx` | `useAuth()`, `useProfile()`, `useInternship()` |
| `register-internship.tsx` | `useInternship()`, `useLocation()`, `useFormValidation()` |
| `assignment.tsx` | `useInternship()` |
| `profile.tsx` | `useProfile()`, `useAuth()` |

---

## Appendix B: Component Dependency Tree

```
AppProvider (root)
  └── AuthContext
  └── ProfileContext
  └── InternshipContext
  └── ToastProvider

_layout.tsx (root)
  ├── SplashScreen (isLoading)
  └── Expo Router Groups
        ├── (auth)/
        │    └── ScreenWrapper → FormField → Button → ErrorBanner
        ├── (onboarding)/
        │    └── ScreenWrapper → FormField → SegmentedControl → ConfirmationSheet
        └── (app)/
              ├── Tab Bar (custom)
              ├── index → StatusBadge → QuickActionCard → PeriodBanner
              ├── register-internship → FormField → LocationCaptureCard → WarningBanner → SuccessSheet
              ├── assignment → StatusBadge → SupervisorCard → ZoneCard → PendingAssignmentState
              └── profile → ProfileHeader → InfoCard → InfoRow → ConfirmationSheet
```

---

*End of Screen Flow & UI Specification — v1.0 · TTU Industrial Liaison Office Student App*
