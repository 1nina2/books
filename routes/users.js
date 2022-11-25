const express = require("express");
const { userModel } = require("../models/userModel")
const router = express.Router();

router.get("/", (req, res) => {
    res.json({ msg: "users work" })
})
router.post("/", async(req, res) => {
    // וולדזציה של הצד שרת שהמידע תקין TODO:

    // req.query , req.params
    // נכניס מידע חדש למסד נתונים
    // מידע שנשלח בפוסט יגיע במאפיין באדי בריק

    let user = new UserModel(req.body);
    await user.save();
    // נקבל בדיוק את האובייקט שנשלח בבאדי לפי הסכימה
    // כולל את האיי די החדש שלו
    res.json(user);
})

module.exports = router;