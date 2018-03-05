const express = require('express');
const router = express.Router();
const mongo = require('./data/mongo');

router.get('/articles', (req, res, next) => {
    let col = mongo.db.collection('articles');
    // let source = params.source;


    // if (!source) {
    //     res.status(400);
    //     res.send('No source specified');
    // }

    col.find({}).toArray((err, articles) => {
        res.send(articles);
    });
});


router.get('/sources', (req, res, next) => {
    let col = mongo.db.collection('sources');

    col.find({}).toArray((err, articles) => {
        res.send(articles);
    });
});

module.exports = router;