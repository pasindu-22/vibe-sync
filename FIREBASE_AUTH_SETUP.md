# Firebase Authentication Setup Guide for VibeSync

This guide outlines how to set up Firebase Authentication for VibeSync project.

## Prerequisites

1. A Firebase project created in the [Firebase Console](https://console.firebase.google.com/)
2. Node.js installed locally

## Firebase Setup Steps

### 1. Create a Firebase Project (if you haven't already)

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Follow the setup wizard to create your project
4. Enable the authentication methods you want to use (Google, Facebook, Email/Password, etc.)

### 2. Configure Frontend Firebase

1. In the Firebase Console, go to Project Settings
2. Under "Your apps", create a web app if you haven't already
3. Copy the Firebase configuration

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."
};
```

4. Create a `.env.local` file in the `/frontend` directory with the following format:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   ```

5. Paste your Firebase configuration values into the environment variables (don't use quotes around values)

### 3. Configure Backend Firebase Admin

1. In the Firebase Console, go to Project Settings > Service accounts
2. Click "Generate new private key"
3. Save the JSON file securely
4. Create a `.env` file in the `/backend` directory using the `.env.example` template
5. Fill in the Firebase Admin SDK details from the downloaded JSON file

### 4. Install Dependencies

Frontend:
```bash
cd frontend
npm install firebase react-hot-toast
```

Backend:
```bash
cd backend
pip install -r requirements.txt
```

## Authentication Flow

1. The frontend uses Firebase client SDK for authentication
2. When a user signs in, Firebase issues a token
3. This token is sent to the backend in API requests
4. The backend verifies the token using Firebase Admin SDK

## Supported Authentication Methods

- Email/Password
- Google
- Facebook
- Apple

## Protected Routes

- Frontend: Protected routes are handled via the AuthContext
- Backend: Protected endpoints use the `get_current_user` dependency

## Troubleshooting

### Backend Firebase Admin Issues

1. If you encounter `ModuleNotFoundError: No module named 'firebase_admin'`:
   ```bash
   cd backend
   pip install firebase-admin
   ```

2. If you get "Failed to initialize a certificate credential" error:
   - Ensure your Firebase service account JSON file is properly formatted
   - Place the service account JSON file in the `/backend` directory as one of:
     - `firebase-service-account.json`
     - `service-account.json`
     - `firebase-credentials.json`
   - Or set the environment variables correctly in `.env`

3. For development/testing without a Firebase project:
   - The backend includes a mock implementation that will be used if no valid credentials are found
   - This is suitable for development but should not be used in production

### Frontend Firebase Issues

1. If you see `FirebaseError: Firebase: Error (auth/invalid-api-key)`:
   - Check that your `.env.local` file has proper format with `KEY=VALUE` (no quotes around values)
   - Verify that the API key is correct in Firebase Console

2. If social login redirects fail:
   - Configure authorized domains in Firebase Console under Authentication > Settings > Authorized Domains
