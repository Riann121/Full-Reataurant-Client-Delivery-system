import express,{ Express, Request, Response } from "express";
import "dotenv/config";
import colors from "colors";


const app: Express = express();
const port = process.env.PORT || 8000;




// TEST ROUTE
app.get("/test", (req: Request, res: Response) => {
  res.send("Gateway Service is running! at port " + port);
});
 

app.listen(port, () => {
  console.log(colors.bgBlue(`[server]: Gateway Service is running at http://localhost:${port}`));
});