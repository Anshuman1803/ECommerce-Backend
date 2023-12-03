const mongoose = require("mongoose");
const productModel = mongoose.Schema({
    "id": {
        type: Number,
        required: true,
    },
})
const productCollection = mongoose.model("Products", productModel);
module.exports= productCollection;
