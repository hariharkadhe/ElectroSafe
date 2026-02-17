const admin = require('firebase-admin');
const dotenv = require('dotenv');
// var serviceAccount = require("../serviceAccountKey.json");

dotenv.config();

let db;

try {
    // Check if we are in production or have a service account
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        admin.initializeApp({
            credential: admin.credential.applicationDefault()
        });
    } else {
        // Fallback for local dev if user hasn't set up credentials yet
        // This allows the app to start but will fail on DB calls if not configured
        console.warn("WARNING: Firebase Credentials not found. DB calls will fail.");
        // Initialize with mock/no-op if you wanted, but for "Real Firebase" request we assume they want it to work with real credentials.
        // admin.initializeApp(); // This might error without args
    }

    db = admin.firestore();
    console.log("Firebase Admin Initialized");
} catch (error) {
    console.error("Firebase Initialization Error:", error.message);
}

module.exports = { admin, db };
