# ElectroSafe
"A Village Electricity Grievance Portal that empowers citizens to report power issues, track status in real-time, and get fast resolutions from the department."

# ElectroSafe ⚡
**ElectroSafe** is a Village Electricity Grievance Portal designed to bridge the gap between rural citizens and the electricity department. It empowers villagers to register complaints instantly, track their status, and receive updates, while providing administrators with tools to manage and resolve issues efficiently.

## Features
*   **🔌 Complaint Registration:** Easy-to-use form for reporting power cuts, transformer damage, theft, and more.
*   **🕵️ Anonymous Reporting:** Safe channel for reporting electricity theft or illegal connections.
*   **📊 Live Tracking:** Track complaint status in real-time using a unique Complaint ID.
*   **📱 WhatsApp Integration:** Direct link to chat with the department for urgent queries.
*   **📧 Email Notifications:** Automated email alerts to the department whenever a new complaint is filed.
*   **🔐 Admin Panel:** Secure dashboard for officials to view, update, and resolve complaints.
*   **🌍 Multi-language Support:** Full support for **English** and **Hindi** to ensure accessibility for all villagers.
*   **🌙 Dark Mode:** User-friendly interface with a toggleable dark mode.

## Tech Stack
*   **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
*   **Backend:** Node.js, Express.js
*   **Database:** Firebase Firestore
*   **Email Service:** Nodemailer
*   **Authentication:** Custom Admin Authentication

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/hariharkadhe/ElectroSafe.git
cd ElectroSafe
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env` file in the root directory and add your credentials:
```env
PORT=3002
GOOGLE_APPLICATION_CREDENTIALS="./server/serviceAccountKey.json"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
ADMIN_EMAIL="admin-email@gmail.com"
```
*Note: You need to place your Firebase `serviceAccountKey.json` in the `server/` folder.*

### 4. Run the application
```bash
npm start
```

### 5. Access the Portal
Open your browser and go to:
`http://localhost:3002`

