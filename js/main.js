// === main.js ===

let userMarker;
let userPos = null;
let isCentered = true;
let viewBoxZoom = 1.0;

// Setup the map
async function init() {
  const res = await fetch("data/map-config.json");
  const config = await res.json();
  window.MAP = config;
  const svg = document.getElementById("svgMap");
  svg.setAttribute("viewBox", `0 0 ${MAP.image.width} ${MAP.image.height}`);

  // Load layers
  await loadZones();
  await loadLandmarks();

  setupUserMarker();
  watchUserPosition();

  // Center button
  document.getElementById("center-btn").addEventListener("click", () => {
    isCentered = true;
    if (userPos) centerOnUser();
  });

  // Update pointers periodically
  setInterval(updatePointers, 1000);
}

function setupUserMarker() {
  const layer = document.getElementById("userLayer");
  userMarker = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  userMarker.setAttribute("id", "userMarker");
  userMarker.setAttribute("r", 10);
  userMarker.setAttribute("fill", "#007bff");
  layer.appendChild(userMarker);
}

function watchUserPosition() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        userPos = { lat: latitude, lng: longitude };
        const pixel = latLngToPixel(latitude, longitude);
        userMarker.setAttribute("cx", pixel.x);
        userMarker.setAttribute("cy", pixel.y);
        if (isCentered) centerOnUser();
      },
      err => console.error("Geolocation error:", err),
      { enableHighAccuracy: true }
    );
  }
}

function centerOnUser() {
  if (!userPos) return;
  const svg = document.getElementById("svgMap");
  const { width, height } = MAP.image;
  const pixel = latLngToPixel(userPos.lat, userPos.lng);

  const zoom = viewBoxZoom;
  const viewW = width / zoom;
  const viewH = height / zoom;

  const x = pixel.x - viewW / 2;
  const y = pixel.y - viewH / 2;
  svg.setAttribute("viewBox", `${x} ${y} ${viewW} ${viewH}`);
}

// === Directional Pointers ===
function updatePointers() {
  const overlay = document.getElementById("pointer-overlay");
  overlay.innerHTML = "";

  const svg = document.getElementById("svgMap");
  const vb = svg.getAttribute("viewBox").split(" ").map(Number);
  const [x, y, w, h] = vb;

  const zones = document.querySelectorAll("#zonesLayer polygon, #zonesLayer path");
  zones.forEach(zone => {
    const bbox = zone.getBBox();
    const center = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };

    // Check if inside viewport
    const inside = center.x >= x && center.x <= x + w && center.y >= y && center.y <= y + h;
    if (!inside) {
      const angle = Math.atan2(center.y - (y + h / 2), center.x - (x + w / 2));
      const pointer = document.createElement("div");
      pointer.className = "pointer";
      pointer.textContent = "➤";
      pointer.style.transform = `rotate(${angle * 180 / Math.PI}deg)`;

      // Position pointer near edge of screen
      const edgeDist = 45;
      const screenX = window.innerWidth / 2 + Math.cos(angle) * (window.innerWidth / 2 - edgeDist);
      const screenY = window.innerHeight / 2 + Math.sin(angle) * (window.innerHeight / 2 - edgeDist);

      pointer.style.left = `${screenX}px`;
      pointer.style.top = `${screenY}px`;
      overlay.appendChild(pointer);
    }
  });
}

init();
