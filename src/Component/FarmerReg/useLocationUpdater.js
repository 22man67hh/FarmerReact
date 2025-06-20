import { useEffect } from "react";

const useLocationUpdater = (isLoggedIn, jwt) => {
  useEffect(() => {
    if (!isLoggedIn || !jwt|| !navigator.geolocation) return;

    const getLocationAndSend = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          fetch("http://localhost:8080/api/ulocation", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({ latitude, longitude }),
          })
            .then((res) => res.text())
            .then((data) => {
              console.log("✅ Location updated:", data);
              alert("📍 Location updated successfully!");
            })
            .catch((err) => {
              console.error("❌ Failed to update location", err);
              alert("Failed to update location");
            });
        },
        (error) => {
          console.error("❌ Location error:", error);
          alert("Permission denied or error getting location.");
        }
      );
    };

    getLocationAndSend();
  }, [isLoggedIn, jwt]);
};

export default useLocationUpdater;
