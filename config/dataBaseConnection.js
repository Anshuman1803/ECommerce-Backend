
const mongoose = require("mongoose");
mongoose.set("strictQuery", true)
const donENV = require("dotenv");
donENV.config();

const userName = process.env.mongooseUser;
const userPass = process.env.mongoosePass;

const mongoCloudURL =`mongodb+srv://${userName}:${userPass}@cluster0.48mqrke.mongodb.net/E-Commerce?retryWrites=true&w=majority`


const dbConnection = async () => {
    try {
        await mongoose.connect(mongoCloudURL);
        console.log("CONNECTED SUCCESSFULLY");
    } catch (err) {
        console.log(`Something went wrong in the mongo Connection : ${err}`);
    }
}


module.exports = {dbConnection}