const route = require("express").Router();
// const { dataBaseName } = require("../config/dataBaseConnection");
// const productCollection = dataBaseName.collection("Products");
// const cartCollection = dataBaseName.collection("Cart");
const productData = require("../Data/Product")
const productCollection = require("../model/productModel")


route.get("/", async (request, response) => {
    const allProduct = await productCollection.find();
    return response.send(allProduct);
});

route.get("/product/:id", async (request, response) => {
    const productID = request.params.id;
    const filteredData = await productCollection.find({ id: { $eq: Number(productID) } });
    return response.send(filteredData)
});


route.get("/search/:searchedBy", async (request, response) => {

    const searchBy = request.params.searchedBy;
    let filtereCategorydata = productData.filter((product) => product.title.toLowerCase().includes(searchBy.toLowerCase()) || product.category.toLowerCase() === searchBy.toLowerCase() || product.category.toLowerCase().includes(searchBy.toLowerCase()) || product.brand.toLowerCase() === searchBy.toLowerCase());

    return response.send(filtereCategorydata);

});


route.post("/Usercart", async (request, response) => {
    console.log(request.body);
    console.log("DATA")
    const data = await cartCollection.insertOne(request.body);
    response.send(data);
});



module.exports = route