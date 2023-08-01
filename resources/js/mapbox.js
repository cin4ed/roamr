mapboxgl.accessToken =
    "pk.eyJ1Ijoia2VubmV0aC1xdWludGVybyIsImEiOiJjbGU1bmlsc2gwOHZvM25wM2NwZXVrZnVhIn0.pWzKCuC-uYwHxJm0vThQFQ";

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/dark-v11",
    center: [-110.31362343661425, 24.103134730434004],
    zoom: 12,
});

// Set map to user's location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((data) => {
        map.setCenter([data.coords.longitude, data.coords.latitude]);
    });
}
