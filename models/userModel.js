const mongoose = require("mongoose");
const Joi = require("joi");


let userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    birth_date: Date,
    img_url: String,
    date_created: {
        type: Date,
        default: Date.now()
    },
    // role of the user if regular user or admin
    role: {
        type: String,
        default: "user"
    },
    abonnement: String,


    location: String


})

exports.UserModel = mongoose.model("users", userSchema);

exports.validUser = (_reqBody) => {
    console.log("validUser" + _reqBody);
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        email: Joi.string().min(2).max(99).email().required(),
        password: Joi.string().min(3).max(99).required(),
        phone: Joi.string().min(8).max(99).required(),
        birth_date: Joi.string().min(2).max(99).required(),
        abonnement: Joi.string().min(2).max(99).required(),
        img_url: Joi.string().min(2).max(99).allow(null, ""),
        location: Joi.string().min(2).max(99).required(),

    })

    return joiSchema.validate(_reqBody);
}

exports.validLogin = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(2).max(99).email().required(),
        password: Joi.string().min(3).max(99).required()
    })

    return joiSchema.validate(_reqBody);
}