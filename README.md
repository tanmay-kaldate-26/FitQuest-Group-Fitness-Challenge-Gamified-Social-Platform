# ⚔️ FitQuest  
## Gamified Group Fitness Challenge & Social Platform

<p align="center">
  <img src="screenshots/02-dashboard.png" width="800"/>
</p>

FitQuest is a full-stack gamified fitness platform built using **React, Spring Boot, and MySQL**.  
It transforms fitness activities into engaging challenges with streak tracking, leaderboards, and social interaction.

FitQuest is designed with scalable architecture, modular backend logic, and real-world product thinking, making it suitable for academic, portfolio, and interview-level demonstration.

---

## 🧠 Problem Statement

Most fitness applications focus only on tracking data, not motivation.  
FitQuest solves this by introducing gamification and social competition, encouraging users to remain consistent in their fitness journey.

---

## 🚀 Key Features

### 👤 User Management
- User registration and authentication
- Secure login and profile management

### 🏃 Challenge System
- Create individual and group challenges
- Join ongoing challenges
- Daily activity check-ins
- Streak tracking mechanism

### 🏆 Gamification
- Leaderboards and ranking system
- Achievement-based scoring
- Consistency and performance metrics

### 📊 Visualization
- Calendar-based activity tracking
- Progress monitoring dashboards

### 💬 Social Interaction
- Group participation in challenges
- Chat and interaction features (if implemented)

---

## 🏗️ System Architecture

```
Frontend (React)
       ↓ REST API
Backend (Spring Boot)
       ↓ JPA / JDBC
Database (MySQL)
```

### Backend Layered Architecture

```
Controller Layer → Handles HTTP requests
Service Layer    → Business logic (streaks, rankings)
Repository Layer → Database operations
Model Layer      → Entities (User, Challenge, Activity)
```

---

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript (ES6+)
- HTML5, CSS3

### Backend
- Java (Spring Boot)
- RESTful APIs
- MVC / Layered Architecture

### Database
- MySQL

### Tools & Practices
- Git & GitHub
- Postman
- Modular architecture
- REST API design

---

## 🗄️ Database Design (MySQL)

### Core Tables

#### users
- id (PK)
- username
- email
- password
- created_at

#### challenges
- id (PK)
- title
- description
- start_date
- end_date
- type (individual/group)
- created_by (FK → users.id)

#### challenge_participants
- id (PK)
- user_id (FK → users.id)
- challenge_id (FK → challenges.id)
- join_date

#### activities
- id (PK)
- user_id (FK)
- challenge_id (FK)
- activity_date
- status (completed/missed)

> Leaderboard is dynamically calculated using activity and streak data to avoid redundancy.

---

## 🔥 Core Logic

### Streak Calculation

```
if (today_completed) {
    if (yesterday_completed) {
        streak++;
    } else {
        streak = 1;
    }
} else {
    streak = 0;
}
```

### Leaderboard Score Example

```
score = (streak * 10) + (totalActivities * 2)
```

Users are ranked based on score in descending order.

---

## 📂 Project Structure

```
FitQuest/
│
├── backend/              # Spring Boot backend
├── Frontend/             # React frontend
├── screenshots/          # UI screenshots
├── README.md
└── .gitignore
```

---

## 🖼️ Application Screenshots

### Login
![Login](screenshots/01-login.png)

### Dashboard
![Dashboard](screenshots/02-dashboard.png)

### Challenges
![Challenges](screenshots/03-challenges.png)

### Challenge Details
![Challenge Details](screenshots/04-challenge-details.png)

### Daily Check-in
![Check-in](screenshots/05-checkin.png)

### Leaderboard
![Leaderboard](screenshots/06-leaderboard.png)

### Profile
![Profile](screenshots/07-profile.png)

### Settings
![Settings](screenshots/08-settings-profile.png)

### Chat
![Chat](screenshots/09-chat.png)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/tanmay-kaldate-26/FitQuest-Group-Fitness-Challenge-Gamified-Social-Platform.git
cd FitQuest-Group-Fitness-Challenge-Gamified-Social-Platform
```

### 2️⃣ Backend Setup

```bash
cd backend
# Run Spring Boot application
```

Configure MySQL in `application.properties`.

### 3️⃣ Frontend Setup

```bash
cd Frontend
npm install
npm start
```

### 4️⃣ Access Application

| Service | URL |
|--------|------|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |

---

## 🎯 Use Cases

- Individuals building fitness habits
- Groups competing in challenges
- Communities promoting healthy lifestyles
- Gamified habit-tracking platforms

---

## 🌍 Future Enhancements

- Mobile app (React Native / Flutter)
- AI-based fitness recommendations
- Wearable device integration
- Cloud deployment (AWS / Docker)
- Advanced analytics dashboard

---

## 💼 Resume-Ready Description

Developed a full-stack gamified fitness platform using React, Spring Boot, and MySQL, featuring user authentication, challenge management, daily activity tracking, streak calculation, and leaderboards. Designed RESTful APIs and relational database schema to support scalable challenge participation and real-time ranking while following layered architecture and modular design principles.

---

## 👨‍💻 Author

**Tanmay Kaldate**  
GitHub: https://github.com/tanmay-kaldate-26  
LinkedIn: https://www.linkedin.com/in/tanmay-kaldate-044b3929a

---

## 📜 License

This project is licensed under the MIT License.