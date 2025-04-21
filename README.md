# Education Management System (EMS)

A comprehensive platform for students from class 6 to 12 to access study materials, take quizzes, and track their academic progress.

## Features

- **User Authentication**
  - Student registration with name, email, password, and class (6-12)
  - Login and logout functionality
  - JWT for token-based authentication
  - Password hashing with bcrypt

- **Dashboard**
  - Overview of enrolled subjects
  - Recent quiz results
  - Performance metrics
  - Recommended study materials

- **Study Materials**
  - Browse materials by subject and topic
  - Access PDFs, notes, and video links
  - Organized by class level

- **Quiz Module**
  - Take MCQ quizzes by topic
  - Get immediate feedback on answers
  - View detailed results after submission

- **Performance Tracking**
  - Visual charts showing progress over time
  - Subject-wise performance analysis
  - Quiz history with timestamps

- **Admin Interface**
  - Manage users, subjects, topics, materials, and quizzes
  - Add, edit, and delete content

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js with JWT
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
\`\`\`

### Installation

1. Clone the repository:
   \`\`\`
   git clone https://github.com/yourusername/education-management-system.git
   cd education-management-system
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Seed the database:
   \`\`\`
   npm run seed
   \`\`\`
   Or visit `/api/seed` in your browser after starting the development server.

4. Start the development server:
   \`\`\`
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Users

After seeding the database, you can log in with the following credentials:

- **Admin User**:
  - Email: admin@example.com
  - Password: password123

- **Student User**:
  - Email: student@example.com
  - Password: password123

## Deployment

This application can be deployed to Vercel:

1. Push your code to a GitHub repository.
2. Create a new project on Vercel and import your repository.
3. Set up the environment variables in the Vercel dashboard.
4. Deploy!

## License

This project is licensed under the MIT License - see the LICENSE file for details.
