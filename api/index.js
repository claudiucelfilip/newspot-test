const express = require('express');
const router = express.Router();
const mongo = require('./data/mongo');

router.get('/articles', (req, res, next) => {
    let col = mongo.db.collection('articles');


    col.find({}).toArray((err, articles) => {
        res.send(articles);
    });
});


router.get('/articles/:skip/:limit', (req, res, next) => {
    let col = mongo.db.collection('articles');
    
    console.log(req.params);
    let options = {
        skip: parseInt(req.params.skip || 0),
        limit: parseInt(req.params.limit || 0)
    };

    col.find({}, options).toArray((err, articles) => {
        if (err) {
            res.status(400);
            res.send(err);
        }
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