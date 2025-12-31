import 'dotenv/config';
import express,{Request,Response,Express} from 'express';
import colors from 'colors';
import { clientRouter } from './Routes/UserRoutes.js';

const app:Express = express();
const PORT = process.env.PORT || 3000;
const address = "/api/v1";

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// USER CREATION ROUTE 
app.use(`${address}/user`, clientRouter);

// TEST ROUTE
app.get('/test', (req:Request, res:Response) => {
  res.json({message: 'Test route is working'});
  console.log(colors.white.bgBlue('Test route is working'));
});

app.listen(PORT, () => {
  console.log(colors.white.bgGreen(`Server is running on port ${PORT} `));
})