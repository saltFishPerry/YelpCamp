const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};
//and create new user
module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password); //register берет данные нового пользователя (имя и почту) и пароль он добавляет salt и хэширует и все это чудесным образом попадаем в датабазу монго
    req.login(registeredUser, (err) => {
      // req.login позволяет сразу войти пользователю при регистрации, не нужно дополнительно логиниться чтобый войти после регистрации, как и logout требует callback, so we cannot await it
      //заметь что если мы пишем req.login нам не нужно добавлять middleware passport.authenticate()
      if (err) return next(err);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};
//render login form/serve the form
module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};
module.exports.login = (req, res) => {
  req.flash("success", "welcome back!");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo; //удаляет информацию из session
  res.redirect(redirectUrl);
};
//logout route
module.exports.logout = (req, res) => {
  req.logout(function (err) {
    //req.logout requires callback
    // if (err) { return next(err); }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};
