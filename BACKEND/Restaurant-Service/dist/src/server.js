import express from "express";
import "dotenv/config";
import colors from "colors";
import RestaurantRoutes from "./Routes/RestaurantRoutes.js";
const app = express();
const PORT = process.env.PORT || 4002;
// MIDDLEWARES
app.use(express.json());
// ROUTES
app.use("/api/v1/restaurant", RestaurantRoutes);
// START SERVER
app.listen(PORT, () => {
    console.log(colors.bgGreen(`Restaurant Service running on port ${PORT}`));
});
