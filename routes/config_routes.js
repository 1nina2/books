const indexR = require("./index");
const usersR = require("./users");
const booksR = require("./books");
const catsR = require("./categories");
const uploadR = require("./upload");

exports.routesInit = (app) => {
    app.use("/", indexR);
    app.use("/users", usersR);
    app.use("/books", booksR);
    app.use("/categories", catsR);
    app.use("/upload", uploadR);
}