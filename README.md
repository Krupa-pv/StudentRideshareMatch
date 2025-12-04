# Student Rideshare Match

A web application that helps students find rideshare matches for flights and trains, allowing them to split Uber/Lyft costs when traveling to and from airports or train stations.

## Features

- **Student Management**: Add and view students
- **Flight & Train Management**: Add flights and trains, register student bookings
- **Smart Matching**: Find other students with similar flight/train timings for rideshare opportunities
- **Group Management**: Create and join transport groups to coordinate rideshares
- **Web Interface**: Modern React-based frontend with a Flask REST API backend

## Prerequisites

Before running the application, make sure you have the following installed:

- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16+** and **npm** - [Download Node.js](https://nodejs.org/)
- **MySQL** - [Download MySQL](https://dev.mysql.com/downloads/mysql/)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd StudentRideshareMatch
```

### 2. Set Up the Database

First, create and configure the MySQL database:

```bash
mysql -u root -p < setup_database.sql
```

**Note**: If you get "command not found", try using the full path to MySQL:

```bash
/usr/local/mysql/bin/mysql -u root -p < setup_database.sql
```

Or add MySQL to your PATH:

```bash
export PATH=$PATH:/usr/local/mysql/bin
mysql -u root -p < setup_database.sql
```

### 3. Configure Database Credentials

Edit `backend/db_config.py` and update the database connection settings:

```python
def get_connection():
    try:
        conn = mysql.connector.connect(
            host='localhost',
            database='travel_match',
            user='root',          # Update with your MySQL username
            password=''           # Update with your MySQL password
        )
        # ...
```

### 4. Install Python Dependencies

Install the required Python packages:

```bash
pip install -r requirements.txt
```

### 5. Install Frontend Dependencies

Navigate to the frontend directory and install Node.js dependencies:

```bash
cd frontend
npm install
cd ..
```

## Running the Application

The application consists of two parts that need to run simultaneously:

### Start the Backend Server

In the project root directory, run:

```bash
python backend/app.py
```

The backend API server will start on **http://localhost:5001**

You should see output like:
```
============================================================
  STUDENT RIDESHARE MATCHER - API SERVER
  API running at: http://localhost:5001
  Frontend should run at: http://localhost:5173
============================================================
```

### Start the Frontend Development Server

Open a **new terminal window** and navigate to the frontend directory:

```bash
cd frontend
npm run dev
```

The frontend will start on **http://localhost:5173**

The Vite development server will automatically open the application in your browser, or you can manually navigate to `http://localhost:5173`.

## Usage

1. **Access the Web Application**: Open your browser and go to `http://localhost:5173`

2. **Add Students**: Navigate to the Students page to add new students with their Case ID, name, and year of study.

3. **Add Flights/Trains**: Add flight and train information that students might be traveling on.

4. **Register Bookings**: Register students' flight or train bookings with their confirmation codes.

5. **Find Matches**: Use the Find Matches feature to find other students with similar travel timings for potential rideshare opportunities.

6. **Manage Groups**: Create transport groups and invite other students to join for coordinated rideshares.

## Project Structure

```
StudentRideshareMatch/
├── backend/
│   ├── app.py              # Flask API server
│   ├── db_config.py        # Database configuration
│   └── db_operations.py    # Database operations
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Students.jsx
│   │   │   ├── FindMatches.jsx
│   │   │   └── Groups.jsx
│   │   └── services/
│   │       └── api.js      # API service layer
│   ├── package.json
│   └── vite.config.js
├── main.py                 # CLI version (optional)
├── setup_database.sql      # Database schema
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## Technologies Used

### Backend
- **Flask** - Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **MySQL Connector** - MySQL database driver

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/students` - Get all students
- `POST /api/students` - Add a new student
- `GET /api/flights` - Get all flights
- `POST /api/flights` - Add a new flight
- `GET /api/trains` - Get all trains
- `POST /api/trains` - Add a new train
- `POST /api/bookings/flight` - Register a student's flight booking
- `POST /api/bookings/train` - Register a student's train booking
- `GET /api/bookings/student/<case_id>` - Get a student's bookings
- `POST /api/matches/flights` - Find flight matches
- `POST /api/matches/trains` - Find train matches
- `GET /api/groups` - Get all groups
- `POST /api/groups` - Create a new group
- `GET /api/groups/<group_id>/members` - Get group members
- `POST /api/groups/join` - Join a group
- `POST /api/groups/leave` - Leave a group
- `GET /api/groups/student/<case_id>` - Get student's group

## Troubleshooting

### Database Connection Issues

- Ensure MySQL is running: `mysql.server start` (macOS) or check your system's MySQL service
- Verify your credentials in `backend/db_config.py`
- Make sure the `travel_match` database exists (run `setup_database.sql`)

### Port Already in Use

- If port 5001 is in use, modify `backend/app.py` to use a different port
- If port 5173 is in use, Vite will automatically use the next available port

### CORS Errors

- Ensure the backend server is running before starting the frontend
- Check that Flask-CORS is properly installed and configured

## CLI Version

The project also includes a CLI version. To run it:

```bash
python main.py
```

This provides a command-line interface for all the same features available in the web application.

## License

See the LICENSE file for details.

