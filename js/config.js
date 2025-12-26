let MAP;

async function loadConfig() {
  MAP = await (await fetch("data/map-config.json")).json();

  const svg = document.getElementById("svgMap");
  svg.setAttribute(
    "viewBox",
    `0 0 ${MAP.image.width} ${MAP.image.height}`
  );
}

