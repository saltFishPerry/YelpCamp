const { campgroundSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log("req.user info:", req.user); тут можно увидеть, что req.user показывает информацию о пользователе, passport filled in this with deserialized information
  //session stores serialized user information, passport unserialize it and put in req.user data
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  console.log(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params; //id - is id if campground
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    //мы сверяем залогиненного нынче пользователя с владельцем(автором) данного campground`а
    req.flash("error", "You do not have permission to do that!"); //если они не совпадают, то будет error
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params; //id - is id if campground, reviewId is id of review
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    //тут то же самое автор тот же чел что и залогиненный пользователь? или нет
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body); //мы проверяем подходит ли отзыв по валидации (см. schemas.js)
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
