const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://ninayakov:1nina2@cluster0.y9muoe8.mongodb.net/project22');
    console.log("mongo connect project22")
        // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}