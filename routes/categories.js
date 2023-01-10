const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { validateCategory, CategoryModel } = require("../models/categoryModel");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({ msg: "Categories work" })
})


router.post("/", authAdmin, async(req, res) => {
    let validBody = validateCategory(req.body);
    if (validBody.error) {
        res.status(400).json(validBody.error.details)
    }
    try {
        let category = new CategoryModel(req.body);
        await category.save();
        res.json(category);
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

module.exports = router;