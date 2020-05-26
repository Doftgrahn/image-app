const mongoose = require('mongoose');
const app = require('./app');

const DB_URL = process.env.DB_HOST || 'mongodb://localhost:27017';
const PORT = process.env.PORT || 3002;

// Setup db connection
mongoose.connect(
    DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err) {
        if (err) {
            console.error('Error occurred while connecting to DB!');
        } else {
            console.log('Database connection established successfully');
        }
    }
);

// Run the server fast!
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}...`);
});
