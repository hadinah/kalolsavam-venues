async function loadLandmarks() {
  const landmarks = await (await fetch("data/landmarks.json")).json();
  landmarks.forEach(drawLandmark);
}

function drawLandmark(l) {
  const svg = document.getElementById("svgMap");
  const { x, y } = latLngToPixel(l.lat, l.lng);

  const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  dot.setAttribute("cx", x);
  dot.setAttribute("cy", y);
  dot.setAttribute("r", 8);
  dot.classList.add("landmark");

  svg.appendChild(dot);

  const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
  label.textContent = l.name;
  label.setAttribute("x", x + 12);
  label.setAttribute("y", y - 12);
  label.classList.add("landmark-label");

  svg.appendChild(label);
}

