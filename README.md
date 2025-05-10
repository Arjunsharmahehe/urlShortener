# URL Shortener - Full Stack Application

This project is a full-stack URL shortener application. It consists of:

1.  **Backend**: A FastAPI application providing an API for creating, managing, and redirecting shortened URLs.
2.  **Frontend**: A React application (built with Vite and managed by pnpm) that provides a user interface to interact with the URL shortener service.

## Showcase
[![Thumbnail](./showcase/thumbnail.png)](https://youtu.be/uFi1hp9uP6A)

## Directory Structure

```
your-project-name/
├── backend/        # FastAPI backend application
│   └── README.md   # Detailed setup and API documentation for the backend
├── frontend/       # React frontend application
└── README.md       # This file: Overall project setup
```

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: (LTS version recommended, e.g., v18 or v20) - For the frontend.
*   **pnpm**: A fast, disk space-efficient package manager for Node.js. Install via `npm install -g pnpm` if you don't have it.
*   **Python**: (Version 3.12+ recommended) - For the backend.
*   **pip**: Python package installer (usually comes with Python).
*   **uv**: Python package manager used for this project.
*   **Git**: (Optional, if cloning the repository).

## Setup and Installation

Follow these steps to set up and run the project:

### 1. Clone the Repository (if applicable)

```bash
git clone git@github.com:Arjunsharmahehe/urlShortener.git
cd urlShortener
```

### 2. Backend Setup

The backend is a FastAPI application.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  **Follow the detailed setup instructions in `backend/README.md`**. This will typically involve:
    * Run the server
    ```bash
    uv run main.py
    ```

    > **Important**: Refer to `backend/README.md` for specific commands and configurations.

### 3. Frontend Setup

The frontend is a React application managed with pnpm.

1.  Navigate to the frontend directory (from the project root):
    ```bash
    cd frontend
    ```
2.  Install project dependencies using pnpm:
    ```bash
    pnpm install
    ```
3.  **(Optional) Environment Configuration**:
    The frontend might need to know the backend API's URL. Typically, React projects (especially those built with Vite) use a `.env` file for this. Create a `.env.local` file in the `frontend` directory if one doesn't exist, and add the backend API URL. For example:
    ```env
    # frontend/.env.local
    VITE_API_BASE_URL=http://localhost:8000
    ```
    Ensure your frontend code uses this environment variable (e.g., `import.meta.env.VITE_API_BASE_URL`) to make API calls. The backend is configured by default to allow requests from `http://localhost:5173` and `http://127.0.0.1:5173` (common Vite dev server ports).

    **or** you could modify the URL provided in the UrlContext and work from there.

## Running the Application

Both the backend and frontend servers need to be running simultaneously.

### 1. Start the Backend Server

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Running the server
    ```bash
    uv run main.py
    ```
    The backend API should now be running, usually at `http://127.0.0.1:8000`. You can check its interactive documentation at `http://127.0.0.1:8000/docs`.

### 2. Start the Frontend Development Server

1.  Open a **new terminal window/tab**.
2.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
3.  Start the React development server:
    ```bash
    pnpm run dev
    ```
    The frontend application should now be running, usually at `http://localhost:5173` (Vite's default).

## Accessing the Application

*   **Frontend UI**: Open your browser and go to `http://localhost:5173` (or the port shown by `pnpm run dev`).
*   **Backend API**: The API is accessible at `http://127.0.0.1:8000`.
*   **Backend API Docs (Swagger UI)**: `http://127.0.0.1:8000/docs`.

## Further Information

*   For detailed information about the backend API endpoints, architecture, and specific setup, please refer to the `backend/README.md` file.
*   For more details on frontend development, scripts, or structure, refer to the React and Vite documentation, and any specific notes within the `frontend` directory.
