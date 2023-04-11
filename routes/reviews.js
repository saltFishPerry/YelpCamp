const express = require("express");
const router = express.Router({ mergeParams: true }); //этот mergeParams нужен чтобы в app.js мы имели доступ к id каждого routes (app.use("/campgrounds/:id/reviews", reviews); ). А вот в
//campgrounds.js мы ничего такого не пишем, потому что id там прописан в routes именно в самом campgrounds.js, а не в app.js
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const reviews = require("../controllers/reviews");
const Campground = require("../models/campground");
const Review = require("../models/review");

//мы создаем новый отзыв на определенный camp
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));
//удаляем отзыв
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);
module.exports = router;
