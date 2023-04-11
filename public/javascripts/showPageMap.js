mapboxgl.accessToken = mapToken; //we defined it in show.ejs
const map = new mapboxgl.Map({
  container: "map", //так называется div с id="map" in show.ejs
  style: "mapbox://styles/mapbox/light-v10", // stylesheet location
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
});
map.addControl(new mapboxgl.NavigationControl()); //добавили справа кнопочки чтобы масштаб увеличивать или уменьшать

new mapboxgl.Marker() //это тот пин который на карте указывает на точку
  .setLngLat(campground.geometry.coordinates) //показывает местность где маркер, лучше делать его равным center in map variable const map = new mapboxgl.Map
  .setPopup(
    //когда нажимаешь на пин на карте, тебе выскакивает название campground и местоположение
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${campground.title}</h3><p>${campground.location}</p>`
    )
  )
  .addTo(map); //it is our variable const map = new mapboxgl.Map, что была выше
