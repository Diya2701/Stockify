require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const aiRoutes = require("./routes/aiRoutes");
const personalizedAdvisorRoutes = require("./routes/personalizedAdvisorRoutes");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./model/user");
const session = require("express-session");
const authRouter = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 3001;
const url = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/test";

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(bodyParser.json());

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "default-session-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: "lax",
  },
};
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new localStrategy({ usernameField: "email" }, User.authenticate()),
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.send(
    "Stockify backend is running. Dashboard is deployed at https://stockify-dashboard.vercel.app/",
  );
});

app.use("/auth", authRouter);

app.get("/allHoldings", async (req, res) => {
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

app.get("/allOrders", async (req, res) => {
  let allOrders = await OrdersModel.find({}).sort({ _id: -1 });
  res.json(allOrders);
});

app.post("/newOrder", async (req, res) => {
  let { name, qty, price, mode } = req.body;
  let normalizedMode = (mode || "BUY").toUpperCase();
  let orderQty = Number(qty) || 0;
  let orderPrice = Number(price) || 0;

  let newOrder = new OrdersModel({
    name,
    qty: orderQty,
    price: orderPrice,
    mode: normalizedMode,
  });
  await newOrder.save();

  if (normalizedMode === "BUY") {
    let existingHolding = await HoldingsModel.findOne({ name });

    if (existingHolding) {
      let newQty = Number(existingHolding.qty) + orderQty;
      let newAvg =
        (Number(existingHolding.avg) * Number(existingHolding.qty) +
          orderPrice * orderQty) /
        newQty;

      await HoldingsModel.updateOne(
        { name },
        {
          $set: {
            qty: newQty,
            avg: newAvg,
            price: orderPrice,
            net: "0.00%",
            day: "0.00%",
          },
        },
      );
    } else {
      let newHolding = new HoldingsModel({
        name,
        qty: orderQty,
        avg: orderPrice,
        price: orderPrice,
        net: "0.00%",
        day: "0.00%",
      });
      await newHolding.save();
    }
  } else if (normalizedMode === "SELL") {
    let existingHolding = await HoldingsModel.findOne({ name });

    if (!existingHolding) {
      return res.status(404).json({ message: "Holding not found" });
    }

    if (orderQty > Number(existingHolding.qty)) {
      return res
        .status(400)
        .json({ message: "Sell quantity exceeds holding quantity" });
    }

    let newQty = Number(existingHolding.qty) - orderQty;

    if (newQty <= 0) {
      await HoldingsModel.deleteOne({ name });
    } else {
      await HoldingsModel.updateOne(
        { name },
        {
          $set: {
            qty: newQty,
            price: orderPrice,
            net: "0.00%",
            day: "0.00%",
          },
        },
      );
    }
  }

  res.json({ message: "Order created successfully" });
});

app.use("/api/ai", aiRoutes);
app.use("/api", personalizedAdvisorRoutes);

mongoose
  .connect(url)
  .then(async () => {
    const userCollection = mongoose.connection.collection("users");
    const indexes = await userCollection.indexes();
    const hasUsernameIndex = indexes.some(
      (index) => index.name === "username_1",
    );

    if (hasUsernameIndex) {
      await userCollection.dropIndex("username_1");
      console.log("Dropped stale username_1 index from users collection");
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
      console.log("MongoDB connected");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
