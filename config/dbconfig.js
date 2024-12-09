const mongoose = require('mongoose');


const moduleExports = {
  connection: mongoose.connect('mongodb://localhost:27017/usersDB', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
  }).then(() => {
    mongoose.set('debug', true)
    mongoose.set('strictQuery', true);
    console.log('DataBase Connected successfully .... ')
  }).catch((err) => {
    console.log('DataBase unable to connect ....', err)
  })
}

  module.exports = {moduleExports}