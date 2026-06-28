# MERN Task Tracker (Kanban + List)

A full-stack **MERN** task tracker with a polished UI, supporting **List** and **Kanban Board** views.

> Note: Replace the placeholders in **Screenshots/GIF** if you add your own media.

## Demo / GIF

![App demo](./docs/app-gif-placeholder.gif)

## Screenshots

### List view

![List view](./docs/list-view-placeholder.png)

### Kanban board view

![Board view](./docs/kanban-view-placeholder.png)

## Features

- **Create / Update / Delete** tasks (title, description, priority, status, due date)
- **Search** tasks by title/description
- **Filter** by status (Pending / In Progress / Completed)
- **Sort** by newest/oldest or title A-Z/Z-A
- **List/Board toggle**
- **TaskCard reuse** across both views
- **Activity timeline** for create/update/delete events (client-side persisted)
- **Export** currently visible tasks to:
  - **JSON**
  - **CSV**

## Architecture

### Client (React + Vite)
- `App.jsx` owns global task state and fetches tasks from the API.
- `TaskList` renders a vertical list.
- `TaskBoard` renders a 3-column Kanban layout (Pending / In Progress / Completed).
- `TaskCard` is reused for each task in both views.
- `ExportTasks` exports the **currently filtered/sorted** task list.

### Server (Express + MongoDB)
- REST endpoints for tasks:
  - `GET /` list tasks
  - `POST /` create task
  - `PUT /:id` update task
  - `DELETE /:id` delete task

## Folder structure

### Client

```txt
client/
  src/
    components/
      TaskCard.jsx
      TaskList.jsx
      TaskBoard.jsx
      ExportTasks.jsx
      ...
    context/
      ThemeContext.jsx
    services/
      api.js
    utils/
      exportTasks.js
    App.jsx
```

### Server

```txt
server/
  server.js
  config/
    db.js
  controllers/
    taskController.js
  models/
    Task.js
  routes/
    taskRoutes.js
```

## Tech stack

- **Frontend:** React, Vite, TailwindCSS, Framer Motion
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Other:** Toast notifications, export utilities (JSON/CSV), confetti on completion

## Deployment

### Recommended approach

- Deploy the **server** to a Node platform (Render / Fly.io / Railway / Heroku alternatives)
- Deploy the **client** to a static host (Vercel / Netlify)

### Environment variables

Server uses `dotenv`; set values in a `.env` file (example):

```env
MONGODB_URI=...
PORT=...
```

## Future improvements

- Drag-and-drop task moving between Kanban columns
- Server-side export for very large task sets
- Pagination/virtualized lists
- More granular activity log (who/when, diff changes)
- Authentication + user-specific task lists

