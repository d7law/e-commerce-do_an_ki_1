mapboxgl.accessToken = 'pk.eyJ1IjoibS0xMzVhIiwiYSI6ImNrOGsyb3ZqaDBkemkzcW10emc1eXoyNngifQ.NuSNrMKqrpdm-jxvPpx0_Q';
const lat = 10.865609314125996;
const lng = 106.60058042549703;
//10.865609314125996, 106.60058042549703

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 15,
    center: [lng, lat],
});

const marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
