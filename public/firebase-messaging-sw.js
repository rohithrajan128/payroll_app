// Load the Firebase App and Messaging modules using CommonJS-style require
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

if (firebase.messaging.isSupported()) {
    // Initialize the Firebase app in the service worker by passing in the
    // messagingSenderId.
    firebase.initializeApp({
        apiKey: "AIzaSyBtad_tWA1hMnib-hdndopIfCBXA1OSj3k",
        authDomain: "agilesuite-5d408.firebaseapp.com",
        projectId: "agilesuite-5d408",
        storageBucket: "agilesuite-5d408.appspot.com",
        messagingSenderId: "481930174523",
        appId: "1:481930174523:web:691a96d44b3ce674977c1e",
        measurementId: "G-BNN0DFM73S"
    });

    // Retrieve an instance of Firebase Messaging so that it can handle background messages.
    const messaging = firebase.messaging();
    messaging.onBackgroundMessage((payload) => {
        // Customize notification here
        // const notificationTitle = 'Background Message Title';
        // const notificationOptions = {
        //   body: 'Background Message body.',
        //   icon: '/firebase-logo.png'
        // };
      
        self.registration.showNotification(notificationTitle, notificationOptions);
    });
}
