# Smart Task Manager Web Application
A real-time task management web application that allows multiple users to create, assign, and track tasks with priorities, statuses, and dependencies. This project is designed to simulate real-world collaboration using an in-memory data structure, without a permanent database.

## Table of Contents
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Installation](#installation)  
- [Usage](#usage)  
- [API Endpoints](#api-endpoints)  
- [Frontend Functionality](#frontend-functionality)  
- [Bonus Features](#bonus-features)  
- [Code Structure](#code-structure)  
- [Notes](#notes)  

## Features
### User Actions
1. Create a new user  
2. Login a user (mock authentication)  
3. View all users  

### Task Actions
1. Create a new task with:
   - Title
   - Description
   - Priority (Low / Medium / High)
   - Status (To Do / In Progress / Done)  
2. Assign task to a user  
3. Set task dependencies (a task can depend on another task)  
4. Update or delete a task  
5. Mark task as complete (only when dependencies are complete)  
6. View all tasks assigned to a user (My Tasks)  
7. View blocked tasks (tasks that cannot be completed due to dependencies)  

### Bonus Features (Optional)
- UI filtering (e.g., show only tasks with "High" priority)  

## Tech Stack
- **Frontend:** Next.js (React) – supports SSR or CSR  
- **Backend:** Node.js with Express.js  
- **Database:** In-memory storage (JS objects, Map/Set, or lowdb)  

## Installation
1. Clone the repository:  
   ```bash
   git clone <repo-url>
   ```

2. Navigate to the backend folder and install dependencies:
   ```bash
   cd backend
   npm install
   ```
   
3. Start the backend server:
   ```bash
   npm start
   ```
   
4. Navigate to the frontend folder and install dependencies:
   ```bash
   cd frontend
   npm install
   ```
   
5. Start the frontend server:
   ```bash
   npm run dev
   ```
   
6. Open your browser at `http://localhost:3000`

## Usage
1. **Create a user** – Go to the registration page and create a new user.
2. **Login** – Enter your username to login (mock authentication).
3. **Manage Tasks** – Create tasks, assign users, set priorities, dependencies, and update or delete tasks.
4. **View Tasks** – Check your tasks under "My Tasks" and view blocked tasks.

## API Endpoints (Backend)
### Users
| Method | Endpoint | Description       |
| ------ | -------- | ----------------- |
| POST   | `/users` | Create a new user |
| POST   | `/login` | Login a user      |
| GET    | `/users` | Get all users     |

### Tasks
| Method | Endpoint              | Description                                      |
| ------ | --------------------- | ------------------------------------------------ |
| POST   | `/tasks`              | Create a new task                                |
| PUT    | `/tasks/:id`          | Update a task                                    |
| DELETE | `/tasks/:id`          | Delete a task                                    |
| GET    | `/tasks/user/:id`     | Get all tasks assigned to a user                 |
| GET    | `/tasks/blocked`      | Get all blocked tasks                            |
| PUT    | `/tasks/:id/complete` | Mark task as complete (if dependencies complete) |

## Frontend Functionality
* Dashboard with "My Tasks" and "Blocked Tasks" view
* Task creation and update forms
* Assign users and set dependencies
* Filtering tasks by priority (bonus)
* Real-time state updates using React

## Code Structure
/backend
  |-- server.js           # Entry point for backend
  |-- routes/             # Express routes for tasks and users
  |-- controllers/        # Request handling logic
  |-- models/             # In-memory data structures
/frontend
  |-- pages/              # Next.js pages
  |-- components/         # Reusable UI components
  |-- context/            # React Context for state management
  |-- utils/              # Helper functions

## Notes
* Authentication is mock (no hashing or JWT).
* Tasks are stored in-memory; restarting the server will reset data.
* Dependencies must be completed before a task can be marked as done.
* Designed for demonstration purposes to simulate a collaborative task management system.

If you want, I can also **create a ready-to-use minimal folder structure and starter code** for this project with backend and frontend files, so you can start coding right away.  

Do you want me to do that?
```
