const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel, validUser, validLogin } = require("../models/userModel")
const router = express.Router();

router.get("/", async(req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 4;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;

    try {
        let data = await UserModel
            .find({})
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({
                [sort]: reverse
            })
        res.json(data);
    } catch (err) {

        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

router.post("/", async(req, res) => {
    let validateBody = validUser(req.body);
    if (validateBody.error) {
        return res.status(400).json(validateBody.error.details)
    }
    try {
        let user = new UserModel(req.body);
        // הצפנה חד כיוונית לסיסמא ככה 
        // שלא תשמר על המסד כמו שהיא ויהיה ניתן בקלות
        // לגנוב אותה
        user.password = await bcrypt.hash(user.password, 10)
        await user.save();
        // כדי להציג לצד לקוח סיסמא אנונימית
        user.password = "******";
        res.status(201).json(user)
    } catch (err) {
        // בודק אם השגיאה זה אימייל שקיים כבר במערכת
        // דורש בקומפס להוסיף אינדקס יוניקי
        if (err.code == 11000) {
            return res.status(400).json({ msg: "Email already in system try login", code: 11000 })
        }
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

router.post("/login", async(req, res) => {
    let validateBody = validLogin(req.body);
    if (validateBody.error) {
        return res.status(400).json(validateBody.error.details)
    }
    try {
        // לבדוק אם המייל שנשלח בכלל יש רשומה של משתמש שלו
        let user = await UserModel.findOne({ email: req.body.email })
        if (!user) {
            // שגיאת אבטחה שנשלחה מצד לקוח
            return res.status(401).json({ msg: "User and password not match 1" })
        }
        // בדיקה הסימא אם מה שנמצא בבאדי מתאים לסיסמא המוצפנת במסד
        let validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(401).json({ msg: "User and password not match 2" })
        }
        // בשיעור הבא נדאג לשלוח טוקן למשתמש שיעזור לזהות אותו 
        // לאחר מכן לראוטרים מסויימים
        res.json({ msg: "Success, Need to send to client the token" });
    } catch (err) {

        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

module.exports = router;