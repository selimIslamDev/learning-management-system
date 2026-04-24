# EduTrack — Assignment & Learning Analytics Platform

A full-stack Next.js 14 platform for Programming Hero, enabling instructors to manage assignments and analyze performance while students track progress and receive AI-powered feedback.

## 🚀 Live Demo

- **Instructor Login:** `instructor@ph.com` / `instructor123`
- **Student Login:** `student@ph.com` / `student123`

---

## ✨ Features

### Instructor
- ✅ Create assignments with title, description, deadline, difficulty level
- ✅ **AI Enhance** — Automatically improve assignment descriptions using Claude AI
- ✅ View all student submissions with filter by status
- ✅ **AI Generate Feedback** — Auto-generate qualitative feedback for student submissions
- ✅ Update submission status (Accepted / Pending / Needs Improvement)
- ✅ Analytics dashboard with Recharts visualizations:
  - Submission status pie chart
  - Performance by difficulty bar chart
  - Per-assignment acceptance rates

### Student
- ✅ Browse all available assignments with difficulty badges
- ✅ Submit work via GitHub/live URL with a descriptive note
- ✅ **AI Improve Note** — Polish submission notes using Claude AI
- ✅ View real-time instructor feedback on submissions
- ✅ Track submission status with progress stats

---

## 🤖 AI Implementation

Three AI-powered features using the **Anthropic Claude API**:

| Feature | Action | Who Uses It |
|---|---|---|
| Enhance Description | Rewrites assignment descriptions to be clearer and more structured | Instructor |
| Generate Feedback | Creates constructive, personalized feedback based on student's note | Instructor |
| Improve Note | Polishes student submission notes to be more professional | Student |

**Smart Mock Fallback:** If `ANTHROPIC_API_KEY` is not provided, the system uses intelligent pre-written mock responses that demonstrate the same UX. This means the AI feature works out-of-the-box without any API key.

---

## 🛠 Tech Stack

| Technology | Usage |
|---|---|
| **Next.js 14** | Framework with App Router |
| **TypeScript** | Type safety throughout |
| **Tailwind CSS** | Styling with custom dark theme |
| **NextAuth v4** | JWT-based authentication |
| **Recharts** | Analytics charts (Pie, Bar) |
| **Anthropic Claude API** | AI-powered features |
| **JSON File Storage** | Lightweight persistence (no DB needed) |

---

## 📁 Project Structure

```
assignment-platform/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth handler
│   │   ├── assignments/           # Assignment CRUD
│   │   ├── submissions/           # Submission CRUD
│   │   ├── analytics/             # Analytics data
│   │   └── ai/                    # AI feature endpoints
│   ├── instructor/
│   │   ├── assignments/           # Assignment management
│   │   ├── submissions/           # Submission review
│   │   └── analytics/             # Analytics dashboard
│   ├── student/
│   │   ├── assignments/           # Browse & submit
│   │   └── submissions/           # Track progress
│   └── login/                     # Auth page
├── components/
│   └── Navbar.tsx
├── lib/
│   ├── auth.ts                    # NextAuth config
│   └── db.ts                      # JSON file database
├── types/
│   └── index.ts                   # TypeScript types
└── data/                          # Auto-generated JSON files
```

---

## 🔐 Route Protection

- **Instructor routes** (`/instructor/*`) — only accessible by users with `role: instructor`
- **Student routes** (`/student/*`) — only accessible by users with `role: student`
- **Unauthenticated users** are redirected to `/login`
- Role-based redirects enforced on both client layout and API routes

---

## ⚡ Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=any-random-secret-string

# Optional — AI works with mock responses without this
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel
```bash
npm install -g vercel
vercel
```

Add the same environment variables in Vercel Dashboard → Settings → Environment Variables.

---

## 📊 Analytics Bonus

The analytics dashboard highlights:
- **Struggling assignments** — those with low acceptance rates shown in red
- **Difficulty trends** — which difficulty level has the most submissions vs accepted
- **Visual acceptance rate bars** per assignment for quick identification of problem areas

---

## 👥 Default Demo Users

| Role | Email | Password |
|---|---|---|
| Instructor | instructor@ph.com | instructor123 |
| Student | student@ph.com | student123 |
| Student 2 | nusrat@ph.com | student123 |

---

*Built for Programming Hero Assessment — April 2024*
# learning-management-system
