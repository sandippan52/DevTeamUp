# 🚀 DevTeamUp

DevTeamUp is a full-stack team-building platform that helps developers and students find teammates for hackathons, projects, competitions, and other collaborative work.

Users can create teams, manage team members, publish public join requests with required skills, discover teams looking for members, send join requests with a message, and collaborate with accepted team members through team chat.

## 🌐 Live Demo

https://dev-team-up.vercel.app/

---

## ✨ Features

### 👤 Authentication

- User registration and login
- Session-based authentication
- Password hashing using `bcryptjs`
- Persistent sessions using `connect-mongo`
- Login/logout functionality
- Protected application routes

### 👥 Team Management

- Create a team
- Rename a team
- Delete a team
- Add new members
- View accepted team members
- Open team chat

### 📢 Public Team Requests

Team leaders can publicly post requests when they are looking for additional members.

A public request can contain:

- Number of people required
- Required skills
- A message describing what the team is looking for

For example, a team participating in a hackathon can request members with skills such as:

- AI/ML
- Deployment
- Frontend Development
- Backend Development
- UI/UX

### 🤝 Request to Join

Users can browse publicly available team requests and request to join a team.

A user can send a message to the team leader along with the join request.

The team leader can then accept or reject the request.

When accepted, the user becomes a member of the team.

### 📩 Team Invitations

Team leaders can also directly invite developers to join their team.

The invited developer receives the request through the notification system and can accept or decline it.

When accepted, the developer becomes a member of the team.

### 💬 Team Chat

Accepted team members can communicate through their team chat.

The current messaging system uses the traditional HTTP request-response model.

Messages are sent to the backend through API requests, stored in the database, and retrieved through API responses.

> WebSockets and Socket.IO are not currently used in DevTeamUp.

### 🔔 Notifications

Users can receive notifications related to team activity, including:

- Team invitations
- Join requests
- Accepted requests
- Declined requests

### 👤 User Profiles

Users have profiles containing information that helps other developers understand their background and technical skills.

---

## 🛠️ Tech Stack

### Frontend

- React
- Tailwind CSS
- JavaScript
- HTML
- CSS

### Backend

- Node.js
- Express.js
- REST APIs
- `express-session`
- `connect-mongo`
- `bcryptjs`
- CORS

### Database

- MongoDB
- MongoDB Atlas

### Deployment

- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

---

## 🏗️ Architecture

DevTeamUp follows a client-server architecture where the React frontend communicates with the Node.js/Express backend through HTTP requests.

```text
┌─────────────────────────┐
│      React Frontend     │
│       Tailwind CSS      │
└────────────┬────────────┘
             │
             │ HTTP Requests
             ▼
┌─────────────────────────┐
│     Node + Express      │
│                         │
│  Authentication         │
│  Team Management        │
│  Join Requests          │
│  Invitations            │
│  Notifications          │
│  Messaging              │
└────────────┬────────────┘
             │
             │ Database Operations
             ▼
┌─────────────────────────┐
│      MongoDB Atlas      │
│                         │
│ Users                   │
│ Teams                   │
│ Requests                │
│ Messages                │
│ Notifications           │
│ Sessions                │
└─────────────────────────┘









