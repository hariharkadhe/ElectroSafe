# Firebase Setup Guide

Follow these steps to connect your project to a real Firebase database.

## 1. Create a Firebase Project
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **"Add project"** (or "Create a project").
3.  Name your project (e.g., `electricity-cms`).
4.  Disable Google Analytics (optional, makes setup faster) and click **"Create project"**.
5.  Wait for it to finish and click **"Continue"**.

## 2. Set up Firestore Database
1.  In the left sidebar, click **"Build"** -> **"Firestore Database"**.
2.  Click **"Create database"**.
3.  Choose a location (e.g., `nam5 (us-central)` or one close to you).
4.  **Important**: Choose **"Start in Test Mode"** for now (this allows easy read/write access without complex rules initially).
    - *Note: In production, you should switch to Locked Mode and write rules.*
5.  Click **"Create"**.

## 3. Generate Admin Credentials (The Key)
This acts as the password for your backend to talk to the database.

1.  In your Firebase Project dashboard, click the **Gear Icon** (Settings) next to "Project Overview".
2.  Select **"Project settings"**.
3.  Go to the **"Service accounts"** tab.
4.  Click **"Generate new private key"**.
5.  Click **"Generate key"** to confirm.
6.  A file ending in `.json` will download to your computer.

## 4. Connect to Your Project
1.  **Rename** the downloaded file to exactly: `serviceAccountKey.json`
2.  **Move** this file into your project folder:
    - `electricity-cms/server/serviceAccountKey.json`
    
    *Your folder structure should look like this:*
    ```
    electricity-cms/
    ├── server/
    │   ├── config/
    │   ├── routes/
    │   ├── server.js
    │   └── serviceAccountKey.json  <-- Place it here
    ├── public/
    ├── package.json
    └── ...
    ```

## 5. Configure Environment
1.  In the `electricity-cms/` folder, create a file named `.env`.
2.  Add the following line to it:
    ```
    GOOGLE_APPLICATION_CREDENTIALS="./server/serviceAccountKey.json"
    ```

## 6. Restart Server
1.  Stop the server if it's running (Ctrl+C).
2.  Start it again:
    ```bash
    npm start
    ```
3.  You should see the message: `Firebase Admin Initialized`.

**Done!** Your app is now connected to the real database.
