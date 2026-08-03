# Electricity Complaint Management System

## Setup Instructions

### 1. Prerequisites
- **Node.js** installed on your computer.
- **Firebase Account** (for saving data to the cloud).

### 2. Installation
1. Navigate to the project folder in your terminal:
   ```bash
   cd electricity-cms
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```

### 3. Firebase Configuration (CRITICAL)
To make the database work, you need to connect your Firebase project:
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Create a new project.
3.  Go to **Project Settings** (Gear icon) -> **Service accounts**.
4.  Click **Generate new private key**.
5.  A JSON file will download. **Rename it** to `serviceAccountKey.json`.
6.  **Move/Copy this file** into the `electricity-cms/server/` folder.
    - *Note: If you skip this, the app will use a temporary in-memory database and data will be lost on restart.*

### 4. Running the Project
1.  Start the backend server:
    ```bash
    npm start
    ```
2.  You should see: `Server running on http://localhost:3000` and `Firebase Admin Initialized`.

### 5. Using the App
- **User Portal**: Open `http://localhost:3000` in your browser.
    - **Register**: File a new complaint with details and photo.
    - **Track**: Use the returned Complaint ID (e.g., `CMS-1234`) to check status.
    - **Receipt**: Download a PDF receipt after submission.
    - **Settings**: Toggle Dark Mode (Moon icon) or Language (En/Hi) using the floating buttons.
- **Admin Panel**: Open `http://localhost:3000/admin.html`.
    - View all complaints.
    - Update status (Pending -> Resolved).
    - Assign technicians.

### Project Structure
- `public/`: Frontend (HTML, CSS, JS).
- `server/`: Backend (Node.js, Express).
- `server/config/firebase.js`: Firebase connection logic.
