// public/service-worker.js

self.addEventListener('push', function (event) {
    const data = event.data.json();
    const options = {
      body: data.message,
      icon: '/vite.svg', // Path to your notification icon
      badge: '/vite.svg', // Path to your notification badge
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  
  self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
      clients.openWindow('/') // Open the app when the notification is clicked
    );
  });
  