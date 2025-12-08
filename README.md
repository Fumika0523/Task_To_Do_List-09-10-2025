# Task_To_Do_List-09-10-2025 (TodoTask)

## Project Overview

TodoTask is a full-stack MERN task management application that lets users securely manage their personal tasks from any device.

The app started as a **simple React + Material-UI todo list** and has now been extended into a **multi-user, database-backed system** with modern authentication:

- Each user has their **own private task list** stored in **MongoDB**.
- Users can authenticate with:
  - ✅ **Google OAuth 2.0** (session-based, using Passport.js)
  - ✅ (Planned / In progress) **Email + password login** using JWT
- The frontend features a **clean, responsive task UI** built with **React + MUI**, supporting full CRUD operations and task filtering.

This project demonstrates both **UI/UX skills** and **real-world full-stack patterns** such as per-user data isolation, authentication, and RESTful API design.

---

## Features

### 🔐 Authentication & User Management

- **Google OAuth 2.0 Login**
  - Implemented with Passport.js and sessions.
  - After login, the backend exposes the logged-in user via `req.user`.
- **(Planned / Optional) Email + Password Auth (JWT)**
  - Sign up / login using email and password.
  - Protected routes with JWT in the `Authorization: Bearer <token>` header.
- **Per-User Data Isolation**
  - Each task document is linked to a specific user via `userId`.
  - Users can only access their own tasks.

### ✅ Task Management (CRUD)

- **Add New Task**
  - Users can add a new task with:
    - **Task Name** (required)
    - **Description** (optional)
- **Edit Task**
  - Users can edit the name and description of an existing task.
- **Delete Task**
  - Users can delete tasks they no longer need.
- **Mark Task as Complete / Incomplete**
  - Toggle completion status for each task.
- **Filter Tasks by Status**
  - **All** – show every task
  - **Open** – show only incomplete tasks
  - **Closed** – show only completed tasks

### 💻 Frontend & UI

- **React + Material-UI**
  - Clean, modern, responsive UI using MUI components.
  - Consistent styling and theming.
- **Responsive Design**
  - Works well on different screen sizes (desktop, tablet, mobile).
- **Real-Time Updates**
  - Uses React state to update the UI immediately after CRUD actions.

---

## Design Choices

1. **Material-UI for Styling**
   - **Consistency and Customization**: MUI components provide a professional and consistent look. The components are customized to match a specific color scheme and design language.
   - **Modularity**: Using MUI theming makes it easy to adjust colors and typography as the application grows.

2. **Component Structure (Frontend)**
   - **`TaskHeader`**
     - Contains the page header, title, "New Task" button, and filter chips for switching between task views.
   - **`TaskForm`**
     - A modal form used for both creating and editing tasks.
     - Contains validation to ensure the task name is not empty.
   - **`TaskItem`**
     - Represents an individual task.
     - Provides controls to mark as complete/incomplete, edit, and delete.
   - **`TaskList`**
     - Renders a list of `TaskItem` components.
     - Responsible for mapping over the tasks and passing down props.

3. **State Management (Frontend)**
   - Uses React’s `useState` (and optionally `useEffect`) at the **TaskManager / main page** level.
   - Centralized state ensures all components have access to the necessary data and actions.

4. **Validation**
   - **Task Name Validation**
     - The task name field is required.
     - If the user tries to save a task without a name, an error message is displayed in the form.

---

## Backend & Architecture

### Tech Stack (Backend)

- **Node.js + Express**
  - RESTful API for tasks and authentication.
- **MongoDB + Mongoose**
  - Persistent storage for users and tasks.
- **Passport.js**
  - Google OAuth 2.0 strategy for social login.
- **JWT (Planned / optional)**
  - Token-based authentication for email/password users.

### Data Models (Conceptual)

- **User**
  - `googleId` (for Google sign-in)
  - `email`
  - `passwordHash` (for JWT login)
  - `name`
- **Task**
  - `userId` (ObjectId reference to `User`)
  - `name`
  - `description`
  - `completed`
  - `createdAt`, `updatedAt` (timestamps)

Every API call to manage tasks is **scoped by the authenticated user**, e.g.:

- `GET /api/tasks` → returns only tasks where `userId` matches the logged-in user.
- `POST /api/tasks` → creates a task with `userId` set to the current user.
- `PUT /api/tasks/:id` and `DELETE /api/tasks/:id` → only allowed for tasks belonging to that user.

---

## Setup Instructions

### Prerequisites

- **Node.js** (v18 or higher) and **npm** installed.
- A **MongoDB** instance (MongoDB Atlas or local MongoDB).
- (For Google login) **Google Cloud OAuth 2.0 credentials** (Client ID & Secret).

### 1. Clone the Repository

```bash
git clone https://github.com/Fumika0523/Task_To_Do_List-09-10-2025.git
cd Task_To_Do_List-09-10-2025
'''

2. **Install Dependencies**:
   ```bash
   npm install
   npm install @mui/material @emotion/react @emotion/styled
   npm install @mui/icons-material
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   This will start the development server on `http://localhost:5173`.
   This is hosted at netlify on `https://todomui229.netlify.app/`



### Folder Structure

- **src/**: Contains the source code.
  - **components/**: Contains all the React components (`TaskHeader.js`, `TaskForm.js`, `TaskItem.js`, `TaskList.js`).
  - **App.js**: The main entry point for the React application.
  - **index.js**: The entry point for React DOM rendering.

### Advanced Features

- **Validation**: The `TaskForm` component includes validation logic to ensure that task names are not left empty.
- **State Management**: The application effectively manages state across different components using React's `useState` hook, ensuring that changes are reflected across the UI in real-time.
- **Responsive Design**: The application layout adjusts dynamically to different screen sizes, providing an optimal user experience on both desktop and mobile devices.

---
# Task_To_Do_List-09-10-2025
