<div align="center">
  <h1>🚀 ScratchCode</h1>
  <p><strong>Gamified Interactive Learning Platform for Coding</strong></p>
  
  [![Vercel Live](https://img.shields.io/badge/Vercel-Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://scratchcode-two.vercel.app)
</div>

<br/>

**ScratchCode** is a modern, gamified interactive learning platform for coding. Built with Next.js and tailored for an engaging user experience, it features dynamic lessons, an integrated code editor, an XP-based leveling system, streaks, badges, and a competitive leaderboard.

## ✨ Features

- **🎓 Interactive Learning Tracks**: Structured curriculum with Units and Lessons (Concepts, Exercises, Projects).
- **💻 Integrated Code Editor**: Write and run code directly in the browser with syntax highlighting.
- **⚡ Gamified Progression**: Earn XP, level up, and maintain daily streaks to stay motivated.
- **🏅 Achievement Badges**: Unlock custom badges as you complete milestones.
- **📊 Rich Dashboard & Analytics**: Track your progress, recent activity, and time spent coding.
- **🏆 Global Leaderboard**: Compete with other learners for the top spot.
- **💾 Auto-Save & Exact Resume**: Never lose your progress; pick up exactly where you left off.
- **📱 Mobile Optimized**: A fully responsive design with a dedicated mobile bottom navigation bar.
- **🌙 Cyberpunk / Dark Aesthetic**: Sleek UI with glassmorphism, dynamic gradients, and modern typography.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn or pnpm
- A Supabase account and project

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/HJhaRSh/ScratchCode.git
   cd ScratchCode/scratch-code
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` (and `.env` for Prisma) file in the root directory and add the following:
   ```env
   # Supabase Keys
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Prisma Database Connection
   DATABASE_URL=your_database_connection_string
   ```

4. **Initialize the Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```
   *(Note: Ensure you have your database schema defined in `schema.prisma`)*

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment (Vercel)

ScratchCode is fully optimized for Vercel deployment.

1. Push your code to GitHub.
2. Import the project in Vercel.
3. Add the required Environment Variables in the Vercel Dashboard (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DATABASE_URL`, etc.).
4. The build command is already configured in `package.json` to handle Prisma generation (`"build": "prisma generate && next build"`).
5. Deploy!

## 📂 Project Structure

- `/src/app`: Next.js App Router pages (Dashboard, Tracks, Lessons, Auth).
- `/src/components`: Reusable UI components (Editor, Navigation, HUDs).
- `/src/lib`: Utility functions and clients (Supabase, Prisma).
- `/src/app/api`: Backend API routes for user progress, validation, and dashboard data.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/HJhaRSh/ScratchCode/issues).

## 📄 License

This project is licensed under the MIT License.
