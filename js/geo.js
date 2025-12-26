function latLngToPixel(lat, lng) {
  const img = MAP.image;

  const x = ((lng - img.lng_left) / (img.lng_right - img.lng_left)) * img.width;
  const y = ((img.lat_top - lat) / (img.lat_top - img.lat_bottom)) * img.height;

  return { x, y };
}

