# 📝 Todo Web App – Next.js + Typescript + Prisma + MongoDB

A modern, full-featured **Kanban-style Todo Web App** built with the latest technologies including **Next.js 14**, **TailwindCSS**, **ShadCN UI**, **Prisma**, **MongoDB**, and **React Query**. It supports user authentication, drag-and-drop task management, dark mode, and more.

## 🚀 Features

### ✅ Authentication
- Secure **Sign up / Login** using **NextAuth.js**
- Email/password-based authentication
- Session handling with protected routes

### ✅ Task & Column Management
- Create, update, and delete **columns** (e.g., To-Do, In Progress, Done)
- Create, update, delete, and reorder **tasks** within and across columns
- Task properties: **title, description, priority, due date**
- Task filtering and sorting support

### ✅ Kanban Board
- Visual **drag-and-drop interface** for managing tasks using [`@hello-pangea/dnd`](https://www.npmjs.com/package/@hello-pangea/dnd)
- Smooth animations and transitions for better UX

### ✅ Dark Mode
- Dark/light theme toggle using **next-themes**
- User preference saved in localStorage

### ✅ Backend & Database
- Backend powered by **Next.js App Router**
- ORM: **Prisma**
- **MongoDB** as the database
- Models: `User`, `Column`, `Task`, `Preference`

### ✅ UI/UX
- Built with **TailwindCSS** and **ShadCN UI**
- Responsive design for **desktop** and **mobile**
- Interactive components using **Radix UI** and **Framer Motion**
- Form validation using **Zod** and **React Hook Form**

### ✅ State & API Management
- Uses **React Query** (`@tanstack/react-query`) for efficient data fetching and caching
- Axios for API calls
- Loading and toast feedback via `sonner`

---

## 🛠️ Tech Stack

| Area              | Technology                                      |
|-------------------|-------------------------------------------------|
| Frontend          | Next.js 14.2.7, Typescript                      |
| Styling           | Tailwind CSS, ShadCN UI, Framer Motion          |
| Backend           | Next.js App Router API Routes                   |
| ORM               | Prisma                                          |
| Database          | MongoDB                                         |
| Authentication    | NextAuth.js                                     |
| Drag & Drop       | @hello-pangea/dnd                               |
| Forms & Validation| React Hook Form, Zod, @hookform/resolvers       |
| State Management  | React State + React Query                       |
| Theme             | next-themes (Dark Mode Support)                 |

---

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/todo-kanban-app.git
   cd todo-kanban-app

   ENVIROMENT

   DATABASE_URL="DB_URL"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="nextauthsecret"
