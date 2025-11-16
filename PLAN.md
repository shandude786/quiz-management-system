# PLAN.md

## Quiz Management System - Implementation Plan

### **Project Overview**
A full-stack quiz management system with role-based access control, allowing admins to create/manage quizzes and users to take quizzes with timed assessments.

---

## **1. Assumptions & Scope**

### **Assumptions**
- Single admin user with hardcoded credentials 
- Users can register themselves and must login to take quizzes
- All quizzes are visible to authenticated users
- Users can retake quizzes unlimited times
- Quiz timer starts when user begins the quiz
- Auto-submit when timer expires or manual submit
- All questions for a quiz appear on single page
- MCQ only with 4 options (A, B, C, D)
- Results show: score + correct answers + user's incorrect answers
- HTTP-only cookies for secure token storage
- All data operations handled by backend APIs
- Database stores all quiz attempts with detailed results

### **In Scope (MVP)**
✅ User registration and JWT authentication  
✅ Role-based access control (admin/user)  
✅ Admin: Create, Read, Update, Delete quizzes  
✅ Admin: Create, Read, Update, Delete questions for quizzes  
✅ User: View all available quizzes as cards  
✅ User: Take quiz with countdown timer  
✅ User: Auto-submit on timer expiry or manual submit  
✅ User: View detailed results after submission  
✅ Responsive design (mobile-first)  
✅ HTTP-only cookie token storage  
✅ Full CRUD REST API  
✅ Database persistence (Neon Postgres)  
✅ CI/CD deployment (Vercel + Render)  

### **Out of Scope (Future Enhancements)**
❌ Quiz attempt history/analytics dashboard  
❌ User profile management  
❌ Multiple question types (True/False, text input)  
❌ Question categories/tags  
❌ Bulk question import  
❌ Quiz difficulty levels  
❌ Leaderboards  
❌ Social sharing  
❌ Email notifications  

---

## **2. Tech Stack**

### **Frontend**
- **Framework**: Vite + React 18 + TypeScript
- **State Management**: Redux Toolkit + Redux Thunk
- **HTTP Client**: Axios (with interceptors)
- **UI Library**: Material-UI (MUI v5)
- **Styling**: SASS/SCSS
- **Routing**: React Router v6
- **Form Handling**: Controlled components
- **Hosting**: Vercel

### **Backend**
- **Runtime**: Node.js + Express.js + TypeScript
- **Authentication**: JWT + bcrypt
- **Database ORM**: Prisma
- **Database**: Neon Postgres (PostgreSQL)
- **Validation**: express-validator
- **Security**: Helmet, CORS, cookie-parser
- **Hosting**: Render

### **DevOps**
- **Version Control**: GitHub
- **CI/CD**: GitHub Actions
- **Environment**: dotenv

---

## **3. Database Schema**

### **Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,  -- bcrypt hashed
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Quizzes Table**
```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  time_limit INTEGER NOT NULL,  -- in minutes
  total_questions INTEGER NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Questions Table**
```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  option_a VARCHAR(500) NOT NULL,
  option_b VARCHAR(500) NOT NULL,
  option_c VARCHAR(500) NOT NULL,
  option_d VARCHAR(500) NOT NULL,
  correct_answer VARCHAR(1) CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_questions_quiz_id ON questions(quiz_id);
```

### **Quiz Attempts Table**
```sql
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  quiz_id UUID REFERENCES quizzes(id),
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB NOT NULL,  -- {questionId: userAnswer}
  time_taken INTEGER,  -- in seconds
  completed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
```

### **Relationships**
- Users → Quizzes (one-to-many: creator)
- Users → Quiz Attempts (one-to-many)
- Quizzes → Questions (one-to-many, cascade delete)
- Quizzes → Quiz Attempts (one-to-many)

---

## **4. API Endpoints**

### **Authentication** (`/api/auth`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /register | Public | User registration (role: USER) |
| POST | /login | Public | User/Admin login (returns JWT in cookie) |
| POST | /logout | Private | Logout (clear cookie) |
| GET | /me | Private | Get current authenticated user |

### **Quizzes** (`/api/quizzes`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | / | Private | Get all quizzes with question count |
| GET | /:id | Private | Get quiz details by ID |
| POST | / | Admin | Create new quiz |
| PUT | /:id | Admin | Update quiz |
| DELETE | /:id | Admin | Delete quiz (cascade delete questions) |

### **Questions** (`/api/questions`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /quiz/:quizId | Private | Get questions without correct answers (for users) |
| GET | /quiz/:quizId/admin | Admin | Get questions with correct answers |
| POST | / | Admin | Create question |
| PUT | /:id | Admin | Update question |
| DELETE | /:id | Admin | Delete question |

### **Quiz Attempts** (`/api/attempts`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /submit | Private | Submit quiz answers and get detailed results |
| GET | /quiz/:quizId | Private | Get user's attempts for specific quiz |

---

## **5. Frontend Architecture**

### **Folder Structure**
```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── PrivateRoute.tsx      # Protected route HOC
│   │   │   ├── AdminRoute.tsx        # Admin-only route HOC
│   │   │   └── Timer.tsx             # Countdown timer component
│   │   ├── admin/
│   │   │   ├── QuizList.tsx          # Admin quiz list
│   │   │   ├── QuizForm.tsx          # Create/Edit quiz form
│   │   │   ├── QuestionList.tsx      # Question list for quiz
│   │   │   └── QuestionForm.tsx      # Add/Edit question form
│   │   └── user/
│   │       ├── QuizCard.tsx          # Quiz card display
│   │       ├── QuizAttempt.tsx       # Quiz taking interface
│   │       └── QuizResult.tsx        # Result display
│   ├── pages/
│   │   ├── LoginPage.tsx             # Login form
│   │   ├── RegisterPage.tsx          # Registration form
│   │   ├── UserDashboard.tsx         # User quiz list
│   │   ├── AdminDashboard.tsx        # Admin quiz management
│   │   ├── TakeQuizPage.tsx          # Quiz taking page
│   │   ├── QuizResultPage.tsx        # Result display page
│   │   └── QuestionManagementPage.tsx # Question CRUD page
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.ts          # Auth state & actions
│   │   │   ├── quizSlice.ts          # Quiz state & actions
│   │   │   ├── questionSlice.ts      # Question state & actions
│   │   │   └── attemptSlice.ts       # Attempt state & actions
│   │   ├── store.ts                  # Redux store configuration
│   │   └── hooks.ts                  # Typed Redux hooks
│   ├── services/
│   │   └── api.ts                    # Axios instance with interceptors
│   ├── styles/
│   │   └── global.scss               # Global styles
│   ├── types/
│   │   └── index.ts                  # TypeScript interfaces
│   ├── App.tsx                       # Root component with routing
│   └── main.tsx                      # Entry point
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### **Redux Store Structure**
```typescript
{
  auth: {
    user: { id, email, name, role } | null,
    isAuthenticated: boolean,
    loading: boolean,
    error: string | null
  },
  quiz: {
    quizzes: Quiz[],
    currentQuiz: Quiz | null,
    loading: boolean,
    error: string | null
  },
  question: {
    questions: Question[],
    loading: boolean,
    error: string | null
  },
  attempt: {
    currentQuizId: string | null,
    answers: Record<string, string>,  // {questionId: selectedAnswer}
    timeRemaining: number,            // in seconds
    result: QuizResult | null,
    loading: boolean,
    error: string | null
  }
}
```

### **Key Routes**
```
/                          → Redirect to /login
/login                     → Login page
/register                  → Registration page
/dashboard                 → User dashboard (quiz cards) [Protected]
/quiz/:id                  → Take quiz page [Protected]
/quiz/:id/result           → Quiz result page [Protected]
/admin                     → Admin dashboard (quiz management) [Admin Only]
/admin/quiz/:id/questions  → Question management page [Admin Only]
```

---

## **6. Backend Architecture**

### **Folder Structure**
```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Seed script (admin user)
│   └── migrations/        # Generated migrations
├── src/
│   ├── config/
│   │   └── database.ts    # Prisma client instance
│   ├── middleware/
│   │   ├── auth.ts        # JWT verification middleware
│   │   ├── admin.ts       # Admin role check middleware
│   │   └── errorHandler.ts # Global error handler
│   ├── routes/
│   │   ├── auth.routes.ts      # Auth endpoints
│   │   ├── quiz.routes.ts      # Quiz CRUD endpoints
│   │   ├── question.routes.ts  # Question CRUD endpoints
│   │   └── attempt.routes.ts   # Quiz attempt endpoints
│   ├── controllers/
│   │   ├── auth.controller.ts     # Auth logic
│   │   ├── quiz.controller.ts     # Quiz CRUD logic
│   │   ├── question.controller.ts # Question CRUD logic
│   │   └── attempt.controller.ts  # Attempt logic
│   ├── utils/
│   │   └── jwt.ts         # JWT token generation/verification
│   ├── types/
│   │   └── index.ts       # TypeScript interfaces
│   └── server.ts          # Express app entry point
├── .env                   # Environment variables
├── .env.example           # Environment template
├── tsconfig.json
└── package.json
```

---

## **7. Security Implementation**

### **Authentication & Authorization**
- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ JWT tokens stored in HTTP-only cookies (XSS protection)
- ✅ JWT expiry: 7 days (configurable)
- ✅ Token verification middleware on protected routes
- ✅ Role-based access control (ADMIN/USER)

### **API Security**
- ✅ CORS configured for frontend origin only
- ✅ Helmet.js for security headers
- ✅ Input validation with express-validator
- ✅ Parameterized queries via Prisma (SQL injection protection)
- ✅ Error handling without exposing sensitive info

### **Environment Variables**
All sensitive data stored in `.env`:
- Database connection string
- JWT secret key
- Frontend URL for CORS
- Cookie domain

---

## **8. User Flows**

### **Admin Flow**
1. Login with admin credentials 
2. Redirect to `/admin` dashboard
3. View list of all quizzes (title, category, time, question count, edit/delete icons)
4. Click "Create Quiz" → Modal opens
5. Fill form (title, category, time limit, total questions) → Submit
6. Quiz appears in list
7. Click on quiz row → Navigate to `/admin/quiz/:id/questions`
8. View questions list for that quiz
9. Click "Add Question" → Modal opens
10. Fill form (question text, 4 options, correct answer) → Submit
11. Question appears in list
12. Edit/Delete questions as needed
13. Logout

### **User Flow**
1. Register account (name, email, password)
2. Login with credentials
3. Redirect to `/dashboard`
4. View quiz cards (title, category, time limit, question count)
5. Click on quiz card → Navigate to `/quiz/:id`
6. See all questions with 4 options each on single page
7. Timer starts automatically (countdown from time limit)
8. Select answers for each question (can change before submit)
9. Click "Submit Quiz" OR timer expires (auto-submit)
10. Navigate to `/quiz/:id/result`
11. View detailed results:
    - Total score (X/Y)
    - Percentage
    - Each question with:
      - User's answer (highlighted in red if wrong, green if correct)
      - Correct answer (if user was wrong)
12. Click "Back to Dashboard"
13. Can retake same quiz or try other quizzes
14. Logout

---

## **9. Responsive Design Strategy**

### **Breakpoints (Material-UI)**
- **xs**: 0px (mobile)
- **sm**: 600px (tablet)
- **md**: 900px (small laptop)
- **lg**: 1200px (desktop)
- **xl**: 1536px (large desktop)

### **Mobile-First Components**
- **Quiz Cards**: 
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns
  
- **Forms**: 
  - Mobile: Full-width inputs
  - Desktop: Max-width 600px, centered

- **Question List**: 
  - Mobile: Stack vertically
  - Desktop: Table layout

- **Navigation**: 
  - Mobile: App bar with menu
  - Desktop: Full navbar with logout button

- **Modals**: 
  - Mobile: Full-screen dialog
  - Desktop: Centered modal (max-width)

### **Typography Scaling**
- Mobile: Base 14px
- Tablet: Base 15px
- Desktop: Base 16px

---

## **10. Deployment Plan**

### **Database Setup (Neon Postgres)**
1. Create Neon account at https://neon.tech
2. Create new project
3. Copy connection string
4. Update `DATABASE_URL` in `.env`
5. Run migrations: `npx prisma migrate deploy`
6. Run seed: `npm run prisma:seed`

### **Backend Deployment (Render)**
1. Create Render account
2. New → Web Service
3. Connect GitHub repository
4. Configure:
   - **Name**: quiz-backend
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npx prisma migrate deploy && npm start`
5. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_EXPIRE=7d`
   - `NODE_ENV=production`
   - `FRONTEND_URL=<vercel-url>`
   - `COOKIE_DOMAIN=<render-domain>`
6. Deploy

### **Frontend Deployment (Vercel)**
1. Create Vercel account
2. Import GitHub repository
3. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable:
   - `VITE_API_URL=<render-backend-url>`
5. Deploy

### **CI/CD Pipeline (GitHub Actions)**
- Auto-deploy on push to `main` branch
- Run TypeScript checks
- Run builds for both frontend and backend
- Deploy to Render (backend) and Vercel (frontend)

---

## **11. Development Timeline (4-5 Hours)**

### **Phase 1: Setup & Planning (30 min)** ✅
- [x] Create GitHub repository
- [x] Initialize project structure
- [x] Create PLAN.md
- [x] Setup Neon database
- [x] Initialize backend with Express + TypeScript
- [x] Initialize frontend with Vite + React + TypeScript
- **Commit 1**: "feat: initial setup with PLAN.md and project structure"

### **Phase 2: Backend Core (60 min)** ✅
- [x] Design and implement Prisma schema
- [x] Create database migrations
- [x] Implement auth controller (register, login, logout, getMe)
- [x] Implement JWT utilities
- [x] Create auth middleware
- [x] Implement quiz CRUD controller
- [x] Implement question CRUD controller
- [x] Implement attempt controller
- [x] Setup routes
- [x] Test all APIs with Postman
- **Commit 2**: "feat: implement backend auth, database schema, and CRUD APIs"

### **Phase 3: Frontend Setup & Admin Panel (60 min)**
- [ ] Setup Redux store with slices
- [ ] Configure axios with interceptors
- [ ] Implement authentication pages (Login/Register)
- [ ] Implement PrivateRoute and AdminRoute
- [ ] Create Admin Dashboard
- [ ] Implement Quiz creation/editing
- [ ] Implement Question management page
- [ ] Test admin flows
- **Commit 3**: "feat: implement frontend with Redux, admin dashboard, quiz management"

### **Phase 4: User Quiz Flow (60 min)**
- [ ] Create User Dashboard with quiz cards
- [ ] Implement Quiz taking page
- [ ] Create Timer component
- [ ] Implement quiz submission logic
- [ ] Create Quiz Result page with detailed feedback
- [ ] Test complete user flow
- **Commit 4**: "feat: implement user quiz flow with timer and results"

### **Phase 5: Polish & Deploy (30 min)**
- [ ] Responsive design testing
- [ ] Error handling improvements
- [ ] Loading states
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Vercel
- [ ] End-to-end testing on production
- [ ] Setup CI/CD with GitHub Actions
- **Commit 5**: "feat: add responsive design, deployment configs, and CI/CD"

---

## **12. Scope Changes During Implementation**

### **Changes Made**
*(This section will be updated during development if scope changes)*

**Example entries:**
- ✏️ Changed: Switched from localStorage to HTTP-only cookies for better security
- ➕ Added: Quiz attempt history tracking (stored in database)
- ➖ Removed: Email notifications (moved to post-MVP)

---

## **13. Testing Strategy**

### **Manual Testing**
- ✅ User registration flow
- ✅ User login flow
- ✅ Admin login flow
- ✅ Quiz creation (admin)
- ✅ Question management (admin)
- ✅ Quiz taking flow (user)
- ✅ Timer functionality
- ✅ Auto-submit on timer expiry
- ✅ Result display with correct/incorrect answers
- ✅ Quiz retake functionality

### **API Testing (Postman)**
- ✅ All auth endpoints
- ✅ All quiz CRUD endpoints
- ✅ All question CRUD endpoints
- ✅ Quiz submission endpoint
- ✅ Error responses
- ✅ Authorization checks

### **Browser Testing**
- Chrome (Desktop & Mobile)
- Safari (Desktop & Mobile)
- Firefox (Desktop)
- Edge (Desktop)

### **Responsive Testing**
- Mobile: 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1280px, 1920px

---

## **14. Post-MVP Improvements**

If I had more time, I would add:

### **High Priority**
1. **Quiz Analytics Dashboard**
   - Average scores per quiz
   - Completion rates
   - Most difficult questions
   - User performance trends

2. **Question Bank**
   - Reusable questions across quizzes
   - Question categories/tags
   - Import/export questions (CSV/JSON)

3. **Enhanced User Experience**
   - Quiz search and filters
   - Category-based browsing
   - User quiz history
   - Performance charts

### **Medium Priority**
4. **Advanced Question Types**
   - True/False questions
   - Multiple correct answers
   - Fill-in-the-blank
   - Image-based questions

5. **Gamification**
   - Leaderboards (global & per-quiz)
   - Achievement badges
   - Streaks and milestones
   - Points system

6. **User Profile Management**
   - Edit profile
   - Change password
   - Avatar upload
   - Preferences

### **Low Priority**
7. **Email Notifications**
   - Quiz results via email
   - Weekly quiz digest
   - Admin notifications

8. **Social Features**
   - Share results on social media
   - Challenge friends
   - Quiz comments/discussions

9. **Advanced Admin Features**
   - Bulk question import
   - Quiz templates
   - Scheduled quiz publishing
   - User management dashboard

10. **Performance Optimizations**
    - Server-side pagination
    - Lazy loading
    - Image optimization
    - Redis caching

---

## **15. Known Limitations**

1. **No offline support** - Requires internet connection
2. **No real-time features** - No live quiz competitions
3. **Limited question types** - Only MCQ with 4 options
4. **No quiz scheduling** - All quizzes are immediately available
5. **No partial saves** - Users must complete quiz in one session
6. **No accessibility features** - Screen reader support not implemented
7. **No internationalization** - English only

---

## **16. Environment Variables**

### **Backend (.env)**
```env
PORT=5000
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
JWT_EXPIRE="7d"
NODE_ENV="production"
FRONTEND_URL="https://your-frontend.vercel.app"
COOKIE_DOMAIN="your-backend.onrender.com"
```

### **Frontend (.env)**
```env
VITE_API_URL="https://your-backend.onrender.com"
```

---

## **17. Git Commit Strategy**

### **Commit Message Format**
```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Example:**
```
feat: implement quiz timer with auto-submit

- Add Timer component with countdown
- Auto-submit quiz when time expires
- Show warning when < 20% time remaining
- Store time taken in quiz attempt

Closes #12
```

### **Minimum 4 Commits (Every 30 Minutes)**
1. **Commit 1 (0-30 min)**: Initial setup + PLAN.md
2. **Commit 2 (30-90 min)**: Backend complete
3. **Commit 3 (90-150 min)**: Frontend admin panel
4. **Commit 4 (150-210 min)**: User quiz flow
5. **Commit 5 (210-240 min)**: Polish + deployment

---

## **18. Success Criteria**

### **Must Have (MVP)**
- ✅ Admin can create/edit/delete quizzes
- ✅ Admin can create/edit/delete questions
- ✅ Users can register and login
- ✅ Users can view available quizzes
- ✅ Users can take quizzes with timer
- ✅ Auto-submit on timer expiry
- ✅ Show detailed results (score + correct answers + mistakes)
- ✅ Users can retake quizzes
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Secure authentication (JWT + bcrypt)
- ✅ Deployed to production (Render + Vercel)

### **Nice to Have**
- 🔲 Quiz attempt history
- 🔲 User profile page
- 🔲 Advanced analytics
- 🔲 Email notifications
- 🔲 Social sharing

---

## **19. Resources & Documentation**

### **Documentation**
- [React Docs](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Material-UI](https://mui.com)
- [Prisma](https://www.prisma.io/docs)
- [Express.js](https://expressjs.com)
- [TypeScript](https://www.typescriptlang.org/docs)

### **Deployment**
- [Neon](https://neon.tech/docs)
- [Render](https://render.com/docs)
- [Vercel](https://vercel.com/docs)

### **Tools**
- VS Code / Cursor
- Postman / Thunder Client
- GitHub
- Chrome DevTools

---

## **20. Reflection (Post-Implementation)**

### **What Went Well**
*(To be filled after completion)*

### **Challenges Faced**
*(To be filled after completion)*

### **Lessons Learned**
*(To be filled after completion)*

### **What I Would Do Differently**
*(To be filled after completion)*

---

**Last Updated**: [Current Date]  
**Status**: ✅ Ready for Implementation  
**Estimated Completion**: 4-5 hours