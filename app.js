if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const ejsMate = require("ejs-mate");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
// const catchAsync = require("./utils/catchAsync"); перенесли в ./routes/campgrounds и в './routes/reviews', все остальное внутри них взято из app.js
const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const MongoDBStore = require("connect-mongo");

mongoose.set("strictQuery", false);
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp";
//process.env.DB_URL;
// "mongodb://127.0.0.1:27017/yelp-camp"
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);
const secret = process.env.SECRET || "thisshouldbeabettersecret!";
const store = MongoDBStore.create({
  // change this line
  mongoUrl: dbUrl, // change this line
  secret,
  touchAfter: 24 * 60 * 60,
});
store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
  store: store,
  name: "session", //вместо дефолтного имени (connect.sid) мы должны дать свое собственное
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, //this is for security, нет доступа к cookies если connection не HTTP
    // secure: true, //а тут cookies доступны, можно залогиниться итд только если connection HTTPS
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //указываем когда сессия должна будет закрыться в данном случае через неделю, сначала милисекунды, потом минута, час, 24 часа, 7 дней
    maxAge: 1000 * 60 * 60 * 24 * 7, //смотри в консоли браузера Application(connect.sid)
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); //всегда эта строчка должна идти ПОСЛЕ app.use(session(sessionConfig));
passport.use(new LocalStrategy(User.authenticate())); //passport используй LocalStrategy, для которой функция authenticate находится User model ВООБЩЕ НИЧЕГО НЕ ПОЙМУ ТУТ ВРОДЕ ВСЕ STATIC METHODS
//И authenticate() ПОЛУЧАЕТСЯ ГЕНЕРИРУЕТ ФУНКЦИЮ ДЛЯ LocalStrategy, ЧТОБЫ LocalStrategy ИСПОЛЬЗОВАЛ ЭТУ ФУНКЦИЮ
passport.serializeUser(User.serializeUser()); //КАК РАЗМЕСТИТЬ ПОЛЬЗОВАТЕЛЯ В SESSION
passport.deserializeUser(User.deserializeUser()); //HOW GET USER OUT OF THIS SESSION

app.use((req, res, next) => {
  //это глобальная вещь которая доступна во всех templates без привязок и всего прочего
  //у нас есть доступ ко всем templates этот middleware позволяет показывать flash-сообщение об успехе или ошибке на любой запрос от routes
  //если что-то запрашивается (удаление, создание нового, редактирование) есть только 2 варианта, какая-то ошибка или успешное завершение действия
  // console.log(req.session); //in session we have serialized information about user
  res.locals.currentUser = req.user; //req.user существует по умолчанию также как и req.flash, в нем все данные о пользователе, deserialized information
  res.locals.success = req.flash("success"); // in boilerplate.js add <%- include('../partials/flash')%> сами messages находятся в routes:req.flash("success", "Successfully updated campground!")
  res.locals.error = req.flash("error");
  next();
});
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes); //ссылаемся на routes написанные в ./routes/campgrounds, так как мы используем campgrounds как строку поиска, то в самом файле routes будут писаться без campgrounds
app.use("/campgrounds/:id/reviews", reviewRoutes); //ссылаемся на routes написанные в ./routes/reviews, все они начинаются с /campgrounds/:id/reviews

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404)); //this troggers app.use((err, req, res, next) => {
  // const { statusCode = 500 } = err; etc
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
  // const { statusCode = 500, message = "Something Went Wrong!" } = err;
  // res.status(statusCode).send(message);
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
