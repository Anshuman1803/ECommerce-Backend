const mongoose = require("mongoose");
const productModel = mongoose.Schema({
    "firstName": {
        type: String,
        required : true
    },
    "lastName": {
        type: String,
        required : true
    },
    "salary": {
        type: Number,
        required : true
    },
    "department": {
        type: String,
        required : true
    },
    "lastCompany": {
        type: String,
        required : true
    },
    "lastSalary": {
        type: Number,
        required : true
    },
    "overallExp": {
        type: Number,
        required : true
    },
    "contactInfo": {
        type: Number,
        required : true
    },
    "yearGrad": {
        type: Number,
        required : true
    },
    "gradStream": {
        type: String,
        required : true
    },
});

const productCollection = mongoose.model("Products", productModel);
module.exports= productCollection;
