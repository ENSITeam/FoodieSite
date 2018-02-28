var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var url = 'mongodb://localhost:27017/test';
var choix={selectpicker:"pizza"};







var auth = function(req, res, next) {
  if (req.session && req.session.user === "amy" && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};

 
 router.get('/index',auth, function(req, res, next) {
  res.render('index');
});
// Login endpoint
router.post('/login', function (req, res) {
  console.log(req.body.username);
  console.log(req.body.pass);
  //if (!req.body.username || !req.body.password) {
   // res.send('login failed');    
  //} 
  /*else*/ if(req.body.username === "ensi" && req.body.pass === "ensipassword") {
    req.session.user = "amy";
    req.session.admin = true;
    //res.send("login success!");
    res.redirect('/index');



  }
});
 
// Logout endpoint
router.get('/logout', function (req, res) {
  req.session.destroy();
  //res.send("logout success!");
  res.redirect('/');

});
 
// Get content endpoint



































/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pass');
});
router.get('/reservation', function(req, res, next) {
  res.render('reservation');
});














router.post('/choix',auth, function(req, res, next) {
choix=req.body;
 //$('.selectpicker').selectpicker('refresh');
  // var data= JSON.stringify(choix.selectpicker);
   console.log(choix);
   if (choix.button === 'reservaton')
    {res.redirect('/reservation');}
    else{
      //res.redirect('/index');
        res.render('index',{name:choix.button});//,function(err, html) {
         // res.send(html);
        //console.log(html);
   // });

    }
});










router.get('/get-data-reservation',auth, function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('reservaton').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.render('reservation', {item:resultArray});
    });
  });
});
router.post('/delete-reservation',auth, function(req, res, next) {
  var id = req.body.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('reservaton').deleteOne({"_id": objectId(id)}, function(err, result) {
      assert.equal(null, err);
      console.log('Item deleted');
      db.close();
    });
  });
});

router.get('/get-data',auth, function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection(choix.button).find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
          res.render('index',{name:choix.button ,items: resultArray});// function(err, html) {
        //console.log(html);
//    });

      //res.render('index', {items: resultArray});
    });
  });
        // res.render('index',{items: resultArray} );//, function(err, html) {
        //console.log(html);
    //});
});

router.post('/insert',auth, function(req, res, next) {
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    image: req.body.image,
    Ingredient : "ing"+req.body.title,
    Prix : "prix"+req.body.title
  };

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection(choix.button).insertOne(item, function(err, result) {
      assert.equal(null, err);
      console.log('Item inserted');
      db.close();
    });
  });
  
   
  
  res.render('index',{name:choix.button});
});

router.post('/update',auth, function(req, res, next) {
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    image: req.body.image,
    postIngredient : "ing"+req.body.title,
    postPrix : "prix"+req.body.title
  };
  var id = req.body.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection(choix.button).updateOne({"_id": objectId(id)}, {$set: item}, function(err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
     res.render('index',{name:choix.button});//, function(err, html) {
        //console.log(html);
    
});

router.post('/delete',auth, function(req, res, next) {
  var id = req.body.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection(choix.selectpicker).deleteOne({"_id": objectId(id)}, function(err, result) {
      assert.equal(null, err);
      console.log('Item deleted');
      db.close();
    });
  });

       res.render('index',{name:choix.button});//, function(err, html) {
   
});


module.exports = router;
