import { useEffect, useState } from "react";
import "./NotificationSettings.css";

const NotificationSettings = () => {
  const [notificationState, setNotificationState] = useState("Request");

  const updateStateFromBrowser = () => {
    const savedPreference = localStorage.getItem("notificationPreference");

    // Always sync with actual browser permission first
    if (Notification.permission === "granted") {
      setNotificationState("Granted");
      // Update localStorage if it's out of sync
      if (savedPreference !== "granted") {
        localStorage.setItem("notificationPreference", "granted");
      }
    } else if (Notification.permission === "denied") {
      setNotificationState("Denied");
      // Update localStorage if it's out of sync
      if (savedPreference !== "denied") {
        localStorage.setItem("notificationPreference", "denied");
      }
    } else {
      // Permission is "default" - check localStorage preference
      if (savedPreference === "denied") {
        setNotificationState("Denied");
      } else {
        setNotificationState("Request");
      }
    }
  };

  useEffect(() => {
    // Initial state check
    updateStateFromBrowser();

    // Listen for page focus to catch permission changes made in browser settings
    const handleFocus = () => {
      updateStateFromBrowser();
    };

    // Listen for visibility change (when user switches tabs and comes back)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateStateFromBrowser();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup event listeners
    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleToggleNotifications = async () => {
    if (notificationState === "Request") {
      try {
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
          setNotificationState("Granted");
          localStorage.setItem("notificationPreference", "granted");
        } else if (permission === "denied") {
          setNotificationState("Denied");
          localStorage.setItem("notificationPreference", "denied");
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
        setNotificationState("Denied");
        localStorage.setItem("notificationPreference", "denied");
      }
    } else if (notificationState === "Granted") {
      // User wants to disable notifications (we can't revoke browser permission, only our app preference)
      setNotificationState("Denied");
      localStorage.setItem("notificationPreference", "denied");
    } else if (notificationState === "Denied") {
      // Try to re-request if browser allows it
      if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          setNotificationState("Granted");
          localStorage.setItem("notificationPreference", "granted");
        }
      } else if (Notification.permission === "granted") {
        // Permission was granted in browser settings, just update our preference
        setNotificationState("Granted");
        localStorage.setItem("notificationPreference", "granted");
      }
    }
  };

  const getButtonText = () => {
    switch (notificationState) {
      case "Granted":
        return "Notifications On";
      case "Denied":
        return "Notifications Off";
      default:
        return "Enable Notifications";
    }
  };

  const getButtonClass = () => {
    const baseClass = "notification-toggle";
    switch (notificationState) {
      case "Granted":
        return `${baseClass} notification-toggle--granted`;
      case "Denied":
        return `${baseClass} notification-toggle--denied`;
      default:
        return `${baseClass} notification-toggle--request`;
    }
  };

  return (
    <div className="notification-container">
      <button
        onClick={handleToggleNotifications}
        className={getButtonClass()}
        title={
          notificationState === "Denied" && Notification.permission === "denied"
            ? "Notifications blocked. Please enable them in your browser settings."
            : "Toggle notification permissions"
        }
      >
        {getButtonText()}
      </button>

      {notificationState === "Denied" &&
        Notification.permission === "denied" && (
          <p className="notification-message">Blocked in browser settings</p>
        )}
    </div>
  );
};

export default NotificationSettings;
