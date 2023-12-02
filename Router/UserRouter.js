const route = require("express").Router();
const {userRegister, userLogin} = require("../controller/userController")


route.post("/register",userRegister);

route.post("/login",userLogin);

route.post("/saveCart", (request, response) => {
    const tempData = request.body;
    let IsPresent = CartDataBase.some((user) => user.currentUserMail === tempData.currentUserMail);
    if (IsPresent) {
        let Index = CartDataBase.map((user, index) => {
            if (user.currentUserMail === tempData.currentUserMail) {
                return index
            }
        }).filter((data) => typeof data === "number");
        const currentCartOwner = CartDataBase[Index];
        currentCartOwner.currentCartDetails = tempData.currentCartDetails
        // console.log(CartDataBase)
        CartDataBase[Index].currentCartDetails = currentCartOwner.currentCartDetails
        response.send(CartDataBase)
    } else {
        CartDataBase.push(tempData);
        response.send(CartDataBase)
    }

});

route.get("/loadCart", (request, response)=>{
    return response.send(CartDataBase);
})


module.exports = route