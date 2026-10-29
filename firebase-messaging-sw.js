// Service worker för pushnotiser (Firebase Cloud Messaging).
// Ska ligga i SAMMA mapp som index.html i GitHub-repot (alvsjo-tour/).
// Tar emot notiser när appen är stängd eller i bakgrunden och visar dem.
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCnLVk8kqPvw51Q_ebz1ywbobyvSyiBdro",
  authDomain: "tourapp-187b1.firebaseapp.com",
  projectId: "tourapp-187b1",
  storageBucket: "tourapp-187b1.firebasestorage.app",
  messagingSenderId: "734893897025",
  appId: "1:734893897025:web:5a710855184a36c2689dc0"
});

// Servern skickar notiser med "notification"-del + länk (fcmOptions.link),
// så FCM visar dem automatiskt. Här behövs bara initieringen ovan.
var messaging = firebase.messaging();

// Klick på notisen: fokusera en öppen flik med appen, annars öppna den.
self.addEventListener('notificationclick', function(event) {
  var link = (event.notification && event.notification.data && (event.notification.data.link ||
             (event.notification.data.FCM_MSG && event.notification.data.FCM_MSG.fcmOptions && event.notification.data.FCM_MSG.fcmOptions.link))) || './';
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].url.indexOf('alvsjo-tour') >= 0 && 'focus' in list[i]) return list[i].focus();
    }
    return clients.openWindow ? clients.openWindow(link) : null;
  }));
});

self.addEventListener('install', function() { self.skipWaiting(); });
self.addEventListener('activate', function(e) { e.waitUntil(self.clients.claim()); });
