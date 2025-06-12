# 🧠 SmartHelp Desk Backend

This is the backend API for the SmartHelp Desk system, built with **Express.js + MongoDB**.

## ✅ Current Stage

**Stage 1: Complete CRUD Ticket API**
- [x] Create Ticket (`POST /api/tickets`)
- [x] Get All Tickets (`GET /api/tickets`)
- [x] Update Ticket (`PUT /api/tickets/:id`)
- [x] Delete Ticket (`DELETE /api/tickets/:id`)

## 📁 Folder Structure

backend/
├── controllers/
│ └── ticketController.js
├── models/
│ └── Ticket.js
├── routes/
│ └── ticketRoutes.js
├── server.js
├── .env
├── .gitignore
└── README.md

## ⚙️ Environment Variables

Create a `.env` file: MONGODB_URI="mongodb+srv://firdaussulaiman:122868Murni@cluster0.buyergk.mongodb.net/smarthelpdesk?retryWrites=true&w=majority"


## 🚀 Run Locally

```bash
npm install
npm run dev
ext Stage (Coming Up): Microsoft Entra ID Auth
sql
Copy
Edit

Then push it:
```bash
git add README.md
git commit -m "📝 Add project README for Stage 1"
git push