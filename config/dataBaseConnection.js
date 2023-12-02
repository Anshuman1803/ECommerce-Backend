const { MongoClient } = require("mongodb");
const mongoDBURL = "mongodb://127.0.0.1:27017";

const mongoServer = new MongoClient(mongoDBURL);


const dbConnection = async () => {
    try {
        await mongoServer.connect();
        console.log("CONNECTED SUCCESSFULLY....");

    } catch (err) {
        console.log(`Something went wrong in mongo Connection: ${err}`)
    }
}

const dataBaseName = mongoServer.db("E-Commerce");
module.exports = {dbConnection, dataBaseName}