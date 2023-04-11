//КОРОЧЕ, НАПИШУ ОБЪЯСНЕНИЕ СЕБЕ ЗДЕСЬ: MAPBOX ИМЕЕТ СВОЙ ШАБЛОН. формат OF DATA, КОТОРОМУ DATA ДОЛЖНА СООТВЕТСТВОВАТЬ. КАК ВИДНО ВНИЗУ ТАМ ЕСТЬ ТАКИЕ СТРОЧКИ: type, properties, geometry И id.
//Все они имеют одинаковую структуру. так вот мы смотрим e.features[0], получается это тот campground на который мы нажали (event click). Там есть строчка properties, которая пустая сама по себе
//т.е. without defining variables e.features[0].properties is empty, BUT! we defined our popUpMarkup in models/campgrounds.js CampgroundSchema.virtual("properties.popUpMarkup").get(function ()
//теперь properties имеет внутри popUpMarkup, благодаря virtual (CampgroundSchema.virtual("properties.popUpMarkup")) мы можем вложить в CampgroundSchema еще одну строчку, котоая называется properties,
//const CampgroundSchema = new Schema( { title: String, images: [ImageSchema] и т.д. и в конце properties: {popUpMarkup: "<h3><strong><a href="/campgrounds/${this._id}">${this.title}</a><strong></h3>"}
// как часть CampgroundSchema, вместо этого мы написали CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
//   return `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
//   <p>${this.description.substring(0, 20)}...</p>`;
// });
 
{
    "type": "FeatureCollection",
    "features": [


        //OBJECT ONE
      {
        "type": "Feature",
        "properties": {
          "id": "marker-iv1qi3x10",
          "title": "Burnham Park",
          "description": "A lakefront park on Chicago's south side.",
          "marker-size": "medium",
          "marker-color": "#1087bf",
          "marker-symbol": "marker-blue"
        },
        "geometry": {
          "coordinates": [
            -87.603735,
            41.829985
          ],
          "type": "Point"
        },
        "id": "0de616c939ce2f31676ff0294c78321b"
      },


 //OBJECT 2

      {
        "type": "Feature",
        "properties": {
          "id": "marker-iv1r2v427",
          "title": "Jackson Park",
          "description": "A lakeside park that was the site of the 1893 World's Fair",
          "marker-size": "medium",
          "marker-color": "#1087bf",
          "marker-symbol": "marker-orange"
        },
        "geometry": {
          "coordinates": [
            -87.580389,
            41.783185
          ],
          "type": "Point"
        },
        "id": "207437833677b4c5af354906d54fda84"
      },

 //OBJECT 3

      {
        "type": "Feature",
        "properties": {
          "id": "marker-iv1qkj6v1",
          "title": "Calumet Park",
          "description": "A park on the Illinois-Indiana border featuring a historic fieldhouse.",
          "marker-size": "medium",
          "marker-color": "#1087bf",
          "marker-symbol": "marker-green"
        },
        "geometry": {
          "coordinates": [
            -87.530221,
            41.715515
          ],
          "type": "Point"
        },
        "id": "268b9f0edfdc3a8a2a021f019164eaef"
      },
       //OBJECT 4 И Т.Д.
      {
        "type": "Feature",
        "properties": {
          "id": "marker-iv1qs0u84",
          "title": "Garfield Park",
          "description": "Home of the Garfield Park Conservatory.",
          "marker-size": "medium",
          "marker-color": "#1087bf",
          "marker-symbol": "marker-blue"
        },
        "geometry": {
          "coordinates": [
            -87.716002,
            41.882102
          ],
          "type": "Point"
        },
        "id": "451e1a14ee747776c48d459c52905cac"
      },
      {
        "type": "Feature",
        "properties": {
          "id": "marker-iv1qq1kl3",
          "title": "Douglas Park",
          "description": "A large park near in Chicago's North Lawndale neighborhood",
          "marker-size": "medium",
          "marker-color": "#1087bf",
          "marker-symbol": "marker-orange"
        },
        "geometry": {
          "coordinates": [
            -87.699329,
            41.860092
          ],
          "type": "Point"
        },
        "id": "4aaa9df412c62b53eeab4b16ec0ea825"
      },
      {
        "type": "Feature",
        "properties": {
          "id": "marker-iv1r4bs18",
          "title": "Lincoln Park",
          "description": "A northside park that is home to the Lincoln Park Zoo",
          "marker-size": "medium",
          "marker-color": "#1087bf",
          "marker-symbol": "marker-blue"
        },
        "geometry": {
          "coordinates": [
            -87.637596,
            41.940403
          ],
          "type": "Point"
        },
        "id": "7459e13bb6d8ecd1c797e2c168a6ad91"
      },
      {
        "type": "Feature",
        "properties": {
          "id": "marker-iv1qnmnw2",
          "title": "Columbus Park",
          "description": "A large park in Chicago's Austin neighborhood",
          "marker-size": "medium",
          "marker-color": "#1087bf",
          "marker-symbol": "marker-orange"
        },
        "geometry": {
          "coordinates": [
            -87.769775,
            41.873683
          ],
          "type": "Point"
        },
        "id": "a0a6bbc358a34ccea8687f8fee527964"
      },
      {
        "type": "Feature",
        "properties": {
          "id": "marker-iv1qtkep5",
          "title": "Grant Park",
          "description": "A downtown park that is the site of many of Chicago's favorite festivals and events",
          "marker-size": "medium",
          "marker-color": "#1087bf",
          "marker-symbol": "marker-orange"
        },
        "geometry": {
          "coordinates": [
            -87.619185,
            41.876367
          ],
          "type": "Point"
        },
        "id": "acba288f3abd79014145bc16e83fbc78"
      },
      {
        "type": "Feature",
        "properties": {
          "id": "marker-iv1r12m56",
          "title": "Humboldt Park",
          "description": "A large park on Chicago's northwest side",
          "marker-size": "medium",
          "marker-color": "#1087bf",
          "marker-symbol": "marker-green"
        },
        "geometry": {
          "coordinates": [
            -87.70199,
            41.905423
          ],
          "type": "Point"
        },
        "id": "be73854ebca0a6397ce0b63e06852b50"
      },
      {
        "type": "Feature",
        "properties": {
          "id": "marker-iv1r541d9",
          "title": "Millennium Park",
          "description": "A downtown park known for it's art installations and unique architecture",
          "marker-size": "medium",
          "marker-color": "#1087bf",
          "marker-symbol": "marker-green"
        },
        "geometry": {
          "coordinates": [
            -87.622554,
            41.882534
          ],
          "type": "Point"
        },
        "id": "f919f7ec1e3bf88e776772311af3b151"
      }
    ]
  }