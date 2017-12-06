var express = require('express');
var router = express.Router();
var path = require('path');

// // Connect string to MySQL
// var mysql = require('mysql');
// var connection = mysql.createConnection({
//   host     : 'fling.seas.upenn.edu',
//   user     : 'shuangl',
//   password : '',
//   database : 'shuangl'
// });

/* GET home page. */
router.get('/', function(req, res, next) {
  template = require('jade').compileFile(path.join(__dirname, '../', '/source/templates/homepage.jade'));
  //res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
  try {
    var html = template({ title: 'Home' })
    res.send(html)
  } catch (e) {
    next(e)
  }
});

router.get('/find', function(req, res, next) {
  template = require('jade').compileFile(path.join(__dirname, '../',  '/source/templates/findpage.jade'));
  //res.sendFile(path.join(__dirname, '../', 'views', 'reference.html'));
  try {
    var html = template({ title: 'Find' })
    res.send(html)
  } catch (e) {
    next(e)
  }

});

router.get('/recommend', function(req, res, next) {
  template = require('jade').compileFile(path.join(__dirname, '../',  '/source/templates/recommendpage.jade'));
  //res.sendFile(path.join(__dirname, '../', 'views', 'insert.html'));
  try {
    var html = template({ title: 'Recommend' })
    res.send(html)
  } catch (e) {
    next(e)
  }

});

router.get('/addition', function(req, res, next) {
  template = require('jade').compileFile(path.join(__dirname, '../',  '/source/templates/additionpage.jade'));
  //res.sendFile(path.join(__dirname, '../', 'views', 'insert.html'));
  try {
    var html = template({ title: 'Addition' })
    res.send(html)
  } catch (e) {
    next(e)
  }

});

router.get('/recommendmusic', function(req, res, next) {
  template = require('jade').compileFile(path.join(__dirname, '../',  '/source/templates/recommendmusicpage.jade'));
  //res.sendFile(path.join(__dirname, '../', 'views', 'insert.html'));
  try {
    var html = template({ title: 'music' })
    res.send(html)
  } catch (e) {
    next(e)
  }

});

router.post('/findsearchnew', function(req, res, next) {
  template = require('jade').compileFile(path.join(__dirname, '../',  '/source/templates/findsearchnewpage.jade'));
  var html = template({ title: 'Find' })
  res.send(html);
});

// router.get('/data/:email', function(req,res) {
//   // use console.log() as print() in case you want to debug, example below:
//   // console.log("inside person email");
//   var query = 'SELECT * from (SELECT Person.login, name, sex, relationshipStatus, birthyear, COUNT(DISTINCT friend) AS numberOfFriends from Person LEFT JOIN Friends ON Person.login = Friends.login GROUP BY Person.login) AS tempTable';
//   // you may change the query during implementation
//   var email = req.params.email;
//   if (email != 'undefined') query = query + ' where login ="' + email + '"';
//   console.log(query);
//   connection.query(query, function(err, rows, fields) {
//     if (err) console.log(err);
//     else {
//         res.json(rows);
//     }  
//     });
// });

// // ----Your implemention of route handler for "Insert a new record" should go here-----

// router.get('/insert/:param', function(req, res) {
//   // use console.log() as print() in case you want to debug, example below:
//   // console.log("inside person email");
//   var query = 'INSERT INTO Person VALUES(';
//   // you may change the query during implementation
//   //var login = req.params.login;
//   //var name = req.params.name;
//   //var sex = req.params.sex;
//   //var RelationshipStatus = req.params.RelationshipStatus;
//   //var Birthyear = req.params.Birthyear;
//   var param = req.params.param;
//   //query = query + 'VALUES("'+login+'","'+name+'","'+sex+'","'+RelationshipStatus+'","'+Birthyear+'")';
//   query = query + param + ')';
//   console.log(query);
//   connection.query(query, function(err, rows, fields) {
//     if (err) console.log(err);
//     else {
//         res.json(rows);
//     }  
//     });
// });


module.exports = router;