import express from "express";
const authRoute = require("./auth.route");
const userRoute = require("./user.route");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/users", userRoute);

export default router;
