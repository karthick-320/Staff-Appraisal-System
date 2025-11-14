# Staff Appraisal System (MERN Stack)

A complete MERN-based web application for managing faculty activities and appraisal scoring.  
The system supports Staff, Coordinator, and HoD workflows with approval stages and automatic point calculation.

## Features
- Staff submits activities like Workshops, FDPs, Seminars, STTP, Courses, Internships.
- Automatic point calculation.
- Coordinator verifies and approves activities.
- HoD final approval.
- JWT-based authentication.

## Tech Stack
### Frontend
- React + Vite

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose

## Installation
### Clone Repo
```
git clone https://github.com/karthick-320/Staff-Appraisal-System/
cd Staff-Appraisal-System
```

### Backend Setup
```
cd backend
npm install
```

Create `.env`:
```
PORT=5000
MONGO_URI= MongoDb URL
JWT_SECRET= Secret Key
```

Run backend:
```
npm run dev
```

### Frontend Setup
```
cd frontend
npm install
```

Create `.env`:
```
VITE_API_BASE_URL=http://localhost:5000
```

Run frontend:
```
npm run dev
```

## Default Seed Users

### Staff User
- Email: staff@example.com
- Password: Password123!

### Coordinator User
- Email: coordinator@example.com
- Password: Password123!

### HoD User
- Email: hod@example.com
- Password: Password123!


