const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding"); //we require our package npm install @mapbox/mapbox-sdk, geocoding один из  множества сервисов mapbox
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken }); //geocoder contains 2 methods forwardGeocode and reverse
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

//create new one
module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};
module.exports.createCampground = async (req, res, next) => {
  //из-за того, что мы теперь загружаем файлы(изображения) у нас есть доступ не только к req.body, но и к req.files, он представляет собой array, с информацией о каждом изображении, в то время
  //как req.body показывает/содержит в себе всю информацию из формы о новом campground. Мы хотим loop over this images и взять path URL и имя (filename) каждого изображения
  //взяв имя и path URL, мы хотим добавить их к нашему новому campground
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location, //какой адрес надо перевести в координаты
      limit: 1, //сколько результатов нужно
    })
    .send(); //всегда нужно дописывать send, you sending query
  // res.send(geoData.body.features[0].geometry.coordinates); //выдает array сначала долгота, потом широта, geometry is GeoJSON, т.е. он имеет четкую структуру {"type":"Point","coordinates":[37.6174943,55.7504461]}
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  })); //req.files.map создает array, который содержит имя и path URL и сует в images of campground (по campground схеме)
  campground.author = req.user._id; //новый создаваемый campground будет ассоциирован с залогиненным пользователем
  await campground.save();
  console.log(campground);
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews", //это чтобы имя автора отзыва было видно в show.ejs это имя не создателя campground а именно отзыва поэтому мы пишем так у reviews populate author
      populate: {
        path: "author",
      },
    })
    .populate("author"); //это автор самого campground
  //   console.log(campground);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};
//edit campground
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};
module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  // console.log(req.body);
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs); //положи в уже существующий array НОВЫЕ изображения, иначе получится что в уже существующий array images, добавится еще один array и будет [images[newImages]], а надо чтобы было [images, newImages]
  await campground.save();

  if (req.body.deleteImages) {
    //если array deleteImages имеет изображения (т.е. если пользователь выбрал images to delete), то
    for (let filename of req.body.deleteImages) {
      //возьми выбранные имена изображений (filename) из array deleteImages
      await cloudinary.uploader.destroy(filename); //удали эти выбранные изображения (filename) из cloudinary
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    }); //мы убираем выбранные изображения (filename) из array images этого campground'а, т.е. из mongo
  }

  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};
//delete campground
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground");
  res.redirect("/campgrounds");
};
