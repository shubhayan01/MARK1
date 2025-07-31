# MARK1 - Business Automation Dashboard

MARK1 is a web-based automation dashboard designed to streamline business operations using customizable workflows and intuitive UI. Built for early-stage service businesses, it simplifies repetitive tasks like lead follow-up, booking automation, reminders, and customer lifecycle communication.

  Features

 **Lead Management** – Capture, manage, and follow up on leads automatically.
   **Booking Automation** – Seamlessly schedule and confirm appointments.
   **Smart Messaging** – Automated follow-ups and reminders via WhatsApp/Email.
   **Dashboard View** – Visual overview of key operations and active workflows.
   **Workflow Builder** – Modular backend powered by [n8n.io](https://n8n.io) or custom logic.
   **Multi-Client Ready** – Architecture supports independent flows for different clients.

## ⚙️ Tech Stack

| Frontend        | Backend / Automation | Deployment         |
|-----------------|----------------------|--------------------|
| React + Tailwind| Node.js + n8n (or alt.) | Vercel + Render     |

## 📁 Project Structure


MARK1/
├── public/
├── src/
│ ├── assets/
│ ├── components/
│ ├── pages/
│ ├── utils/
│ └── App.jsx
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md

bash
Copy
Edit

## 🚀 How to Run Locally

```bash
git clone https://github.com/shubhayan01/MARK1.git
cd MARK1
npm install
npm run dev
