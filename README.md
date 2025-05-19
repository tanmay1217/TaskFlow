# TaskFlow Board

A Trello-style task management board built with React and Flask.

## Features

- Mobile-first design
- Drag and drop task management
- Three columns: To Do, In Progress, Done
- CRUD operations for tasks
- Real-time state persistence
- Beautiful UI with Tailwind CSS

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- react-beautiful-dnd for drag and drop
- Axios for API calls

### Backend
- Python Flask
- SQLAlchemy for database ORM
- SQLite database
- Flask-CORS for cross-origin support

## Setup

### Backend Setup

1. Create a Python virtual environment:
```bash
cd Backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the backend server:
```bash
python run.py
```

The backend server will run on http://localhost:5000

### Frontend Setup

1. Install dependencies:
```bash
cd Frontend
npm install
```

2. Run the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:5173

## API Endpoints

- `GET /api/board` - Get the entire board structure
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/<task_id>` - Update an existing task
- `DELETE /api/tasks/<task_id>` - Delete a task

## Development

- Backend code is in the `Backend` directory
- Frontend code is in the `Frontend` directory
- The frontend uses TypeScript for type safety
- The backend uses SQLite for data persistence
- CORS is enabled for local development 