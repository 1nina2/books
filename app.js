const express = require("express");
const path = require("path");
const http = require("http");
const cors = require("cors");
const { routesInit } = require("./routes/config_routes")
require("./db/mongoConnect")

const app = express();
app.use(cors())

// יודע כל מידע שהשרת מקבל מהצד לקוח
// לתרגם ל ג'ייסון אם אפשרי
app.use(express.json());
// הגדרת תקיית הפאבליק כתקייה ראשית
app.use(express.static(path.join(__dirname, "public")));

routesInit(app);

const server = http.createServer(app);
// בשרת אמיתי אם באינוורמינט הגדירו את הפורט שצריך לעבוד מולו
let port = process.env.PORT || 3000
server.listen(port);