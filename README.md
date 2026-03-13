# Task Management Application

## 1. Overview

This project implements a **Task Management Application** that allows users to create, manage, and track tasks efficiently. The application demonstrates the **MVC architecture pattern** and supports core operations such as:

- Create tasks
- View tasks
- Update tasks
- Delete tasks
- Search tasks

The goal of this project is to demonstrate the ability to design and implement a full-stack application with a structured backend, database design, and a clean user interface.

The application is built using **Next.js**, **Prisma ORM**, and **PostgreSQL (Neon DB)**.

---

# 2. Database Design

The database is designed to store and manage tasks along with metadata such as creation timestamps and user details.

## 2.1 ER Diagram

```
+----------------------+
|        Task          |
+----------------------+
| id (PK)              |
| title                |
| description          |
| dueDate              |
| status               |
| remarks              |
| createdOn            |
| updatedOn            |
| createdByName        |
| createdById          |
| updatedByName        |
| updatedById          |
+----------------------+
```

Each task represents a unit of work and stores information about when it was created and last updated.

---

## 2.2 Data Dictionary

| Column Name   | Data Type | Description                                           |
| ------------- | --------- | ----------------------------------------------------- |
| id            | UUID      | Unique identifier for each task                       |
| title         | String    | Title of the task                                     |
| description   | String    | Detailed description of the task                      |
| dueDate       | DateTime  | Deadline for the task                                 |
| status        | String    | Current task status (Pending, In Progress, Completed) |
| remarks       | String    | Optional notes related to the task                    |
| createdOn     | DateTime  | Timestamp when task was created                       |
| updatedOn     | DateTime  | Timestamp when task was last updated                  |
| createdByName | String    | Name of the user who created the task                 |
| createdById   | String    | Identifier of the user who created the task           |
| updatedByName | String    | Name of the last user who updated the task            |
| updatedById   | String    | Identifier of the last user who updated the task      |

---

## 2.3 Indexes Used

Indexes improve query performance when retrieving records.

Indexes used in the application include:

- **Primary Key Index**
  - `id` is indexed automatically as the primary key.

- **Search Optimization**
  - The `title` column is used for searching tasks.

Example query:

```
GET /api/tasks?search=assignment
```

This allows fast lookup of tasks by title.

---

## 2.4 Code First vs Database First

This project uses a **Code First approach**.

### Why Code First?

The schema is defined in **Prisma's schema file** and the database structure is generated automatically through migrations.

Benefits include:

- Easier schema version control
- Automatic migrations
- Better integration with TypeScript
- Improved developer productivity

Example Prisma Model:

```prisma
model Task {
  id            String   @id @default(uuid())
  title         String
  description   String
  dueDate       DateTime
  status        String
  remarks       String?

  createdOn     DateTime @default(now())
  updatedOn     DateTime @updatedAt

  createdByName String
  createdById   String

  updatedByName String
  updatedById   String
}
```

---

# 3. Application Structure

The application follows a **modern MVC-inspired architecture**.

### MVC Breakdown

**Model**

- Prisma ORM models
- Database schema

**View**

- React components and pages
- UI built with TailwindCSS and shadcn UI components

**Controller**

- Next.js API routes handling CRUD operations

Application Flow:

```
Client (React UI)
      ↓
Next.js API Routes (Controllers)
      ↓
Prisma ORM (Model Layer)
      ↓
PostgreSQL Database
```

---

## SPA vs Server Rendered Application

This project uses a **Single Page Application (SPA)** approach.

The frontend interacts with backend APIs using HTTP requests, allowing dynamic UI updates without full page reloads.

Benefits:

- Faster user experience
- Better scalability
- Clear separation between frontend and backend logic

---

# 4. Frontend Structure

The frontend is built using **Next.js (React Framework)**.

### Technologies Used

- Next.js App Router
- TailwindCSS
- shadcn UI Components
- Lucide React Icons

### Why Next.js?

Next.js was chosen because it provides:

- Server and client rendering capabilities
- Built-in API routes
- Excellent developer experience
- Strong community support

---

### Frontend Directory Structure

```
app
 ├ layout.tsx
 ├ page.tsx
 ├ tasks
 │   ├ page.tsx
 │   ├ create/page.tsx
 │   └ [id]/page.tsx
 │
 └ api
     └ tasks
         ├ route.ts
         └ [id]/route.ts

components
 ├ task
 │   ├ TaskCard.tsx
 │   ├ TaskForm.tsx
 │   └ TaskList.tsx
 │
 └ ui
     └ reusable UI components

lib
 └ prisma.ts

prisma
 └ schema.prisma
```

---

# 5. Build and Installation

## 5.1 Environment Details

The project was built using the following environment:

- Node.js 18+
- Next.js 14
- Prisma ORM
- PostgreSQL (Neon Database)
- TailwindCSS
- shadcn UI

---

## 5.2 Dependencies

Key dependencies used:

```
next
react
react-dom
prisma
@prisma/client
tailwindcss
lucide-react
clsx
tailwind-merge
class-variance-authority
```

---

## 5.3 Installation Steps

Clone the repository:

```
git clone https://github.com/yourusername/task-manager.git
```

Move into project directory:

```
cd task-manager
```

Install dependencies:

```
npm install
```

---

## 5.4 Environment Variables

Create a `.env` file:

```
DATABASE_URL="your_neon_database_connection_string"
```

---

## 5.5 Database Setup

Run migrations:

```
npx prisma migrate dev
```

Generate Prisma client:

```
npx prisma generate
```

---

## 5.6 Running the Project

Start development server:

```
npm run dev
```

Open in browser:

```
http://localhost:3000
```

---

# Conclusion

This project demonstrates the implementation of a full-stack task management system using modern web technologies. It showcases structured backend design, proper database modeling, and a responsive frontend interface.

The project fulfills all requirements including CRUD operations, search functionality, database documentation, and application architecture explanation.
