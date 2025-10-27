# LearnAble Platform - Backend API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack Recommendations](#tech-stack-recommendations)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Authentication](#authentication)
6. [Real-time Features](#real-time-features)
7. [Environment Variables](#environment-variables)
8. [Data Models](#data-models)

---

## Overview

LearnAble is an educational platform for children with special learning needs (ADHD, Autism, Down Syndrome, Dyslexia, Dyscalculia, Dysgraphia). The platform supports three user roles:
- **Children/Students**: Complete learning activities and games
- **Parents**: Monitor child progress and communicate with teachers
- **Teachers**: Manage classrooms, assign activities, and track student performance

---

## Tech Stack Recommendations

### Backend Framework Options
- **Option 1**: Node.js + Express.js
- **Option 2**: Node.js + NestJS (recommended for large scale)
- **Option 3**: Python + FastAPI
- **Option 4**: Python + Django REST Framework

### Database
- **Primary**: PostgreSQL (relational data)
- **Cache**: Redis (sessions, real-time data)
- **File Storage**: AWS S3 / Cloudinary (profile pictures, activity media)

### Additional Services
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.io / WebSockets
- **Email**: SendGrid / NodeMailer
- **Analytics**: Google Analytics / Mixpanel

---

## Database Schema

### 1. Users Table

**Table Name**: users

**Columns**:
- id: UUID (Primary Key, auto-generated)
- email: VARCHAR(255), UNIQUE
- password_hash: VARCHAR(255)
- role: ENUM('child', 'parent', 'teacher'), NOT NULL
- full_name: VARCHAR(255), NOT NULL
- profile_picture_url: TEXT
- is_active: BOOLEAN, default true
- is_verified: BOOLEAN, default false
- created_at: TIMESTAMP, default CURRENT_TIMESTAMP
- updated_at: TIMESTAMP, default CURRENT_TIMESTAMP
- last_login: TIMESTAMP

**Role-specific fields**:
- pin: VARCHAR(4) - For child login
- parent_email: VARCHAR(255) - For child accounts
- school_name: VARCHAR(255) - For teachers

**Indexes**:
- idx_email on (email)
- idx_role on (role)

---

### 2. Children/Students Table

**Table Name**: students

**Columns**:
- id: UUID (Primary Key, auto-generated)
- user_id: UUID (Foreign Key -> users.id, CASCADE on delete)
- parent_id: UUID (Foreign Key -> users.id)
- teacher_id: UUID (Foreign Key -> users.id)
- date_of_birth: DATE
- grade_level: VARCHAR(50)

**Learning conditions**:
- conditions: JSONB, default '[]' - Array like ['ADHD', 'Dyslexia', etc.]

**Settings**:
- preferred_animal_mascot: VARCHAR(50)
- learning_preferences: JSONB
- accessibility_settings: JSONB

**Progress tracking**:
- total_activities_completed: INT, default 0
- total_time_spent_seconds: INT, default 0
- current_streak_days: INT, default 0
- longest_streak_days: INT, default 0
- created_at: TIMESTAMP, default CURRENT_TIMESTAMP
- updated_at: TIMESTAMP, default CURRENT_TIMESTAMP

**Indexes**:
- idx_parent on (parent_id)
- idx_teacher on (teacher_id)

---

### 3. Activities Table

**Table Name**: activities

**Columns**:
- id: UUID (Primary Key, auto-generated)
- slug: VARCHAR(255), UNIQUE, NOT NULL
- title: VARCHAR(255), NOT NULL
- description: TEXT
- category: VARCHAR(100), NOT NULL - Options: 'reading', 'math', 'focus', 'memory', 'social'
- difficulty: VARCHAR(50) - Options: 'Easy', 'Medium', 'Hard'
- duration_seconds: INT, NOT NULL
- emoji: VARCHAR(10)
- thumbnail_url: TEXT

**Targeting**:
- target_conditions: JSONB, default '[]' - Which conditions this helps
- age_range: JSONB - Format: {"min": 6, "max": 12}

**Content**:
- instructions: TEXT
- content_data: JSONB - Activity-specific content
- is_active: BOOLEAN, default true
- created_at: TIMESTAMP, default CURRENT_TIMESTAMP
- updated_at: TIMESTAMP, default CURRENT_TIMESTAMP

**Indexes**:
- idx_category on (category)
- idx_difficulty on (difficulty)
- idx_slug on (slug)

---

### 4. Games Table

**Table Name**: games

**Columns**:
- id: UUID (Primary Key, auto-generated)
- slug: VARCHAR(255), UNIQUE, NOT NULL
- type: VARCHAR(100), NOT NULL - Options: 'cpt', 'tracing', 'reading', 'math'
- title: VARCHAR(255), NOT NULL
- description: TEXT
- category: VARCHAR(100), NOT NULL - Options: 'ADHD', 'Dyslexia', 'Dyscalculia', etc.
- difficulty: VARCHAR(50)
- duration_seconds: INT, NOT NULL
- thumbnail_url: TEXT
- animal_mascot: VARCHAR(50)
- color_theme: VARCHAR(50)
- max_players: INT, default 1

**Game configuration**:
- game_config: JSONB - Game-specific parameters
- scoring_rules: JSONB
- is_active: BOOLEAN, default true
- created_at: TIMESTAMP, default CURRENT_TIMESTAMP
- updated_at: TIMESTAMP, default CURRENT_TIMESTAMP

**Indexes**:
- idx_type on (type)
- idx_category on (category)
- idx_slug on (slug)

---

### 5. Activity Completions Table

**Table Name**: activity_completions

**Columns**:
- id: UUID (Primary Key, auto-generated)
- student_id: UUID (Foreign Key -> students.id, CASCADE on delete)
- activity_id: UUID (Foreign Key -> activities.id, CASCADE on delete)
- started_at: TIMESTAMP, NOT NULL
- completed_at: TIMESTAMP
- duration_seconds: INT

**Performance**:
- score: INT
- accuracy_percentage: DECIMAL(5,2)
- stars_earned: INT - Range: 1-3 stars

**Detailed metrics**:
- performance_data: JSONB - Activity-specific metrics
- is_completed: BOOLEAN, default false
- created_at: TIMESTAMP, default CURRENT_TIMESTAMP

**Indexes**:
- idx_student on (student_id)
- idx_activity on (activity_id)
- idx_completed on (student_id, completed_at)

---

### 6. Game Sessions Table

**Table Name**: game_sessions

**Columns**:
- id: UUID (Primary Key, auto-generated)
- student_id: UUID (Foreign Key -> students.id, CASCADE on delete)
- game_id: UUID (Foreign Key -> games.id, CASCADE on delete)
- started_at: TIMESTAMP, NOT NULL
- ended_at: TIMESTAMP
- duration_seconds: INT

**Performance**:
- final_score: INT
- phase_reached: INT

**Detailed tracking**:
- events: JSONB - Array of game events
- parameters: JSONB - Measured parameters (reaction time, accuracy, etc.)
- is_completed: BOOLEAN, default false
- created_at: TIMESTAMP, default CURRENT_TIMESTAMP

**Indexes**:
- idx_student on (student_id)
- idx_game on (game_id)
- idx_session_date on (student_id, started_at)

---

### 7. Classrooms Table

**Table Name**: classrooms

**Columns**:
- id: UUID (Primary Key, auto-generated)
- teacher_id: UUID (Foreign Key -> users.id, CASCADE on delete)
- name: VARCHAR(255), NOT NULL
- description: TEXT
- grade_level: VARCHAR(50)
- school_year: VARCHAR(50)
- is_active: BOOLEAN, default true
- created_at: TIMESTAMP, default CURRENT_TIMESTAMP
- updated_at: TIMESTAMP, default CURRENT_TIMESTAMP

**Indexes**:
- idx_teacher on (teacher_id)

---

### 8. Classroom Students Table

**Table Name**: classroom_students

**Columns**:
- id: UUID (Primary Key, auto-generated)
- classroom_id: UUID (Foreign Key -> classrooms.id, CASCADE on delete)
- student_id: UUID (Foreign Key -> students.id, CASCADE on delete)
- enrolled_at: TIMESTAMP, default CURRENT_TIMESTAMP
- is_active: BOOLEAN, default true

**Constraints**:
- UNIQUE(classroom_id, student_id)

**Indexes**:
- idx_classroom on (classroom_id)
- idx_student on (student_id)

---

### 9. Assignments Table

**Table Name**: assignments

**Columns**:
- id: UUID (Primary Key, auto-generated)
- teacher_id: UUID (Foreign Key -> users.id, CASCADE on delete)
- classroom_id: UUID (Foreign Key -> classrooms.id)
- title: VARCHAR(255), NOT NULL
- description: TEXT

**Assignment type**:
- activity_id: UUID (Foreign Key -> activities.id)
- game_id: UUID (Foreign Key -> games.id)

**Timing**:
- assigned_at: TIMESTAMP, default CURRENT_TIMESTAMP
- due_date: TIMESTAMP
- is_active: BOOLEAN, default true

**Indexes**:
- idx_teacher on (teacher_id)
- idx_classroom on (classroom_id)
- idx_due_date on (due_date)

---

### 10. Student Assignments Table

**Table Name**: student_assignments

**Columns**:
- id: UUID (Primary Key, auto-generated)
- assignment_id: UUID (Foreign Key -> assignments.id, CASCADE on delete)
- student_id: UUID (Foreign Key -> students.id, CASCADE on delete)
- status: VARCHAR(50), default 'pending' - Options: 'pending', 'in_progress', 'completed'
- started_at: TIMESTAMP
- completed_at: TIMESTAMP

**Link to completion**:
- activity_completion_id: UUID (Foreign Key -> activity_completions.id)
- game_session_id: UUID (Foreign Key -> game_sessions.id)

**Constraints**:
- UNIQUE(assignment_id, student_id)

**Indexes**:
- idx_assignment on (assignment_id)
- idx_student on (student_id)
- idx_status on (status)

---

### 11. Achievements Table

**Table Name**: achievements

**Columns**:
- id: UUID (Primary Key, auto-generated)
- name: VARCHAR(255), NOT NULL
- description: TEXT
- icon: VARCHAR(100)
- category: VARCHAR(100) - Options: 'streak', 'completion', 'mastery', 'speed'

**Unlock criteria**:
- criteria: JSONB - Format: {"type": "streak", "days": 7}
- points: INT, default 0
- is_active: BOOLEAN, default true
- created_at: TIMESTAMP, default CURRENT_TIMESTAMP

**Indexes**:
- idx_category on (category)

---

### 12. Student Achievements Table

**Table Name**: student_achievements

**Columns**:
- id: UUID (Primary Key, auto-generated)
- student_id: UUID (Foreign Key -> students.id, CASCADE on delete)
- achievement_id: UUID (Foreign Key -> achievements.id, CASCADE on delete)
- unlocked_at: TIMESTAMP, default CURRENT_TIMESTAMP

**Constraints**:
- UNIQUE(student_id, achievement_id)

**Indexes**:
- idx_student on (student_id)
- idx_achievement on (achievement_id)

---

### 13. Messages Table

**Table Name**: messages

**Columns**:
- id: UUID (Primary Key, auto-generated)
- sender_id: UUID (Foreign Key -> users.id, CASCADE on delete)
- recipient_id: UUID (Foreign Key -> users.id, CASCADE on delete)
- subject: VARCHAR(255)
- message: TEXT, NOT NULL
- is_read: BOOLEAN, default false
- read_at: TIMESTAMP

**Thread support**:
- parent_message_id: UUID (Foreign Key -> messages.id)
- created_at: TIMESTAMP, default CURRENT_TIMESTAMP

**Indexes**:
- idx_sender on (sender_id)
- idx_recipient on (recipient_id)
- idx_thread on (parent_message_id)

---

### 14. Progress Reports Table

**Table Name**: progress_reports

**Columns**:
- id: UUID (Primary Key, auto-generated)
- student_id: UUID (Foreign Key -> students.id, CASCADE on delete)
- generated_by: UUID (Foreign Key -> users.id) - Teacher or system
- report_type: VARCHAR(50) - Options: 'weekly', 'monthly', 'custom'
- period_start: DATE, NOT NULL
- period_end: DATE, NOT NULL

**Summary data**:
- summary: JSONB - Overall statistics
- recommendations: TEXT

**File storage**:
- pdf_url: TEXT
- created_at: TIMESTAMP, default CURRENT_TIMESTAMP

**Indexes**:
- idx_student on (student_id)
- idx_period on (student_id, period_start, period_end)

---

### 15. Assessments Table

**Table Name**: assessments

**Columns**:
- id: UUID (Primary Key, auto-generated)
- student_id: UUID (Foreign Key -> students.id, CASCADE on delete)
- assessed_by: UUID (Foreign Key -> users.id) - Teacher or parent
- assessment_type: VARCHAR(100) - Options: 'initial', 'progress', 'final'

**Assessment data**:
- responses: JSONB - Question-answer pairs
- scores: JSONB - Domain scores
- overall_score: DECIMAL(5,2)
- notes: TEXT
- recommendations: TEXT
- created_at: TIMESTAMP, default CURRENT_TIMESTAMP

**Indexes**:
- idx_student on (student_id)
- idx_type on (assessment_type)

---

## API Endpoints

### Authentication & Users

#### 1. User Registration

**Endpoint**: POST /api/auth/register

**Content-Type**: application/json

**Request Body**:
- role: "child" | "parent" | "teacher"
- email: "user@example.com"
- password: "SecurePass123!"
- fullName: "John Doe"

**Child specific**:
- pin: "1234"
- parentEmail: "parent@example.com"

**Teacher specific**:
- schoolName: "Example School"

**Response (201 - Created)**:
- success: true
- data:
  - user:
    - id: "uuid"
    - email: "user@example.com"
    - role: "parent"
    - fullName: "John Doe"
  - token: "jwt-token-here"

#### 2. User Login
```http
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
  // OR for children:
  // "pin": "1234"
}

Response (200):
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "parent",
      "fullName": "John Doe",
      "profilePictureUrl": "https://..."
    },
    "token": "jwt-token-here"
  }
}
```

#### 3. Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "child",
      "fullName": "Alex Smith",
      "profilePictureUrl": "https://...",
      "studentProfile": {
        "conditions": ["ADHD", "Dyslexia"],
        "gradeLevel": "Grade 3",
        "preferredAnimalMascot": "lion",
        "currentStreakDays": 7,
        "totalActivitiesCompleted": 45
      }
    }
  }
}
```

#### 4. Update Profile
```http
PATCH /api/users/:userId
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "fullName": "Alex Johnson",
  "profilePictureUrl": "https://...",
  "studentProfile": {
    "preferredAnimalMascot": "elephant",
    "learningPreferences": {...}
  }
}

Response (200):
{
  "success": true,
  "data": {
    "user": {...}
  }
}
```

#### 5. Change Password
```http
POST /api/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}

Response (200):
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

### Activities

#### 6. Get All Activities
```http
GET /api/activities?category=reading&difficulty=Easy&page=1&limit=20
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "uuid",
        "slug": "word-detective",
        "title": "Word Detective 🔍",
        "description": "Find hidden words in colorful pictures",
        "category": "reading",
        "difficulty": "Easy",
        "durationSeconds": 600,
        "emoji": "🔍",
        "thumbnailUrl": "https://...",
        "targetConditions": ["Dyslexia"],
        "ageRange": {"min": 6, "max": 10},
        "rating": 4.8
      }
      // ... more activities
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

#### 7. Get Single Activity
```http
GET /api/activities/:activityId
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "activity": {
      "id": "uuid",
      "slug": "word-detective",
      "title": "Word Detective 🔍",
      "description": "Find hidden words in colorful pictures",
      "category": "reading",
      "difficulty": "Easy",
      "durationSeconds": 600,
      "emoji": "🔍",
      "thumbnailUrl": "https://...",
      "instructions": "Look carefully at the picture...",
      "contentData": {
        "words": ["cat", "dog", "tree"],
        "imageUrl": "https://..."
      }
    }
  }
}
```

#### 8. Start Activity
```http
POST /api/activities/:activityId/start
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "studentId": "uuid"
}

Response (201):
{
  "success": true,
  "data": {
    "completion": {
      "id": "uuid",
      "activityId": "uuid",
      "studentId": "uuid",
      "startedAt": "2025-10-25T10:00:00Z",
      "isCompleted": false
    }
  }
}
```

#### 9. Complete Activity
```http
POST /api/activities/:activityId/complete
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "completionId": "uuid",
  "studentId": "uuid",
  "durationSeconds": 580,
  "score": 95,
  "accuracyPercentage": 95.5,
  "starsEarned": 3,
  "performanceData": {
    "correctAnswers": 19,
    "totalQuestions": 20,
    "timePerQuestion": [25, 30, 22, ...]
  }
}

Response (200):
{
  "success": true,
  "data": {
    "completion": {
      "id": "uuid",
      "activityId": "uuid",
      "studentId": "uuid",
      "startedAt": "2025-10-25T10:00:00Z",
      "completedAt": "2025-10-25T10:09:40Z",
      "durationSeconds": 580,
      "score": 95,
      "accuracyPercentage": 95.5,
      "starsEarned": 3,
      "isCompleted": true
    },
    "achievements": [
      {
        "id": "uuid",
        "name": "Reading Star",
        "description": "Completed 10 reading activities",
        "icon": "🏆"
      }
    ],
    "streakUpdated": {
      "currentStreak": 8,
      "longestStreak": 10
    }
  }
}
```

---

### Games

#### 10. Get All Games
```http
GET /api/games?category=ADHD&difficulty=medium&page=1&limit=20
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "games": [
      {
        "id": "uuid",
        "slug": "signal-sprinter",
        "type": "cpt",
        "title": "Signal Sprinter 🏃‍♂️",
        "description": "Press spacebar when you see the green circle",
        "category": "ADHD",
        "difficulty": "medium",
        "durationSeconds": 300,
        "thumbnailUrl": "https://...",
        "animalMascot": "cheetah",
        "colorTheme": "bg-green-100"
      }
      // ... more games
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

#### 11. Get Single Game
```http
GET /api/games/:gameId
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "game": {
      "id": "uuid",
      "slug": "signal-sprinter",
      "type": "cpt",
      "title": "Signal Sprinter 🏃‍♂️",
      "description": "Press spacebar when you see the green circle",
      "category": "ADHD",
      "difficulty": "medium",
      "durationSeconds": 300,
      "gameConfig": {
        "targetShape": "green-circle",
        "distractorShapes": ["red-square", "blue-triangle"],
        "shapeDuration": 250
      },
      "scoringRules": {
        "pointsPerCorrect": 10,
        "penaltyPerError": -5
      }
    }
  }
}
```

#### 12. Start Game Session
```http
POST /api/games/:gameId/start
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "studentId": "uuid"
}

Response (201):
{
  "success": true,
  "data": {
    "session": {
      "id": "uuid",
      "gameId": "uuid",
      "studentId": "uuid",
      "startedAt": "2025-10-25T10:15:00Z",
      "isCompleted": false
    }
  }
}
```

#### 13. Save Game Progress
```http
PATCH /api/games/:gameId/sessions/:sessionId
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "events": [
    {
      "type": "click",
      "shapeType": "green-circle",
      "scoreDelta": 10,
      "atMs": 1200,
      "isCorrect": true
    }
  ],
  "currentScore": 50,
  "phaseReached": 2
}

Response (200):
{
  "success": true,
  "message": "Progress saved"
}
```

#### 14. Complete Game Session
```http
POST /api/games/:gameId/complete
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "sessionId": "uuid",
  "studentId": "uuid",
  "durationSeconds": 295,
  "finalScore": 180,
  "phaseReached": 3,
  "events": [...],
  "parameters": {
    "omissionErrors": 2,
    "commissionErrors": 1,
    "meanReactionTime": 245,
    "reactionTimeVariability": 35
  }
}

Response (200):
{
  "success": true,
  "data": {
    "session": {
      "id": "uuid",
      "gameId": "uuid",
      "studentId": "uuid",
      "startedAt": "2025-10-25T10:15:00Z",
      "endedAt": "2025-10-25T10:20:00Z",
      "finalScore": 180,
      "isCompleted": true
    },
    "achievements": [...],
    "personalBest": true
  }
}
```

---

### Student Progress

#### 15. Get Student Dashboard
```http
GET /api/students/:studentId/dashboard
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "student": {
      "id": "uuid",
      "fullName": "Alex Smith",
      "profilePictureUrl": "https://...",
      "currentStreakDays": 7,
      "longestStreakDays": 15,
      "totalActivitiesCompleted": 45,
      "totalTimeSpentSeconds": 54000
    },
    "todayProgress": {
      "activitiesCompleted": 3,
      "targetActivities": 5,
      "percentageComplete": 60,
      "timeSpentSeconds": 1800
    },
    "todaysActivities": [
      {
        "id": "uuid",
        "title": "Word Detective 🔍",
        "category": "reading",
        "durationSeconds": 600,
        "difficulty": "Easy",
        "completed": false
      }
      // ... more activities
    ],
    "recentAchievements": [
      {
        "id": "uuid",
        "name": "7-Day Streak",
        "icon": "🔥",
        "unlockedAt": "2025-10-25T09:00:00Z"
      }
    ]
  }
}
```

#### 16. Get Student Progress Overview
```http
GET /api/students/:studentId/progress?startDate=2025-10-01&endDate=2025-10-31
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "summary": {
      "totalActivitiesCompleted": 45,
      "totalGamesPlayed": 30,
      "totalTimeSpentSeconds": 54000,
      "averageScore": 87.5,
      "averageAccuracy": 92.3
    },
    "categoryBreakdown": {
      "reading": {
        "activitiesCompleted": 15,
        "averageScore": 90,
        "timeSpentSeconds": 18000
      },
      "math": {
        "activitiesCompleted": 12,
        "averageScore": 85,
        "timeSpentSeconds": 14400
      }
      // ... more categories
    },
    "weeklyProgress": [
      {
        "week": "2025-W43",
        "activitiesCompleted": 10,
        "averageScore": 88,
        "timeSpentSeconds": 12000
      }
      // ... more weeks
    ],
    "skillProgress": {
      "reading": {
        "level": 3,
        "progress": 65,
        "trend": "improving"
      },
      "math": {
        "level": 2,
        "progress": 80,
        "trend": "stable"
      }
      // ... more skills
    }
  }
}
```

#### 17. Get Activity History
```http
GET /api/students/:studentId/activity-history?page=1&limit=20
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "completions": [
      {
        "id": "uuid",
        "activity": {
          "id": "uuid",
          "title": "Word Detective 🔍",
          "category": "reading"
        },
        "completedAt": "2025-10-25T10:09:40Z",
        "durationSeconds": 580,
        "score": 95,
        "accuracyPercentage": 95.5,
        "starsEarned": 3
      }
      // ... more completions
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

#### 18. Get Game History
```http
GET /api/students/:studentId/game-history?page=1&limit=20
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "uuid",
        "game": {
          "id": "uuid",
          "title": "Signal Sprinter 🏃‍♂️",
          "type": "cpt"
        },
        "endedAt": "2025-10-25T10:20:00Z",
        "durationSeconds": 295,
        "finalScore": 180,
        "parameters": {
          "omissionErrors": 2,
          "commissionErrors": 1,
          "meanReactionTime": 245
        }
      }
      // ... more sessions
    ],
    "pagination": {...}
  }
}
```

#### 19. Get Achievements
```http
GET /api/students/:studentId/achievements
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "unlocked": [
      {
        "id": "uuid",
        "name": "Reading Star",
        "description": "Completed 10 reading activities",
        "icon": "🏆",
        "category": "completion",
        "unlockedAt": "2025-10-20T12:00:00Z"
      }
      // ... more unlocked achievements
    ],
    "locked": [
      {
        "id": "uuid",
        "name": "Math Master",
        "description": "Complete 20 math activities",
        "icon": "🧮",
        "category": "completion",
        "progress": 60,
        "requirement": 20
      }
      // ... more locked achievements
    ]
  }
}
```

---

### Parent Features

#### 20. Get Parent Dashboard
```http
GET /api/parents/:parentId/dashboard
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "children": [
      {
        "id": "uuid",
        "fullName": "Alex Smith",
        "profilePictureUrl": "https://...",
        "gradeLevel": "Grade 3",
        "conditions": ["ADHD", "Dyslexia"],
        "currentStreak": 7,
        "weeklyProgress": {
          "activitiesCompleted": 10,
          "timeSpentSeconds": 12000,
          "averageScore": 88
        }
      }
      // ... more children
    ],
    "upcomingActivities": [...],
    "recentMessages": [...]
  }
}
```

#### 21. Get Child Progress Report
```http
GET /api/parents/:parentId/children/:studentId/report?type=monthly&startDate=2025-10-01&endDate=2025-10-31
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "report": {
      "id": "uuid",
      "student": {...},
      "periodStart": "2025-10-01",
      "periodEnd": "2025-10-31",
      "summary": {
        "totalActivities": 45,
        "totalTimeSpent": "15 hours",
        "averageScore": 87.5,
        "streakDays": 7,
        "improvementAreas": ["Math", "Focus"],
        "strengths": ["Reading", "Memory"]
      },
      "categoryPerformance": {...},
      "recommendations": "Focus on math activities...",
      "pdfUrl": "https://..."
    }
  }
}
```

#### 22. Link Child to Parent
```http
POST /api/parents/:parentId/children
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "childEmail": "child@example.com",
  "pin": "1234"
}

Response (200):
{
  "success": true,
  "data": {
    "student": {...}
  }
}
```

---

### Teacher Features

#### 23. Get Teacher Dashboard
```http
GET /api/teachers/:teacherId/dashboard
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "classrooms": [
      {
        "id": "uuid",
        "name": "Grade 3A",
        "gradeLevel": "Grade 3",
        "studentCount": 25,
        "activeAssignments": 5
      }
      // ... more classrooms
    ],
    "recentActivity": [...],
    "pendingReviews": [...]
  }
}
```

#### 24. Create Classroom
```http
POST /api/teachers/:teacherId/classrooms
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "name": "Grade 3A",
  "description": "Morning class",
  "gradeLevel": "Grade 3",
  "schoolYear": "2025-2026"
}

Response (201):
{
  "success": true,
  "data": {
    "classroom": {
      "id": "uuid",
      "teacherId": "uuid",
      "name": "Grade 3A",
      "gradeLevel": "Grade 3",
      "schoolYear": "2025-2026",
      "isActive": true,
      "createdAt": "2025-10-25T10:00:00Z"
    }
  }
}
```

#### 25. Get Classroom Details
```http
GET /api/classrooms/:classroomId
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "classroom": {
      "id": "uuid",
      "name": "Grade 3A",
      "gradeLevel": "Grade 3",
      "studentCount": 25,
      "teacher": {
        "id": "uuid",
        "fullName": "Ms. Johnson"
      }
    },
    "students": [
      {
        "id": "uuid",
        "fullName": "Alex Smith",
        "profilePictureUrl": "https://...",
        "conditions": ["ADHD"],
        "enrolledAt": "2025-09-01T00:00:00Z",
        "weeklyProgress": {...}
      }
      // ... more students
    ]
  }
}
```

#### 26. Add Student to Classroom
```http
POST /api/classrooms/:classroomId/students
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "studentId": "uuid"
}

Response (200):
{
  "success": true,
  "message": "Student added to classroom"
}
```

#### 27. Remove Student from Classroom
```http
DELETE /api/classrooms/:classroomId/students/:studentId
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Student removed from classroom"
}
```

#### 28. Create Assignment
```http
POST /api/assignments
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "teacherId": "uuid",
  "classroomId": "uuid",
  "title": "Reading Practice Week 1",
  "description": "Complete 3 reading activities",
  "activityId": "uuid", // OR gameId
  "dueDate": "2025-10-30T23:59:59Z"
}

Response (201):
{
  "success": true,
  "data": {
    "assignment": {
      "id": "uuid",
      "title": "Reading Practice Week 1",
      "dueDate": "2025-10-30T23:59:59Z",
      "assignedStudents": 25,
      "completedCount": 0
    }
  }
}
```

#### 29. Get Assignment Progress
```http
GET /api/assignments/:assignmentId/progress
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "assignment": {
      "id": "uuid",
      "title": "Reading Practice Week 1",
      "dueDate": "2025-10-30T23:59:59Z"
    },
    "progress": {
      "totalStudents": 25,
      "completed": 15,
      "inProgress": 5,
      "notStarted": 5,
      "averageScore": 85.5
    },
    "studentProgress": [
      {
        "student": {
          "id": "uuid",
          "fullName": "Alex Smith"
        },
        "status": "completed",
        "completedAt": "2025-10-26T14:30:00Z",
        "score": 95
      }
      // ... more students
    ]
  }
}
```

#### 30. Get Classroom Analytics
```http
GET /api/classrooms/:classroomId/analytics?startDate=2025-10-01&endDate=2025-10-31
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "overall": {
      "averageScore": 85.5,
      "totalActivitiesCompleted": 450,
      "totalTimeSpentSeconds": 540000,
      "engagementRate": 92.5
    },
    "categoryPerformance": {
      "reading": {
        "averageScore": 88,
        "completionRate": 95
      }
      // ... more categories
    },
    "topPerformers": [...],
    "studentsNeedingHelp": [
      {
        "student": {...},
        "concernAreas": ["Math", "Focus"],
        "averageScore": 65
      }
    ]
  }
}
```

---

### Communication

#### 31. Send Message
```http
POST /api/messages
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "recipientId": "uuid",
  "subject": "Progress Update",
  "message": "Your child is doing great...",
  "parentMessageId": null // For replies
}

Response (201):
{
  "success": true,
  "data": {
    "message": {
      "id": "uuid",
      "sender": {...},
      "recipient": {...},
      "subject": "Progress Update",
      "message": "Your child is doing great...",
      "createdAt": "2025-10-25T10:30:00Z"
    }
  }
}
```

#### 32. Get Messages (Inbox)
```http
GET /api/messages/inbox?page=1&limit=20&unreadOnly=false
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "uuid",
        "sender": {
          "id": "uuid",
          "fullName": "Ms. Johnson",
          "role": "teacher"
        },
        "subject": "Progress Update",
        "message": "Your child is doing great...",
        "isRead": false,
        "createdAt": "2025-10-25T10:30:00Z"
      }
      // ... more messages
    ],
    "pagination": {...}
  }
}
```

#### 33. Get Sent Messages
```http
GET /api/messages/sent?page=1&limit=20
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "messages": [...],
    "pagination": {...}
  }
}
```

#### 34. Mark Message as Read
```http
PATCH /api/messages/:messageId/read
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Message marked as read"
}
```

#### 35. Get Message Thread
```http
GET /api/messages/:messageId/thread
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "uuid",
        "sender": {...},
        "message": "Original message...",
        "createdAt": "2025-10-25T10:30:00Z"
      },
      {
        "id": "uuid",
        "sender": {...},
        "message": "Reply...",
        "createdAt": "2025-10-25T11:00:00Z"
      }
    ]
  }
}
```

---

### Assessments

#### 36. Create Assessment
```http
POST /api/assessments
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "studentId": "uuid",
  "assessmentType": "initial",
  "responses": {
    "question1": "answer1",
    "question2": "answer2"
  },
  "scores": {
    "reading": 85,
    "math": 78,
    "focus": 92
  },
  "overallScore": 85,
  "notes": "Shows strong focus abilities...",
  "recommendations": "Continue with reading exercises..."
}

Response (201):
{
  "success": true,
  "data": {
    "assessment": {
      "id": "uuid",
      "studentId": "uuid",
      "assessmentType": "initial",
      "overallScore": 85,
      "createdAt": "2025-10-25T10:00:00Z"
    }
  }
}
```

#### 37. Get Student Assessments
```http
GET /api/students/:studentId/assessments
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "assessments": [
      {
        "id": "uuid",
        "assessmentType": "initial",
        "overallScore": 85,
        "assessedBy": {
          "id": "uuid",
          "fullName": "Ms. Johnson"
        },
        "createdAt": "2025-10-01T10:00:00Z"
      }
      // ... more assessments
    ]
  }
}
```

---

### Analytics & Reports

#### 38. Get Platform Statistics (Admin)
```http
GET /api/admin/statistics
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "users": {
      "total": 1000,
      "children": 600,
      "parents": 300,
      "teachers": 100,
      "activeToday": 450
    },
    "activities": {
      "totalCompleted": 50000,
      "todayCompleted": 1200,
      "averageCompletionTime": 420
    },
    "engagement": {
      "dailyActiveUsers": 450,
      "averageSessionDuration": 1800,
      "retentionRate": 85.5
    }
  }
}
```

#### 39. Export Data
```http
POST /api/reports/export
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "type": "student-progress",
  "studentId": "uuid",
  "startDate": "2025-10-01",
  "endDate": "2025-10-31",
  "format": "pdf" // or "csv", "xlsx"
}

Response (200):
{
  "success": true,
  "data": {
    "downloadUrl": "https://..."
  }
}
```

---

## Authentication

### JWT Token Structure
```javascript
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "parent",
  "iat": 1698234567,
  "exp": 1698320967
}
```

### Headers Required
```http
Authorization: Bearer {jwt-token}
Content-Type: application/json
```

### Token Expiration
- Access Token: 24 hours
- Refresh Token: 30 days (optional implementation)

---

## Real-time Features

### WebSocket Events (Optional)

#### Student Events
```javascript
// Student starts activity
socket.emit('activity:start', {
  studentId: 'uuid',
  activityId: 'uuid'
})

// Student completes activity
socket.emit('activity:complete', {
  studentId: 'uuid',
  activityId: 'uuid',
  score: 95
})

// Receive achievement
socket.on('achievement:unlocked', (data) => {
  // Show achievement notification
})
```

#### Parent/Teacher Events
```javascript
// Listen for child progress updates
socket.on('student:progress', (data) => {
  // Update dashboard
})

// New message received
socket.on('message:new', (data) => {
  // Show notification
})
```

---

## Environment Variables

```bash
# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/learnable_db
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis (for caching/sessions)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=30d

# AWS S3 (for file storage)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=learnable-files

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@learnable.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

# Analytics (optional)
GOOGLE_ANALYTICS_ID=
MIXPANEL_TOKEN=
```

---

## Data Models (TypeScript Interfaces)

### User
```typescript
interface User {
  id: string;
  email: string;
  passwordHash?: string;
  role: 'child' | 'parent' | 'teacher';
  fullName: string;
  profilePictureUrl?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  
  // Role-specific
  pin?: string;
  parentEmail?: string;
  schoolName?: string;
}
```

### Student
```typescript
interface Student {
  id: string;
  userId: string;
  parentId?: string;
  teacherId?: string;
  
  dateOfBirth?: Date;
  gradeLevel?: string;
  conditions: string[];
  
  preferredAnimalMascot?: string;
  learningPreferences?: Record<string, any>;
  accessibilitySettings?: Record<string, any>;
  
  totalActivitiesCompleted: number;
  totalTimeSpentSeconds: number;
  currentStreakDays: number;
  longestStreakDays: number;
  
  createdAt: Date;
  updatedAt: Date;
}
```

### Activity
```typescript
interface Activity {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  durationSeconds: number;
  emoji?: string;
  thumbnailUrl?: string;
  targetConditions: string[];
  ageRange?: { min: number; max: number };
  instructions?: string;
  contentData?: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Game
```typescript
interface Game {
  id: string;
  slug: string;
  type: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  durationSeconds: number;
  thumbnailUrl?: string;
  animalMascot?: string;
  colorTheme?: string;
  maxPlayers: number;
  gameConfig?: Record<string, any>;
  scoringRules?: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### ActivityCompletion
```typescript
interface ActivityCompletion {
  id: string;
  studentId: string;
  activityId: string;
  startedAt: Date;
  completedAt?: Date;
  durationSeconds?: number;
  score?: number;
  accuracyPercentage?: number;
  starsEarned?: number;
  performanceData?: Record<string, any>;
  isCompleted: boolean;
  createdAt: Date;
}
```

### GameSession
```typescript
interface GameSession {
  id: string;
  studentId: string;
  gameId: string;
  startedAt: Date;
  endedAt?: Date;
  durationSeconds?: number;
  finalScore?: number;
  phaseReached?: number;
  events?: Array<{
    type: string;
    [key: string]: any;
  }>;
  parameters?: Record<string, any>;
  isCompleted: boolean;
  createdAt: Date;
}
```

---

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Additional Features to Implement

### 1. Notifications
```http
GET /api/notifications
POST /api/notifications/mark-read
```

### 2. Settings
```http
GET /api/users/:userId/settings
PATCH /api/users/:userId/settings
```

### 3. Leaderboards
```http
GET /api/leaderboards?type=weekly&category=reading
```

### 4. Activity Recommendations
```http
GET /api/students/:studentId/recommendations
```

### 5. Parent Controls
```http
POST /api/parents/:parentId/set-time-limits
GET /api/parents/:parentId/activity-approvals
```

---

## Security Considerations

1. **Password Hashing**: Use bcrypt with salt rounds >= 10
2. **Rate Limiting**: Implement per-endpoint rate limits
3. **Input Validation**: Validate all inputs using schemas (Joi/Zod)
4. **SQL Injection Prevention**: Use parameterized queries
5. **XSS Protection**: Sanitize all user inputs
6. **CORS**: Configure appropriate CORS policies
7. **HTTPS**: Enforce HTTPS in production
8. **Data Privacy**: COPPA/GDPR compliance for children's data

---

## Testing Strategy

1. **Unit Tests**: Test individual functions
2. **Integration Tests**: Test API endpoints
3. **E2E Tests**: Test complete user flows
4. **Load Tests**: Test performance under load
5. **Security Tests**: Penetration testing

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates installed
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Monitoring set up (e.g., Sentry)
- [ ] Backup strategy in place
- [ ] Load balancer configured (if needed)
- [ ] CDN for static assets

---

## API Versioning

Current version: `v1`

Base URL: `https://api.learnable.com/v1`

Future versions will maintain backward compatibility or provide migration paths.

---

**Last Updated**: October 25, 2025
**Version**: 1.0.0
