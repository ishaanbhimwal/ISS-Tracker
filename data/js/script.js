// grab all elements needed
let latitudeText = document.querySelector(".latitude");
let longitudeText = document.querySelector(".longitude");
let timeText = document.querySelector(".time");
let speedText = document.querySelector(".speed");
let altitudeText = document.querySelector(".altitude");
let visibilityText = document.querySelector(".visibility");

/* default latitude and longitude. Here lat and long is for "Pune" */
let lat = 18.5204;
let long = 73.8567;
let zoomLevel = 6;

// set iss.png image as Marker
const icon = L.icon({
  iconUrl: "data/img/iss.png",
  iconSize: [90, 45],
  iconAnchor: [25, 94],
  popupAnchor: [20, -86],
});

// drawing map interface on #map-div
const map = L.map("map-div").setView([lat, long], zoomLevel);

// add map tiles from Mapbox's Static Tiles API
/* Make sure you replaced 'your.mapbox.access.token' with your Mapbox API accessToken, otherwise the Map willnot show anything */
/* to get Mapbox API accessToken --> https://account.mapbox.com/access-tokens/ (do Signup or SignIn) */
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    // accessToken: 'your.mapbox.access.token'
    accessToken:
      "pk.eyJ1Ijoibm1vbmtleSIsImEiOiJja3Y2d3hqNmkxeWw0MnZvdmV0YTcyZnQ4In0.-1rv9QTnm745W0BB_Kobvw",
  }
).addTo(map);

// adding the Marker to map
const marker = L.marker([lat, long], { icon: icon }).addTo(map);

// findISS() function definition
function findISS() {
  fetch("https://api.wheretheiss.at/v1/satellites/25544")
    .then((response) => response.json())
    .then((data) => {
      lat = data.latitude.toFixed(2);
      long = data.longitude.toFixed(2);
      // convert seconds to milliseconds, then to UTC format
      const timestamp = new Date(data.timestamp * 1000).toUTCString();
      const speed = data.velocity.toFixed(2);
      const altitude = data.altitude.toFixed(2);
      const visibility = data.visibility;

      // call updateISS() function to update things
      updateISS(lat, long, timestamp, speed, altitude, visibility);
    })
    .catch((e) => console.log(e));
}

// updateISS() function definition
function updateISS(lat, long, timestamp, speed, altitude, visibility) {
  // updates Marker's lat and long on map
  marker.setLatLng([lat, long]);
  // updates map view according to Marker's new position
  map.setView([lat, long]);
  // updates other element's value
  latitudeText.innerText = lat;
  longitudeText.innerText = long;
  timeText.innerText = timestamp;
  speedText.innerText = `${speed} km/hr`;
  altitudeText.innerText = `${altitude} km`;
  visibilityText.innerText = visibility;
}

/* call findISS() initially to immediately set the ISS location */
findISS();

// call findISS() for every 1 seconds
setInterval(findISS, 1000);
