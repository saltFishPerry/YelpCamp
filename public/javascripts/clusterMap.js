//весь этот код мы взяли из примера https://docs.mapbox.com/mapbox-gl-js/example/cluster/
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  //create new map
  container: "cluster-map", //our div with id="cluster-map"
  style: "mapbox://styles/mapbox/light-v10", //our stylesheet
  center: [-103.59179687498357, 40.66995747013945], //что показывать на карте
  zoom: 3, //то, насколько далеко должна быть камера если можно так сказать
});
map.addControl(new mapboxgl.NavigationControl()); //добавили справа кнопочки чтобы масштаб увеличивать или уменьшать
console.log(campgrounds); //we must define CampgroundSchema.virtual("properties.popUpMarkup").get(function and opts= { toJSON: { virtuals: true }} to store properties.popUpMarkup in campground
//кластеры это кругляшки с местоположением всех campgrounds на огромной карте
map.on("load", function () {
  //   console.log("Map loaded");
  // Add a new source from our GeoJSON data and
  // set the 'cluster' option to true. GL-JS will
  // add the point_count property to your source data.
  map.addSource("campgrounds", {
    //NAME OF THE SOURCE, это своего рода лейбл на который ссылается в дальнейшем, we registering source of data and refering to it
    type: "geojson",
    // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
    // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
    data: campgrounds, //см.index.ejs там campgrounds was defined
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
  });

  map.addLayer({
    //make a circle based upon the point count of this each individual cluster
    id: "clusters",
    type: "circle",
    source: "campgrounds", //это NAME OF THE SOURCE, we refering to map.addSource("campgrounds",
    filter: ["has", "point_count"],
    paint: {
      // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
      // with three steps to implement three types of circles:
      //   * Blue, 20px circles when point count is less than 100
      //   * Yellow, 30px circles when point count is between 100 and 750
      //   * Pink, 40px circles when point count is greater than or equal to 750
      "circle-color": [
        //мы тут определяем какого цвета и радиуса должны быть кругляки в зависимости от point_count, можно самом добавить еще шаги, допустим если больше 20 то цвет будет желтый например
        "step",
        ["get", "point_count"],
        "#00BCD4", //тут все остальное меньше 10
        10, //если point_count больше 10, то цвет будет 2196F3
        "#2196F3",
        30, //тут если больше 30
        "#3F51B5",
      ],
      "circle-radius": ["step", ["get", "point_count"], 15, 10, 20, 30, 25], //тут радиус кругляков зависит от размера кластера (point_count), если point_count меньше 10, то радиус 15,
      //если меньше 30, то радиус 20, все остальное больше 30, 25 имеет радиус
    },
  });

  map.addLayer({
    //вроде как текст который показывает сколько кластеров в кругляке
    id: "cluster-count",
    type: "symbol",
    source: "campgrounds", //это NAME OF THE SOURCE, we refering to map.addSource("campgrounds",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}", //показывает сколько точек в кластере
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
  });

  map.addLayer({
    id: "unclustered-point", //единичный кластер, т.е. кругляк с цифрой 1 по сути, но там нет цифры, single point, мы тут определяем как это tiny point will look like
    type: "circle",
    source: "campgrounds", //это NAME OF THE SOURCE, we refering to map.addSource("campgrounds",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#11b4da",
      "circle-radius": 4, //очень маленькая точк как по мне, хер нажмешь блин
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff", //это кругляк окруженный белой линией, полоской, т.е. голубой круг с белый краями, но его плохо видно т.к. стиль карты светлый
    },
  });

  // inspect a cluster on click
  map.on("click", "clusters", function (e) {
    //тут думаю понятно, что кликаешь на кластер карта зумится, то есть смотришь поближе что это такое, какие campgrounds есть
    // console.log("click");
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["clusters"],
    });
    const clusterId = features[0].properties.cluster_id;
    map
      .getSource("campgrounds") //это NAME OF THE SOURCE, we refering to map.addSource("campgrounds",
      .getClusterExpansionZoom(clusterId, function (err, zoom) {
        if (err) return;

        map.easeTo({
          //когда тыкаешь на кластер то он становится новым центром карты и туда zooming in, каждый раз центр меняется
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
  });

  //КОРОЧЕ, НАПИШУ ОБЪЯСНЕНИЕ СЕБЕ ЗДЕСЬ: MAPBOX ИМЕЕТ СВОЙ ШАБЛОН GeoJSON. формат OF DATA, КОТОРОМУ DATA ДОЛЖНА СООТВЕТСТВОВАТЬ. КАК ВИДНО ВНИЗУ ТАМ ЕСТЬ ТАКИЕ СТРОЧКИ: type, properties, geometry И id.
  //каждый объект имеет одинаковую структуру. так вот мы смотрим e.features[0], получается это тот campground на который мы нажали (event click). Там есть строчка properties, которая пустая сама по себе
  //т.е. without defining a virtual method of popUpMarkup, BUT! we defined our popUpMarkup in models/campgrounds.js CampgroundSchema.virtual("properties.popUpMarkup").get(function ()
  //теперь properties имеет внутри popUpMarkup, благодаря virtual (CampgroundSchema.virtual("properties.popUpMarkup")) мы можно сказать вложили в CampgroundSchema еще одну строчку, котоая называется properties,
  //const CampgroundSchema = new Schema( { title: String, images: [ImageSchema] и т.д. и в конце properties: {popUpMarkup: "<h3><strong><a href="/campgrounds/${this._id}">${this.title}</a><strong></h3>"}
  // как часть CampgroundSchema, то же самое мы написали вложенно CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  //   return `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
  //   <p>${this.description.substring(0, 20)}...</p>`;
  // });

  //ЕСТЬ ТАКАЯ ШТУКА КАК GeoJSON у mapbox'a, у него есть формат, под который campground не хватает properties, CampgroundSchema.virtual("properties.popUpMarkup") помогли всунуть popUpMarkup внутрь
  //campground'a, но этого мало надо еще дописать const opts = { toJSON: { virtuals: true } }; чтобы наш virtual метод был доступен в campground

  // When a click event occurs on a feature in
  // the unclustered-point layer, open a popup at
  // the location of the feature, with
  // description HTML from its properties.
  map.on("click", "unclustered-point", function (e) {
    //когда жмешь на единичный campground, тот который не собрался в кластер т.е. одинокий, так как кластер - больше или равен двум campgrounds
    // console.log("unclustered-point click"); //так тяжело попасть в кругляшок
    //уже после того как написали virtual метод (CampgroundSchema.virtual("properties.popUpMarkup")) и const opts = { toJSON: { virtuals: true } }; внутри models/campground.js В MAPBOX ДОСТУПЕН popUpMarkup
    // console.log(e.features[0].properties); //this contains popUpMarkup
    // console.log("THIS IS e.features", e.features);
    const { popUpMarkup } = e.features[0].properties; //popUpMarkup: "\n  <strong><a href=\"/campgrounds/6420100798d0538ff69d299c\">Ancient Mule Camp</a><strong>\n  <p>Lorem ipsum dolor si...</p>"
    //[[Prototype]]: Object, вот так вот он и выглядит popUpMarkup, он взят из models/campgrounds.js: CampgroundSchema.virtual("properties.popUpMarkup").get(function ()

    const coordinates = e.features[0].geometry.coordinates.slice(); //у e.features[0] есть свойство geometry, в нем есть coordinates,это array из двух чисел например, [-112.03411102294922, 43.491537458917975]
    //а метод slice() типа делает копию array координат
    // console.log("THIS IS e.features", e.features);

    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup().setLngLat(coordinates).setHTML(popUpMarkup).addTo(map); //когда жмешь то возникает Popup сообщение
  });

  map.on("mouseenter", "clusters", function () {
    // console.log("mouseenter");
    //когда наводишь мышью на кластер, курсов превращается в pointer
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "clusters", function () {
    // console.log("mouseleave");
    //убираешь курсор обычный
    map.getCanvas().style.cursor = "";
  });
});
//помни, что mapbox ищет properties  в твоем campground
