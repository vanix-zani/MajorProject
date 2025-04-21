# 📚 Education Management System (EMS)

A comprehensive platform for students from class 6 to 12 to access study materials, take quizzes, and track their academic progress.

## 🧠 Features

### 🔐 User Authentication
- Student registration with name, email, password, and class (6–12)
- Login/logout functionality with JWT
- Secure password hashing using `bcrypt`

### 📊 Dashboard
- View enrolled subjects
- Recent quiz results and performance metrics
- Recommended study materials

### 📚 Study Materials
- Browse materials by subject and topic
- PDFs, notes, and video links
- Filtered by class level

### 📝 Quiz Module
- Take MCQ quizzes by topic
- Instant feedback and detailed results

### 📈 Performance Tracking
- Visualize progress over time using charts
- Subject-wise analytics and quiz history

### 🛠️ Admin Interface
- Manage users, subjects, topics, materials, and quizzes
- Add, update, and delete data

## ⚙️ Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, [shadcn/ui](https://ui.shadcn.com/)
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js (JWT)
- **Charts**: Recharts

## 🛠️ Getting Started

### ✅ Prerequisites

- Node.js v18+
- MongoDB instance or cluster

### 🧪 Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

📥 Installation
Clone the repository:

```bash
git clone https://github.com/vanix-zani/MajorProject.git
cd MajorProject
Install dependencies:
```
```
bash
npm install
Seed the database:
```
```
npm run seed
Or visit /api/seed in your browser after running the server.
```
Start the dev server:

```bash
npm run dev
Open http://localhost:3000 in your browser.
```
👥 Default Users

Role	Email	Password
Admin	admin@example.com	password123
Student	student@example.com	password123
💻 Sample Code: Fetching Study Materials
ts
Copy
Edit
// lib/materials.ts
import { Material } from "@/models/Material";

export const getMaterialsByClass = async (classLevel: number) => {
  return await Material.find({ classLevel }).sort({ topic: 1 });
};
📦 Deployment (Vercel)
Push your code to GitHub:
https://github.com/vanix-zani/MajorProject

Create a new Vercel project and link the GitHub repo.

Set environment variables in the Vercel dashboard.

Click Deploy.

👤 Author
Vanix Zani
🔗 GitHub
📧 vanix.zani@example.com (Replace with actual email if desired)

📄 License
This project is licensed under the MIT License.
