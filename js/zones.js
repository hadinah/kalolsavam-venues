async function loadZones() {
  const zones = await (await fetch("data/zones.json")).json();
  zones.forEach(drawZone);
}

function drawZone(z) {
  const svg = document.getElementById("zonesLayer");

  let shape, center = { x:0, y:0 };

  if (z.type === "rect") {
    const tl = latLngToPixel(z.bounds.lat_top, z.bounds.lng_left);
    const br = latLngToPixel(z.bounds.lat_bottom, z.bounds.lng_right);

    shape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    shape.setAttribute("x", tl.x);
    shape.setAttribute("y", tl.y);
    shape.setAttribute("width", br.x - tl.x);
    shape.setAttribute("height", br.y - tl.y);

    center = { x: (tl.x + br.x)/2, y: (tl.y + br.y)/2 };
  } else if (z.type === "polygon") {
    const pts = z.points.map(p => {
      const {x, y} = latLngToPixel(p[0], p[1]);
      return `${x},${y}`;
    }).join(" ");
    shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    shape.setAttribute("points", pts);

    // approximate center for label
    const xs = z.points.map(p => latLngToPixel(p[0], p[1]).x);
    const ys = z.points.map(p => latLngToPixel(p[0], p[1]).y);
    center = { x: (Math.min(...xs)+Math.max(...xs))/2, y:(Math.min(...ys)+Math.max(...ys))/2 };
  } else return;

  shape.setAttribute("fill", z.style.fill);
  shape.setAttribute("stroke", z.style.stroke);
  shape.classList.add("zone");
  shape.onclick = () => openDirections(z.destination);

  // tooltip events
  const tooltip = document.getElementById("tooltip");
  shape.addEventListener("mousemove", e => {
    tooltip.style.display = "block";
    tooltip.style.left = e.pageX + 12 + "px";
    tooltip.style.top = e.pageY + 12 + "px";
    tooltip.textContent = z.description || z.name;
  });
  shape.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
  });

  svg.appendChild(shape);

  // label
  const label = document.createElementNS("http://www.w3.org/2000/svg","text");
  label.textContent = z.name;
  label.setAttribute("x", center.x);
  label.setAttribute("y", center.y);
  label.setAttribute("text-anchor","middle");
  label.setAttribute("dominant-baseline","middle");
  label.classList.add("zone-label");
  svg.appendChild(label);
}



function openDirections(dest) {
  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${dest.lat},${dest.lng}`,
    "_blank"
  );
}

