const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel, validUser, validLogin, createToken } = require("../models/userModel")
const router = express.Router();
const { auth, authAdmin } = require("../middlewares/auth");


router.get("/", async(req, res) => {
    console.log("get");
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

// בראוטר ניתן להעביר בשרשור המון פונקציות שכדי לעבור אחד מהשני
// אנחנו צריכים להשתמש בפקודת נקסט שנעביר לפונקציית מידל וואר
router.get("/myEmail", auth, async(req, res) => {
    try {
        // req.tokenData._id -> מגיע מפונקציית האוט שנמצאת בשרשור
        let user = await UserModel.findOne({ _id: req.tokenData._id }, { email: 1 })
        res.json(user);
        //  res.json({msg:"all good 3333" , data:req.tokenData })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

// אזור שמחזיר למשתמש את הפרטים שלו לפי הטוקן שהוא שולח
router.get("/myInfo", auth, async(req, res) => {
        try {
            let userInfo = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 });
            res.json(userInfo);
        } catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }


    })
    // רק משתמש אדמין יוכל להגיע ולהציג את רשימת 
    // כל המשתמשים
router.get("/usersList", authAdmin, async(req, res) => {
    try {
        let data = await UserModel.find({}, { password: 0 });
        res.json(data)
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})









router.post("/", async(req, res) => {
    console.log("post" + req.body);
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
    let validBody = validLogin(req.body);
    if (validBody.error) {
        // .details -> מחזיר בפירוט מה הבעיה צד לקוח
        return res.status(400).json(validBody.error.details);
    }
    try {
        // קודם כל לבדוק אם המייל שנשלח קיים  במסד
        let user = await UserModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(401).json({ msg: "Password or email is worng ,code:1" })
        }
        // אם הסיסמא שנשלחה בבאדי מתאימה לסיסמא המוצפנת במסד של אותו משתמש
        let authPassword = await bcrypt.compare(req.body.password, user.password);
        if (!authPassword) {
            return res.status(401).json({ msg: "Password or email is worng ,code:2" });
        }
        // מייצרים טוקן לפי שמכיל את האיידי של המשתמש
        let newToken = createToken(user._id, user.role);
        res.json({ token: newToken });
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

module.exports = router;