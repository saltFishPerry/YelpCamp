const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id); //находим camp на который пишется отзыв
  const review = new Review(req.body.review); //пишем новый отзыв
  review.author = req.user._id; //добавляем залогиненного прямо сейчас пользователя к автору данного отзыва, залогиненный пользователь автор данного отзыва
  campground.reviews.push(review); //суём отзыв в поле reviews нашего campgroundа
  await review.save(); //сохраняем отзыв
  await campground.save(); //сохраняем сам обновленный campground
  req.flash("success", "Created new review!");
  res.redirect(`/campgrounds/${campground._id}`); //возвращается в show page of camp, но имей в виду, что на странице show нет пока что самого отзыва
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params; //берем id of campground and id of review (reviewId) id`s taken from url
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //we find a campId, in object we remove from reviews of this campground ONE REVIW WITH ID reviewId
  await Review.findByIdAndDelete(reviewId); //после того как отзыв удален из campground, мы удаляем отзыв весь, его нет больше в campground и вообще
  req.flash("success", "Successfully deleted review!");
  res.redirect(`/campgrounds/${id}`);
};
