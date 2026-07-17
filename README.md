# StarFish Resource Booking Application

Welcome to the **StarFish Resource Booking Application**! This repository contains a full-stack web application designed for booking and managing resources (such as projectors, auditoriums, football/cricket kits, meeting rooms, and computer labs).

---

## 🛠️ Tech Stack & Architecture

The application is structured into two main components:

1. **Backend (`/backend`)**:
   - Built with **Django** (Python 3) & **Django REST Framework** (DRF)
   - Database: **SQLite** (pre-configured, stores users, resources, and bookings)
   - Port: `8000`

2. **Frontend (`/frontend`)**:
   - Built with **React** + **Vite** + **TypeScript**
   - Styling: **TailwindCSS** v4
   - Icons: **Lucide React**
   - Port: `3000`

---

## 🚀 How to Run the Application

Follow these step-by-step instructions to get the application up and running on your local machine.

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [Python](https://www.python.org/) (v3.10 or higher recommended)
- `pip` (Python package manager)

---

### 1. Set Up and Run the Backend

Navigate to the `backend` directory:
```bash
cd backend
```

#### Step A: Configure Python Virtual Environment
It is highly recommended to use a virtual environment:
- **macOS / Linux**:
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```
- **Windows**:
  ```cmd
  python -m venv venv
  venv\Scripts\activate
  ```

#### Step B: Install Dependencies
Install the required packages using the `requirements.txt` file:
```bash
pip install -r requirements.txt
```

#### Step C: Run Database Migrations (Optional)
The pre-configured SQLite database (`db.sqlite3`) is already included. If you want to ensure the schema is up to date, run:
```bash
python manage.py migrate
```

#### Step D: Start the Django Server
Run the development server:
```bash
python manage.py runserver 0.0.0.0:8000
```
The backend API will be available at `http://localhost:8000`.

---

### 2. Set Up and Run the Frontend

In a new terminal window/tab, navigate to the `frontend` directory from the repository root:
```bash
cd frontend
```

#### Step A: Install Node Dependencies
Install all required packages:
```bash
npm install
```

#### Step B: Start the React + Vite Development Server
Start the frontend app:
```bash
npm run dev
```
The frontend application will be running at `http://localhost:3000`. Open your browser and navigate to `http://localhost:3000` to interact with the application.

---

## 🧪 Running Tests

### Backend Tests
To run the Django test suite, navigate to the `backend/` directory and run:
```bash
python manage.py test
```

---

## 📁 Directory Structure
```text
summer-of-codesfest-20-starfish/
├── backend/                   # Django REST Framework backend
│   ├── bookings/              # Bookings application logic
│   │   ├── migrations/        # Database migrations
│   │   ├── models.py          # Data models (User, Resource, Booking)
│   │   ├── views.py           # API Endpoints
│   │   └── tests.py           # Unit tests
│   ├── core/                  # Core Django configuration (settings, urls)
│   ├── db.sqlite3             # SQLite Database
│   ├── manage.py              # Django CLI entrypoint
│   └── requirements.txt       # Backend dependencies
├── frontend/                  # React Vite frontend
│   ├── src/
│   │   ├── components/        # Reusable React UI components
│   │   ├── api.ts             # API client functions for backend calls
│   │   ├── types.ts           # TypeScript definitions
│   │   ├── main.tsx           # Application entrypoint
│   │   └── App.tsx            # Main layout and routing
│   ├── package.json           # Node configuration & dependencies
│   └── vite.config.ts         # Vite build tool settings
└── README.md                  # This documentation
```
