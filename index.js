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


const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET} = process.env;
const base = "https://api-m.sandbox.paypal.com";
  


  

const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
    ).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};


const createOrder = async (cart) => {
  // use the cart information passed from the front-end to calculate the purchase unit details
  console.log(
    "shopping cart information passed from the frontend createOrder() callback:",
    cart,
  );
  
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
            // this ammound will be changed
          currency_code: "USD",
          value: "100.00",
        },
      },
    ],
  };
  
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
  console.log("ACESS TOKEN CALLED")
  
  return handleResponse(response);
};
  

async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}
  
appServer.post("/api/orders", async (req, res) => {
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const { cart } = req.body;
    const { jsonResponse, httpStatusCode } = await createOrder(cart);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});
  

appServer.listen(portNumber, async () => {
    try {
        await dbConnection()
    } catch (err) {
        console.log(`${err}`)
    }
});

