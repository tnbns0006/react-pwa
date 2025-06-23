"use client";
import React, { useState, useEffect } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
    // Lấy userId từ localStorage nếu có
    const savedUserId = localStorage.getItem("push_user_id");
    if (savedUserId) setUserId(savedUserId);
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    if (!userId) {
      alert("Please enter your User ID");
      return;
    }
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
    });
    setSubscription(sub);
    // Gửi sub và userId lên server để lưu lại
    await fetch("/api/save-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription: sub, userId }),
    });
  }

  async function unsubscribeFromPush() {
     if (!subscription || !userId) return;
    await subscription.unsubscribe();
    setSubscription(null);
    // Gửi request lên server để xóa sub
    await fetch("/api/save-subscription", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, endpoint: subscription.endpoint }),
    });
    localStorage.removeItem("push_user_id");
    setUserId("");
  }

  async function sendTestNotification() {
    if (subscription && userId && message) {
      // Gửi request lên server để gửi notification cho tất cả user khác
      await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: userId,
          title: "TMS Maintenance",
          message,
        }),
      });
      setMessage("");
    }
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col gap-4">
      <h3 className="text-xl font-bold text-center mb-2">Push Notifications</h3>
      <div className="flex flex-col gap-2 mb-2">
        <input
          type="text"
          placeholder="Enter your name"
          value={userId}
          onChange={(e) => {
            setUserId(e.target.value);
            localStorage.setItem("push_user_id", e.target.value);
          }}
          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      {subscription ? (
        <>
          <p className="text-green-700 text-center">Hi <strong>{userId}</strong>! You are subscribed to push notifications.</p>
          <div className="flex flex-col gap-2 mt-2">
            <button
              onClick={unsubscribeFromPush}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded transition"
            >
              Unsubscribe
            </button>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter notification message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={sendTestNotification}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition"
              >
                Send Test
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-700 text-center">You are not subscribed to push notifications.</p>
          <button
            onClick={subscribeToPush}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition w-full"
          >
            Subscribe
          </button>
        </>
      )}
    </div>
  );
}
