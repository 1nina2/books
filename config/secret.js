// כל המשתנים שצריכים להיות סודיים יהיו בקובץ הזה
// דואג שהאפליקציה תכיר את הקובץ אינוורמינט שמכיל 
// משתנים סודיים והגדרות של השרת
require("dotenv").config();
exports.config = {
    userDb: process.env.USER_DB,
    passDb: process.env.PASS_DB,
    tokenSecret: process.env.TOKEN_SECRET
}