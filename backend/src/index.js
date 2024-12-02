const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8084;
var cors = require('cors')

const employeeRoutes = require('./employee'); 
const userRoutes = require('./users')

app.use(express.json());

app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });

const start = async() => {
    try{
        await mongoose.connect("mongodb+srv://101359123:fxK8IaNsdPXmBzRN@cluster0.tnl0v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

        app.listen(SERVER_PORT, () => {
            console.log(`Server is running on port ${SERVER_PORT}`);
        });
    }
    catch(error){
        console.log(error.message);
    }
};

start();

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp/employees', employeeRoutes);

app.listen(port, (err) => {
    if (err) console.log(err);
    console.log("Server listening on Port", port);
});

