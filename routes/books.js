const express = require("express");
const { BookModel, validateBook } = require("../models/bookModel")
const router = express.Router();
const { auth } = require("../middlewares/auth");

router.get("/", async(req, res) => {
    // Math.min -> המספר המקסימלי יהיה 20 כדי שהאקר לא ינסה
    // להוציא יותר אם אין צורך בזה מבחינת הלקוח
    let perPage = Math.min(req.query.perPage, 10) || 4;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    // מחליט אם הסורט מהקטן לגדול 1 או גדול לקטן 1- מינוס 
    let reverse = req.query.reverse == "yes" ? -1 : 1;

    try {
        let data = await BookModel
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

// /cakes/search?s=
router.get("/search", async(req, res) => {
    try {
        let queryS = req.query.s;
        // מביא את החיפוש בתור ביטוי ולא צריך את כל הביטוי עצמו לחיפוש
        // i -> מבטל את כל מה שקשור ל CASE SENSITVE
        let searchReg = new RegExp(queryS, "i")
        let data = await BookModel.find({ name: searchReg })
            .limit(50)
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})
router.get("/count", async(req, res) => {
    try {
        // .countDocument -> מחזיר את המספר רשומות שקיימים במסד
        let count = await BookModel.countDocuments({})
        res.json({ count });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})



// בקשת פוסט ליצירת רשומה חדשה במסד נתונים
router.post("/", auth, async(req, res) => {
    let validateBody = validateBook(req.body);
    if (validateBody.error) {
        return res.status(400).json(validateBody.error.details)
    }
    try {
        let book = new BookModel(req.body);
        book.user_id = req.tokenData._id;
        await book.save();
        res.status(201).json(book)
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

router.put("/:idEdit", async(req, res) => {
    let valdiateBody = validateBook(req.body);
    if (valdiateBody.error) {
        return res.status(400).json(valdiateBody.error.details)
    }
    try {
        let idEdit = req.params.idEdit
        let data = await BookModel.updateOne({ _id: idEdit, user_id: req.tokenData._id }, req.body)
            // modfiedCount:1 - אם יש הצלחה
        res.json(data);
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})


router.delete("/:delId", auth, async(req, res) => {
    try {
        let delId = req.params.delId;
        let data;
        // אם אדמין יכול למחוק כל רשומה אם לא בודק שהמשתמש
        // הרשומה היוזר איי די שווה לאיי די של המשתמש
        if (req.tokenData.role == "admin") {
            data = await BookModel.deleteOne({ _id: delId })
        } else {
            data = await BookModel.deleteOne({ _id: delId, user_id: req.tokenData._id })
        }
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

module.exports = router;