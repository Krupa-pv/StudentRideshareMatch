# Student Rideshare Matcher - Web Interface Implementation Guide

## ✅ What's Been Set Up

### Backend (Flask API) - ✓ Complete
- Flask REST API server at `backend/app.py`
- All database operations exposed as API endpoints
- CORS enabled for React frontend
- Auto-start health check

### Frontend (React + Vite) - ✓ Structure Ready
- React project scaffolded with Vite
- React Router installed for navigation
- Axios installed for API calls
- Tailwind CSS configured for styling

---

## 📁 Current Project Structure

```
StudentRideshareMatch/
├── backend/
│   ├── app.py                    # Flask API server ✓
│   ├── db_config.py              # Database config ✓
│   └── db_operations.py          # Database operations ✓
│
├── frontend/
│   ├── src/
│   │   ├── components/           # React components (to create)
│   │   ├── pages/                # Page components (to create)
│   │   ├── services/             # API service layer (to create)
│   │   ├── App.jsx               # Main app (to update)
│   │   ├── index.css             # Tailwind styles ✓
│   │   └── main.jsx              # Entry point ✓
│   ├── package.json              # Dependencies ✓
│   ├── tailwind.config.js        # Tailwind config ✓
│   └── vite.config.js            # Vite config ✓
│
├── main.py                       # CLI (keep for demo)
├── requirements.txt              # Updated with Flask ✓
└── WEB_INTERFACE_GUIDE.md        # This file ✓
```

---

## 🚀 How to Run

### Terminal 1: Backend API
```bash
cd backend
python3 app.py
```
**Runs at:** http://localhost:5000

### Terminal 2: Frontend React App
```bash
cd frontend
npm run dev
```
**Runs at:** http://localhost:5173

---

## 📡 API Endpoints Reference

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Add new student
  ```json
  {
    "case_id": "wxs428",
    "full_name": "Wiam Skakri",
    "year_of_study": 3
  }
  ```

### Flights
- `GET /api/flights` - Get all flights
- `POST /api/flights` - Add new flight
  ```json
  {
    "flight_date": "2025-12-25",
    "flight_time": "14:30:00",
    "departing_airport": "CLE"
  }
  ```

### Trains
- `GET /api/trains` - Get all trains
- `POST /api/trains` - Add new train
  ```json
  {
    "train_date": "2025-12-25",
    "train_time": "10:00:00",
    "departing_station": "Cleveland Station"
  }
  ```

### Bookings
- `POST /api/bookings/flight` - Book student on flight
  ```json
  {
    "case_id": "wxs428",
    "flight_no": "CLE_20251225_1430",
    "confirmation_code": "ABC123"
  }
  ```
- `POST /api/bookings/train` - Book student on train
- `GET /api/bookings/student/<case_id>` - Get student's bookings

### Matching (THE CORE FEATURE)
- `POST /api/matches/flights` - Find flight rideshare matches
  ```json
  {
    "departing_airport": "CLE",
    "flight_date": "2025-12-25",
    "flight_time": "14:30:00",
    "time_window": 2
  }
  ```
- `POST /api/matches/trains` - Find train rideshare matches

---

## 🎨 Next Steps: Building the React UI

### Phase 1: Basic Structure (2-3 hours)

1. **Create API Service Layer** (`frontend/src/services/api.js`)
2. **Set up React Router** (`frontend/src/App.jsx`)
3. **Create Navigation** (`frontend/src/components/Navbar.jsx`)

### Phase 2: Core Pages (4-5 hours)

1. **Home/Dashboard** (`frontend/src/pages/Home.jsx`)
2. **Students Page** (`frontend/src/pages/Students.jsx`)
   - List all students
   - Add new student form
3. **Flights Page** (`frontend/src/pages/Flights.jsx`)
   - List all flights
   - Add new flight form
4. **Trains Page** (`frontend/src/pages/Trains.jsx`)
   - Similar to flights
5. **Find Matches Page** (`frontend/src/pages/FindMatches.jsx`)
   - THE SHOWCASE FEATURE
   - Input form for search criteria
   - Display matched students

### Phase 3: Polish (2-3 hours)

1. **Styling with Tailwind**
2. **Error handling**
3. **Loading states**
4. **Responsive design**

---

## 💡 Quick Start Template

### Create API Service (`frontend/src/services/api.js`)

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Students
  getStudents: () => axios.get(`${API_BASE_URL}/students`),
  addStudent: (data) => axios.post(`${API_BASE_URL}/students`, data),

  // Flights
  getFlights: () => axios.get(`${API_BASE_URL}/flights`),
  addFlight: (data) => axios.post(`${API_BASE_URL}/flights`, data),

  // Trains
  getTrains: () => axios.get(`${API_BASE_URL}/trains`),
  addTrain: (data) => axios.post(`${API_BASE_URL}/trains`, data),

  // Bookings
  bookFlight: (data) => axios.post(`${API_BASE_URL}/bookings/flight`, data),
  bookTrain: (data) => axios.post(`${API_BASE_URL}/bookings/train`, data),
  getStudentBookings: (caseId) => axios.get(`${API_BASE_URL}/bookings/student/${caseId}`),

  // Matches (THE CORE)
  findFlightMatches: (data) => axios.post(`${API_BASE_URL}/matches/flights`, data),
  findTrainMatches: (data) => axios.post(`${API_BASE_URL}/matches/trains`, data),
};
```

---

## 🎯 Implementation Priority

For maximum impact with limited time:

1. **MUST HAVE** (Core requirement):
   - Home page with navigation
   - Find Matches page (showcase your matching algorithm!)
   - Students list page
   - Basic styling

2. **SHOULD HAVE** (Better demo):
   - Add student form
   - Add flight/train forms
   - View bookings

3. **NICE TO HAVE** (5% bonus):
   - Polished UI with Tailwind
   - Smooth animations
   - Mobile responsive
   - Error handling

---

## 📝 Testing Your API

Test with curl before building UI:

```bash
# Get all students
curl http://localhost:5000/api/students

# Add a student
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{"case_id":"test123","full_name":"Test User","year_of_study":3}'

# Find matches
curl -X POST http://localhost:5000/api/matches/flights \
  -H "Content-Type: application/json" \
  -d '{"departing_airport":"CLE","flight_date":"2025-12-25","flight_time":"14:30:00","time_window":2}'
```

---

## 🐛 Troubleshooting

**CORS errors?**
- Make sure Flask server is running
- Check Flask-CORS is installed: `pip3 list | grep Flask-CORS`

**Can't connect to database?**
- Verify MySQL is running: `brew services list | grep mysql`
- Test connection: `cd backend && python3 -c "from db_config import test_connection; test_connection()"`

**Vite not starting?**
- Delete `node_modules` and reinstall: `cd frontend && rm -rf node_modules && npm install`

---

## 🎓 For Your Project Report

**Technologies Used:**
- Frontend: React 18, Vite, React Router, Tailwind CSS
- Backend: Flask 3.0, Flask-CORS
- Database: MySQL 9.5
- API: RESTful architecture
- Language: Python 3.13, JavaScript ES6+

**Architecture:**
- Client-Server architecture with REST API
- Separation of concerns (UI, API, Database layers)
- CORS-enabled for local development
- Stateless API design

---

## ✅ Checklist Before Presentation

- [ ] Both servers run without errors
- [ ] Can add students, flights, trains via UI
- [ ] **SHOWCASE:** Find matches feature works beautifully
- [ ] UI looks professional (Tailwind styling)
- [ ] No console errors
- [ ] Works in both Chrome and Safari
- [ ] Have test data pre-loaded for demo
- [ ] CLI still works (for comparison)

---

## 📚 Useful Commands

```bash
# Create a new React component
cd frontend/src/components
touch StudentList.jsx

# Install a new package
cd frontend
npm install <package-name>

# Check API is running
curl http://localhost:5000/api/health

# View backend logs
cd backend
python3 app.py

# Build for production
cd frontend
npm run build
```

---

**Ready to start building? Let me know if you want me to:**
1. Create the complete React UI structure
2. Build specific pages
3. Help with any part of the implementation
4. Test the API endpoints

**Next command to try:**
```bash
cd backend && python3 app.py
```

Then open another terminal:
```bash
cd frontend && npm run dev
```

Good luck! 🚀
