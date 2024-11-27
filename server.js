const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
dotenv.config()
const app = express();
app.use(cors());


//import routes
const systemInfoRouter = require('./routes/systemInfoRoute');

//uses
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//routes
app.use("/v1", systemInfoRouter);



app.listen(process.env.PORT, ()=>{
  console.log("Server is running at port", process.env.PORT);
})
