const mongoose = require('mongoose');
const config = require('./config');

const dbConnectionURL = {
  'development': 'mongodb://localhost:27017/ecommerceDB',
  'production': process.env.DATABASE_URL
};

function connectToDatabase() {
  mongoose.connect(dbConnectionURL[config.env], {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('Connected to the database successfully.'))
  .catch((err) => console.error('Could not connect to the database.', err));
}

module.exports = connectToDatabase;
