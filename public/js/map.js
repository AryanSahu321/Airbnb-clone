function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 9,
    center: coordinates,
  });

  const marker = new google.maps.Marker({
    position: coordinates,
    map: map,
    title: listingTitle,
  });

  // Popup info box showing title & location when clicked
  const infoWindow = new google.maps.InfoWindow({
    content: `<h5>${listingTitle}</h5><p>${listingLocation}</p>`,
  });

  marker.addListener("click", () => {
    infoWindow.open(map, marker);
  });
}
