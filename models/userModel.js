const mongoose = require("mongoose");


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


    location: String,
    abonnement: String,

})

exports.UserModel = mongoose.model("users", userSchema);