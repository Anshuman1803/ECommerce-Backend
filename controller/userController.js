const bcrypt = require("bcrypt");
const dotENV = require("dotenv");
const JWT = require("jsonwebtoken");
const { dataBaseName } = require("../config/dataBaseConnection");
const registredUserCollection = dataBaseName.collection("RegistredUser");
dotENV.config();
const KEY = process.env.secretKey;
const saltRound = 10


const userRegister = async (request, response) => {
    let tempUser = request.body;
    let IsRegistred = await registredUserCollection.findOne({ userEmail: { $eq: tempUser.userEmail } });


    if (IsRegistred) {

        // IF user is registred already, then it will send to the user
        return response.send({ "resMsg": "User Already Exists" });

    } else {

        //hashing password using bcrypt
        tempUser.userPassword = bcrypt.hashSync(tempUser.userPassword, saltRound);

        // saving new user in database
        const registredResult = await registredUserCollection.insertOne(tempUser);

        if (registredResult.acknowledged) {
            // generating JWT token for every new user who try to registred with our website
            const generatedToken = JWT.sign({ "USER": tempUser.userEmail }, KEY);

            // sending response back to client 
            return response.send({ resMsg: "User Registred Successfully", "Your_TOKEN": generatedToken });
        } else {
            return response.send({ resMsg: "Something Went Wrong, Try Again" });
        }

    }

}

const userLogin = async (request, response) => {
    const tempUser = request.body;

    let findUser = await registredUserCollection.findOne({ userEmail: { $eq: tempUser.userEmail } });

    if (!findUser) {
        return response.send({ resMsg: "User Not Registred or Email Is Not Correct" });
    }
    const userAuthenticaticated = bcrypt.compareSync(tempUser.userPassword, findUser.userPassword);

    if (userAuthenticaticated) {
        const generatedToken = JWT.sign({ "USER": tempUser.userEmail }, KEY, { expiresIn: "9000" });
        return response.send({ resMsg: "User Logged In Successfully", "Your_TOKEN": generatedToken, "UserDetails": findUser });
    } else {
        return response.send({ resMsg: "Password is not Correct" });
    }
}

module.exports = { userRegister, userLogin }