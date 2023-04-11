const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary"); //не нужно дописывать index потому что по умолчанию ищут именно index, в index.js находится defined storage
const upload = multer({ storage }); //то, где будут храниться все изображения, они загружаются в cloudinary, и генерируют path URL, который можно добавить в mongo датабазу
const campgrounds = require("../controllers/campgrounds");

//все эти routes мы взяли из app.js, изначально они там были написаны, так как в app.js мы уже написали, что эти routes начинаются с campgrounds тут на всех routes мы убираем campgrounds
// БЫЛО:  router.get("/", //было: "/campgrounds"
//   catchAsync(async (req, res) => {
//     const campgrounds = await Campground.find({});
//     res.render("campgrounds/index", { campgrounds });
//   })
// );
//Было: router.get("/", catchAsync(campgrounds.index)); //campgrounds.index - campgrounds здесь это const campgrounds = require("../controllers/campgrounds");
// Новый способ группировать все routes - совмещать routes с одинаковыми path, но с разными глаголами
router
  .route("/") //мы совместили routes с просто index и route, генерирующий новый campground с глаголом post, у них одинаковый path('/'). Все благодаря методу router.route("path")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"), //image взято из формы из new.ejs <input type="file" name="image" id="" multiple>, array и multiple значит, что мы загружаем несколько изображений, есть еще upload.single для 1 image
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );
//create new one
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground)) //show only one
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  ) //edit campground
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)); //delete

//edit campground
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
