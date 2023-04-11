const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
const ImageSchema = new Schema({
  url: String, //multer генерирует автоматически path URL загруженной картинки
  filename: String, //и также дает имя, вот это имя нам и нужно чтобы потом найти по имени картинку нужную и удалить, например
});
ImageSchema.virtual("thumbnail").get(function () {
  //we use virtual because we don't need to store in database, мы просто показываем изображения, которые уже есть в mongo + virtual is lightweight
  return this.url.replace("/upload", "/upload/w_200"); //this это определенное изображение, мы берем url этого изображения и в нем кусочек /upload меняем на /upload/w_200
}); //так мы меняем размер изображения на ширину 200, эту фишку нам позволяет сделать cloudinary
//был такой url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png', стал такой: 'https://res.cloudinary.com/douqbebwk/image/upload/w_200/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png'

const opts = { toJSON: { virtuals: true } }; //by default, Mongoose does not include virtuals when you convert a document to JSON. wehave to define this, без этого в сampground не попадет data from properties, а значит popUpMarkup

const CampgroundSchema = new Schema(
  {
    title: String,
    images: [ImageSchema], //мы отдельно определили схему для images, чтобы использовать virtual
    geometry: {
      //geometry is GeoJSON, т.е. он имеет четкую структуру {"type":"Point","coordinates":[37.6174943,55.7504461]}, поэтому мы должны определить именно в таком формате координаты
      type: {
        //мы взяли geometry из geoData
        type: String, //type всегда должен быть Point
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: Number,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);
CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `
  <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
  <p>${this.description.substring(0, 20)}...</p>`; //ПОКАЗЫВАЕТ ТОЛЬКО 20 БУКВ С МНОГОТОЧИЕМ НА КОНЦЕ
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  //doc это документ который только что был удален
  if (doc) {
    await Review.deleteMany({
      //у удаленного документа есть поле reviews, мы удаляем все id которые были в этом поле array
      _id: {
        $in: doc.reviews,
      },
    });
  }
});
module.exports = mongoose.model("Campground", CampgroundSchema);
