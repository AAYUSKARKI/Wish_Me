import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import persistStore from 'redux-persist/es/persistStore'
import store from './components/Redux/Store.ts'
import './index.css'
import App from './App.tsx'

const publicVapidKey = 'BO1rb4A3Ho2Ct0lPLIhxfeVZO38SiAgE1PQvvhYbWts6lA3W02q7-6bJCy36t6xfNpT9OEQ1pxQvvqfLgLWJLsM'; // Replace with your public VAPID key

// Check for service worker support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const swRegistration = await navigator.serviceWorker.register('/service-worker.js');

      console.log('Service Worker registered:', swRegistration);

      // Subscribe the user
      const subscription = await subscribeUser(swRegistration);

      console.log('User subscribed:', subscription);
    } catch (error) {
      console.error('Service Worker registration or subscription failed:', error);
    }
  });
}

async function subscribeUser(swRegistration: ServiceWorkerRegistration) {
  const subscription = await swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });

  await fetch('/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return subscription;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// Request notification permission
async function requestNotificationPermission() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    } else {
      console.error('Notification permission denied.');
    }
  } else {
    console.error('Notification API not supported.');
  }
}

// Call this function when your app initializes
requestNotificationPermission();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
        <Provider store={store}>
        <PersistGate loading={null} persistor={persistStore(store)}>
        <App/>
        <Toaster/>
        </PersistGate>
      </Provider> 
  </React.StrictMode>,
)