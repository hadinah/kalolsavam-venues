function startGPS() {
  const marker = document.getElementById("userMarker");
  if (!marker) return;

  navigator.geolocation.watchPosition(
    pos => {
      const { x, y } = latLngToPixel(
        pos.coords.latitude,
        pos.coords.longitude
      );

      marker.setAttribute("transform", `translate(${x},${y})`);
    },
    () => alert("Location access required"),
    { enableHighAccuracy: true }
  );
}

(async function init() {
  await loadConfig();
  await loadZones();
  await loadLandmarks();
  createUserMarker();
  startGPS();
})();

function createUserMarker() {
  const layer = document.getElementById("userLayer");

  // Clear old marker if any
  layer.innerHTML = "";

  // Group to move everything together
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("id", "userMarker");

  /* --- PIN --- */
  const pin = document.createElementNS("http://www.w3.org/2000/svg", "path");
  pin.setAttribute(
    "d",
    "M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7z M12 11.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5 14.5 7.6 14.5 9 13.4 11.5 12 11.5z"
  );
  pin.setAttribute("fill", "#007bff");
  pin.setAttribute("stroke", "white");
  pin.setAttribute("stroke-width", "2.5");
  pin.setAttribute("transform", "translate(-12,-30) scale(2)");

  /* --- LABEL --- */
  const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
  label.textContent = "You are here";
  label.setAttribute("x", 0);
  label.setAttribute("y", 30); // BELOW pin tip
  label.setAttribute("stroke", "black");
  label.setAttribute("stroke-width", "0.4");
  label.setAttribute("text-anchor", "middle");
  label.setAttribute("class", "user-label");

  group.appendChild(pin);
  group.appendChild(label);
  layer.appendChild(group);
}


