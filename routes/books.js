const express = require("express");
const { BookModel, validateBook } = require("../models/bookModel")
const router = express.Router();

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

// בקשת פוסט ליצירת רשומה חדשה במסד נתונים
router.post("/", async(req, res) => {
    let valdiateBody = validateBook(req.body);
    if (valdiateBody.error) {
        return res.status(400).json(valdiateBody.error.details)
    }
    try {
        let book = new BookModel(req.body);
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
        let data = await BookModel.updateOne({ _id: idEdit }, req.body)
            // modfiedCount:1 - אם יש הצלחה
        res.json(data);
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

router.delete("/:idDel", async(req, res) => {
    try {
        let idDel = req.params.idDel
        let data = await BookModel.deleteOne({ _id: idDel })
            // "deletedCount": 1 -  אם יש הצלחה של מחיקה
        res.json(data);
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

module.exports = router;