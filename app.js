const env = require('./env');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const comment = require('./routes/comment');

mongoose.connect(env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("Connected to MongoDB");})

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/comment', comment);

app.listen(env.PORT, () => {
        console.log(`App listening on ${env.PORT}`);
})



