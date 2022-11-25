const mongoose = require("mongoose");
const Joi = require("joi");

// סכמה כיצד הקולקשן/טבלה של המוצרים נראת והסוג של כל מאפיין
//dvsdfvsfvbsfdv
let bookSchema = new mongoose.Schema({
    name: String,
    description: String,
    reliseDate: Date,
    writer: String,
    img_url: String,
    date_created: {
        type: Date,
        default: Date.now()
    },
    categories: String,
    isAvaialble: {
        type: Boolean,
        default: true,
    }



})

// מייצר ומייצא את המודל שבנוי משם הקולקשן והסכמה שלו
// קולקשן חייב להסתיים באס אחר יהיו באגים
exports.BookModel = mongoose.model("books", bookSchema);

exports.validateBook = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        description: Joi.string().min(2).max(999999).required(),
        reliseDate: Joi.string().min(2).max(99).required(),
        writer: Joi.string().min(2).max(99).required(),
        img_url: Joi.string().min(2).max(200).allow(null, ""),
        categories: Joi.string().min(2).max(99).required(),





    })
    return joiSchema.validate(_reqBody);
}