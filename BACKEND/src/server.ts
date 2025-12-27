import express,{Request,Response} from 'express';
import colors from 'colors';

const app = express();
const PORT = process.env.PORT || 3000;







// TEST ROUTE
app.get('/test', (req:Request, res:Response) => {
  res.send(colors.bgBlue('test route is working perfectly'));
});

app.listen(PORT, () => {
  console.log(colors.white.bgGreen(`Server is running on port ${PORT} `));
})