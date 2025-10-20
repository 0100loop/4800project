

Overview
We’re building ParkIt, a platform to connect event-goers with nearby residents who can rent out their driveways or yards for affordable parking.

Team name
Team 0100 Loop

Idea
Provide a simple web app for users to reserve cheaper, convenient parking near event venues, while giving locals an opportunity to earn extra income.

Dev stack
We’re using the MERN stack (MongoDB, Express, React, Node.js).

\## Design

Figma wireframes (Landing + Goal): https://www.figma.com/make/MaPtvdv2LPKOJuxtqFcLSr/ParkIt-App-UI-Design?node-id=0-1&t=PyQPvp8dNtbpqzjS-1


# Clone repo
git clone https://github.com/0100loop/4800project.git
cd 4800project

# Backend
cd server
cp ../.env.example .env
npm install
npm run seed
npm run dev   # http://localhost:5000/api/health

# Frontend
cd ../client
npm install
npm run dev   # open http://localhost:5173



>>>>>>> feat/first-api
