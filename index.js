const express = require("express");
const {dbConnection, dataBaseName} = require("./config/dataBaseConnection");
const ProductRoute = require("./Router/productRouting");
const UserRoute = require("./Router/UserRouter")
const appServer = express();
const cors = require("cors");
const dotENV = require("dotenv");
dotENV.config();
const portNumber = process.env.port

appServer.use(express.json());
appServer.use(cors({
    origin: "*"
}));



appServer.use(ProductRoute);
appServer.use("/user", UserRoute);
appServer.listen(portNumber, async () => {
    try {
        await dbConnection()
    } catch (err) {
        console.log(`${err}`)
    }
});

