const BaseJoi = require("joi"); //это типа старый Joi, он раньше назывался просто Joi
const sanitizeHtml = require("sanitize-html");
const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          //не дает HTML тегам войти в inputs
          allowedTags: [], //мы не разрешаем ничего вообще
          allowedAttributes: {}, //тут тоже
        });
        if (clean !== value)
          //мы проверяем совпадает ли то, что ввел пользователь (value) с тем что осталось после очистки (clean), если не совпадает, то выйдет сообщение:
          return helpers.error("string.escapeHTML", { value }); //"string.escapeHTML": "{{#label}} must not include HTML!", где label это название campground.title, например, то куда ввел пользователь свой код
        return clean;
      },
    },
  },
});
const Joi = BaseJoi.extend(extension); //на старый Joi (BaseJoi) мы прикрепили extension и все это назвали просто Joi, чтобы не менять имя дальше в Joi.object({campground: Joi.object({title: Joi.string()...

module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0),
    // image: Joi.string().required(),
    location: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(), //мы удаляем изображения с name="deleteImages[]" см. edit.ejs
});
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});
