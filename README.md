# Quiz Management System

A full-stack quiz management system with role-based access control built with React, TypeScript, Express.js, and PostgreSQL. This application allows administrators to create and manage quizzes while users can take timed quizzes and view detailed results.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.0.0-blue.svg)

---

## 🌟 Features

### **Admin Features**
- ✅ Create, edit, and delete quizzes
- ✅ Manage questions for each quiz (MCQ with 4 options)
- ✅ View all quizzes with question counts
- ✅ Full CRUD operations on quizzes and questions
- ✅ Role-based access control

### **User Features**
- ✅ User registration and authentication
- ✅ View available quizzes as cards
- ✅ Take quizzes with countdown timer
- ✅ Auto-submit when time expires
- ✅ View detailed results showing:
  - Total score and percentage
  - Correct answers
  - User's incorrect answers
- ✅ Retake quizzes unlimited times
- ✅ Responsive design (mobile, tablet, desktop)

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + TypeScript
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) with Thunk middleware
- **UI Library**: [Material-UI (MUI v5)](https://mui.com/)
- **HTTP Client**: [Axios](https://axios-http.com/) with interceptors
- **Styling**: SASS/SCSS
- **Routing**: [React Router v6](https://reactrouter.com/)

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/) + TypeScript
- **Database**: [PostgreSQL](https://www.postgresql.org/) (hosted on [Neon](https://neon.tech/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: JWT with HTTP-only cookies
- **Password Hashing**: bcrypt (12 rounds)
- **Validation**: express-validator
- **Security**: Helmet, CORS, cookie-parser

### **DevOps**
- **Version Control**: GitHub
- **CI/CD**: GitHub Actions
- **Hosting**: 
  - Frontend: [Vercel](https://vercel.com/)
  - Backend: [Render](https://render.com/)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **PostgreSQL** database (or Neon account)
- **Git**

---

## 🚀 Getting Started

### **1. Clone the Repository**

```bash
git clone https://github.com/shandude786/quiz-management-system.git
cd quiz-management-system
```

### **2. Backend Setup**

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
JWT_EXPIRE="7d"
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
COOKIE_DOMAIN="localhost"
```

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed database with admin user
npm run prisma:seed

# Start development server
npm run dev
```

The backend server will start on `http://localhost:5000`

### **3. Frontend Setup**

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000
```

```bash
# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### **4. Access the Application**

Open your browser and navigate to: `http://localhost:5173`

**Default Admin Credentials:**


---

## 📁 Project Structure

```
quiz-management-system/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   ├── seed.ts                # Seed script
│   │   └── migrations/            # Database migrations
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts        # Prisma client
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── quiz.controller.ts
│   │   │   ├── question.controller.ts
│   │   │   └── attempt.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts            # JWT verification
│   │   │   ├── admin.ts           # Admin check
│   │   │   └── errorHandler.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── quiz.routes.ts
│   │   │   ├── question.routes.ts
│   │   │   └── attempt.routes.ts
│   │   ├── utils/
│   │   │   └── jwt.ts
│   │   └── server.ts              # Express app
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── PrivateRoute.tsx
│   │   │   │   ├── AdminRoute.tsx
│   │   │   │   └── Timer.tsx
│   │   │   └── user/
│   │   │       └── QuizCard.tsx
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── UserDashboard.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── TakeQuizPage.tsx
│   │   │   ├── QuizResultPage.tsx
│   │   │   └── QuestionManagementPage.tsx
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.ts
│   │   │   │   ├── quizSlice.ts
│   │   │   │   ├── questionSlice.ts
│   │   │   │   └── attemptSlice.ts
│   │   │   ├── store.ts
│   │   │   └── hooks.ts
│   │   ├── services/
│   │   │   └── api.ts             # Axios instance
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── styles/
│   │   │   └── global.scss
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── .github/
│   └── workflows/
│       └── deploy.yml             # CI/CD pipeline
├── PLAN.md
├── README.md
└── .gitignore
```

---

## 🔌 API Documentation

### **Base URL**
- Development: `http://localhost:5000`
- Production: `https://your-backend.onrender.com`

### **Authentication Endpoints**

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Cookie: token=<jwt-token>
```

#### Logout
```http
POST /api/auth/logout
```

### **Quiz Endpoints**

#### Get All Quizzes
```http
GET /api/quizzes
```

#### Get Quiz by ID
```http
GET /api/quizzes/:id
```

#### Create Quiz (Admin Only)
```http
POST /api/quizzes
Content-Type: application/json

{
  "title": "React Fundamentals",
  "category": "React",
  "timeLimit": 10,
  "totalQuestions": 10
}
```

#### Update Quiz (Admin Only)
```http
PUT /api/quizzes/:id
Content-Type: application/json

{
  "title": "React Advanced",
  "timeLimit": 15
}
```

#### Delete Quiz (Admin Only)
```http
DELETE /api/quizzes/:id
```

### **Question Endpoints**

#### Get Questions for Quiz (User)
```http
GET /api/questions/quiz/:quizId
```

#### Get Questions with Answers (Admin)
```http
GET /api/questions/quiz/:quizId/admin
```

#### Create Question (Admin Only)
```http
POST /api/questions
Content-Type: application/json

{
  "quizId": "quiz-uuid",
  "questionText": "What is React?",
  "optionA": "A library",
  "optionB": "A framework",
  "optionC": "A language",
  "optionD": "A database",
  "correctAnswer": "A"
}
```

#### Update Question (Admin Only)
```http
PUT /api/questions/:id
Content-Type: application/json
```

#### Delete Question (Admin Only)
```http
DELETE /api/questions/:id
```

### **Quiz Attempt Endpoints**

#### Submit Quiz
```http
POST /api/attempts/submit
Content-Type: application/json

{
  "quizId": "quiz-uuid",
  "answers": {
    "question-id-1": "A",
    "question-id-2": "B"
  },
  "timeTaken": 120
}
```

#### Get User Attempts
```http
GET /api/attempts/quiz/:quizId
```

---

## 🗄️ Database Schema

### **Users**
```sql
- id: UUID (Primary Key)
- email: String (Unique)
- password: String (Hashed)
- name: String
- role: Enum (ADMIN, USER)
- createdAt: DateTime
- updatedAt: DateTime
```

### **Quizzes**
```sql
- id: UUID (Primary Key)
- title: String
- category: String
- timeLimit: Integer (minutes)
- totalQuestions: Integer
- createdBy: UUID (Foreign Key → Users)
- createdAt: DateTime
- updatedAt: DateTime
```

### **Questions**
```sql
- id: UUID (Primary Key)
- quizId: UUID (Foreign Key → Quizzes, Cascade Delete)
- questionText: String
- optionA: String
- optionB: String
- optionC: String
- optionD: String
- correctAnswer: Enum (A, B, C, D)
- createdAt: DateTime
- updatedAt: DateTime
```

### **Quiz Attempts**
```sql
- id: UUID (Primary Key)
- userId: UUID (Foreign Key → Users)
- quizId: UUID (Foreign Key → Quizzes)
- score: Integer
- totalQuestions: Integer
- answers: JSON
- timeTaken: Integer (seconds)
- completedAt: DateTime
```

---

## 🚢 Deployment

### **Backend Deployment (Render)**

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npx prisma migrate deploy && npm start`
4. Add environment variables:
   ```
   DATABASE_URL=<neon-connection-string>
   JWT_SECRET=<random-secret>
   JWT_EXPIRE=7d
   NODE_ENV=production
   FRONTEND_URL=<vercel-url>
   COOKIE_DOMAIN=<render-domain>
   ```
5. Deploy

### **Frontend Deployment (Vercel)**

1. Import project from GitHub
2. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add environment variable:
   ```
   VITE_API_URL=<render-backend-url>
   ```
4. Deploy

### **Database Setup (Neon)**

1. Create a Neon account at https://neon.tech
2. Create a new project
3. Copy the connection string
4. Use it as `DATABASE_URL` in backend environment variables

---

## 🧪 Testing

### **Backend Testing with Postman**

1. Import the API collection
2. Test authentication endpoints
3. Test quiz CRUD operations
4. Test question management
5. Test quiz submission

### **Manual Testing Checklist**

- [ ] User registration
- [ ] User login
- [ ] Admin login
- [ ] Create quiz (admin)
- [ ] Add questions (admin)
- [ ] Edit quiz (admin)
- [ ] Delete question (admin)
- [ ] View quizzes (user)
- [ ] Take quiz (user)
- [ ] Timer countdown
- [ ] Auto-submit on timer expiry
- [ ] View results
- [ ] Retake quiz
- [ ] Logout

### **Responsive Testing**

- [ ] Mobile (375px, 414px)
- [ ] Tablet (768px, 1024px)
- [ ] Desktop (1280px, 1920px)

---

## 🔒 Security Features

- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ JWT tokens stored in HTTP-only cookies (XSS protection)
- ✅ CORS configured for specific origin
- ✅ Helmet.js for security headers
- ✅ Input validation on all endpoints
- ✅ SQL injection protection via Prisma
- ✅ Role-based access control
- ✅ Environment variables for sensitive data

---

## 🐛 Troubleshooting

### **Backend Issues**

**Issue**: Prisma schema not found
```bash
# Solution
cd backend
npx prisma generate
```

**Issue**: Database connection failed
```bash
# Check your DATABASE_URL in .env
# Ensure Neon database is running
# Test connection: npx prisma db push
```

**Issue**: Port 5000 already in use
```bash
# Change PORT in .env file or stop the process using port 5000
```

### **Frontend Issues**

**Issue**: CORS errors
```bash
# Ensure FRONTEND_URL is correct in backend .env
# Check CORS configuration in server.ts
```

**Issue**: API calls failing
```bash
# Verify VITE_API_URL in frontend .env
# Check if backend server is running
# Check browser console for errors
```

**Issue**: Cookie not being set
```bash
# Ensure withCredentials: true in axios
# Check COOKIE_DOMAIN in backend .env
# Test in same domain or configure properly
```

---

## 📚 Scripts

### **Backend Scripts**

```bash
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript to JavaScript
npm start            # Run production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database with admin user
```

### **Frontend Scripts**

```bash
npm run dev          # Start Vite development server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - [GitHub Profile](https://github.com/YOUR_USERNAME)

---

## 🙏 Acknowledgments

- [Material-UI](https://mui.com/) for the beautiful UI components
- [Prisma](https://www.prisma.io/) for the amazing ORM
- [Neon](https://neon.tech/) for serverless PostgreSQL
- [Vercel](https://vercel.com/) and [Render](https://render.com/) for hosting

---

## 📧 Support

For support, email shantilal173@gmail.com or open an issue in the repository.

---

## 🗺️ Roadmap

- [ ] Quiz attempt history and analytics
- [ ] User profile management
- [ ] Multiple question types (True/False, Fill-in-blank)
- [ ] Quiz categories and tags
- [ ] Leaderboards
- [ ] Email notifications
- [ ] Social sharing
- [ ] Mobile app (React Native)
- [ ] Dark mode
- [ ] Internationalization (i18n)

---

**Made with ❤️ using React, TypeScript, and Express.js**