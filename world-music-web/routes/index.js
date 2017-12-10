
var express = require('express');
var router = express.Router();
var path1 = require('path');
var mysql = require('mysql');

var https = require('https');
var subscriptionKey = 'ca99f77c6dbd460cb89a73353941b9e7';
var host = 'api.cognitive.microsoft.com';
var path = '/bing/v7.0/search';
/* GET home page. */
router.get('/', function(req, res, next) {
  template = require('jade').compileFile(path1.join(__dirname, '../', '/source/templates/homepage.jade'));
  //res.sendFile(path1.join(__dirname, '../', 'views', 'index.html'));
  try {
    var html = template({ title: 'Home' })
    res.send(html)
  } catch (e) {
    next(e)
  }
});

var getJSON = function (search, onResult){
  console.log('Searching the Web for: ' + search);
  var request_params = {
        method : 'GET',
        hostname : host,
        path : path + '?q=' + encodeURIComponent(search),
        headers : {
            'Ocp-Apim-Subscription-Key' : subscriptionKey,
        }
    };
  var reques = https.request(request_params, function (response) {
    body = '';
    response.on('data', function (d) {
        body += d;
    });
    response.on('end', function () {
        console.log('\nRelevant Headers:\n');
        for (var header in response.headers)
            // header keys are lower-cased by Node.js
            if (header.startsWith("bingapis-") || header.startsWith("x-msedge-"))
                 console.log(header + ": " + response.headers[header]);
        //body = JSON.stringify(JSON.parse(body), null, '  ');
        body = JSON.parse(body);
        onResult(response.statusCode, body);
        //console.log('\nJSON Response:\n');
        //console.log(body.webPages.value);

    });
    response.on('error', function (e) {
        console.log('Error: ' + e.message);
    });
  });
  reques.end();
}


router.post('/bingpage', function(req, res, next) {
  var term = req.body.info;
  //console.log(this.body.webPages.value);
  if (subscriptionKey.length === 32) {
    //bing_web_search(term);
    getJSON(term, function(statusCode, result) {
      template = require('jade').compileFile(path1.join(__dirname, '../',  '/source/templates/bingpage.jade'));
      // I could work with the result html/json here.  I could also just return it
      //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
      //res.statusCode = statusCode;
      //console.log('\nJSON Response:\n');
      //console.log(result.webPages.value);

      try {
        var html = template({ title: 'Bing' , rows: result.webPages.value})
        res.send(html)
      } catch (e) {
        next(e)
      }
      //res.send(result);
    });

  } else {
      console.log('Invalid Bing Search API subscription key!');
      console.log('Please paste yours into the source code.');
  }

});


router.get('/find', function(req, res, next) {
  template = require('jade').compileFile(path1.join(__dirname, '../',  '/source/templates/findpage.jade'));
  //res.sendFile(path1.join(__dirname, '../', 'views', 'reference.html'));
  // console.log(req.body)
  // if(req.body.all){
  //   var song = req.body.song;
  //   var singer = req.body.singer;
  //   console.log(song);
  //   console.log()
  // }
  // var e = document.getElementById("typeselect");
  // var value = e.options[e.selectedIndex].value;
  // var strUser = e.options[e.selectedIndex].text;
  // if(text == "songandsinger")
  //   console.log(song);


  try {
    var html = template({ title: 'Find' })
    res.send(html)
  } catch (e) {
    next(e)
  }

});

router.get('/recommend', function(req, res, next) {
  template = require('jade').compileFile(path1.join(__dirname, '../',  '/source/templates/recommendpage.jade'));
  //res.sendFile(path1.join(__dirname, '../', 'views', 'insert.html'));
  try {
    var html = template({ title: 'Recommend' })
    res.send(html)
  } catch (e) {
    next(e)
  }

});


// router.get('/facebook', function(req, res, next) {
//   template = require('jade').compileFile(path1.join(__dirname, '../',  '/source/templates/login.jade'));
//   //res.sendFile(path1.join(__dirname, '../', 'views', 'insert.html'));
//   try {
//     var html = template({ title: 'Login With Facebook' })
//     res.send(html)
//   } catch (e) {
//     next(e)
//   }

// });

router.get('/addition', function(req, res, next) {
  template = require('jade').compileFile(path1.join(__dirname, '../',  '/source/templates/additionpage.jade'));
  //res.sendFile(path1.join(__dirname, '../', 'views', 'insert.html'));
  try {
    var html = template({ title: 'Addition' })
    res.send(html)
  } catch (e) {
    next(e)
  }

});

router.post('/addsuccess', function(req, res, next) {
  var songname = req.body.song;
  var singername =req.body.singer;
  var albumname = req.body.album;

  var connection = mysql.createConnection({
    host     : "cis550project.cod7doq3mxuo.us-west-1.rds.amazonaws.com",
    user     : "CIS550Project",
    password : "CIS550Project",
    port     : "3306",
    database : "innodb"
  });

  console.log(req.body.song);
  template = require('jade').compileFile(path1.join(__dirname, '../',  '/source/templates/additionsuccess.jade'));
  var randomNumberBetween0and19 = Math.floor(Math.random() * 200000000);
  console.log(randomNumberBetween0and19);
  var sql = 'INSERT INTO songs (track_id, title,artist_name, release_album) VALUES ("'+randomNumberBetween0and19+'", "'+songname+'", "'+singername+'", "'+albumname+'")';

  connection.query(sql, function(err, rows, fields) {
    if (err) throw err;
    //console.log(rows[1].title);
    //var rows = rows[1];
    //var row2 = rows.rows.item(1);
    //console.log(rows.rows.item(1));
    var html = template({ title: 'MUSIC'})
    res.send(html);
    //res.render('findsearchnew', { title: 'Users', rows: rows });
  });


});

router.post('/findsearchnew', function(req, res, next) {
  var connection = mysql.createConnection({
    host     : "cis550project.cod7doq3mxuo.us-west-1.rds.amazonaws.com",
    user     : "CIS550Project",
    password : "CIS550Project",
    port     : "3306",
    database : "innodb"
  });
  console.log(req.body.song);
  var songname = req.body.song;
  var singername =req.body.singer;
  var genrename = req.body.genre;
  var albumname = req.body.album;


  if(req.body.typeselect =='genre'){

    var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://cis550:CIS550Project@ds133776.mlab.com:33776/nosqldb", function(err, db) {
  // if(!err) {
  //     db.collection("genres").find({title: genrename}).toArray(function(err, result) {
  //       if (err){
  //         throw err;
  //       }
  //       console.log(result);
  //       template = require('jade').compileFile(path1.join(__dirname, '../',  '/source/templates/findsearchnewpage.jade'));
  //       var html = template({ title: 'MUSIC', rows: result})
  //       res.send(html);
  //     });  
      // console.log("We are connected");


      if(!err) {
        const mDB = db.db('nosqldb');
        //var regex_genrename = new RegExp(["^", genrename, "$"].join(""), "i");
        console.log("track_genres:" + "[{'genre_id': '10', 'genre_title':" + genrename + ", 'genre_url': 'http://freemusicarchive.org/genre/Pop/'}]");

      mDB.collection("raw_tracks").find({"track_genres": "[{'genre_id': '10', 'genre_title': '" + genrename + "', 'genre_url': 'http://freemusicarchive.org/genre/Pop/'}]"}).sort({track_listens:-1}).limit(10).toArray(function(err, result) {
        if (err){
          throw err;
        }
        console.log(result);
        template = require('jade').compileFile(path1.join(__dirname, '../',  '/source/templates/findsearchnewpage.jade'));
        var html = template({ title: 'MUSIC', rows: result})
        res.send(html);
      });  
      console.log("We are connected");
  }
  //     if(!err) {
  //       const mDB = db.db('nosqldb');
  //       //var regex_genrename = new RegExp(["^", genrename, "$"].join(""), "i");
  //       console.log();

  //     mDB.collection("raw_tracks").find({"track_genres": { $elemMatch: { genre_title: genrename } }}).sort({track_listens:-1}).limit(10).toArray(function(err, result) {
  //       if (err){
  //         throw err;
  //       }
  //       console.log(result);
  //       template = require('jade').compileFile(path1.join(__dirname, '../',  '/source/templates/findsearchnewpage.jade'));
  //       var html = template({ title: 'MUSIC', rows: result})
  //       res.send(html);
  //     });  
  //     console.log("We are connected");
  // }

});
}
  //var sql = 'SELECT title from genres';
  // var sql = 'SELECT artist_name from songs where title ="'+ songname+ '"';

  // template = require('jade').compileFile(path1.join(__dirname, '../',  '/source/templates/findsearchnewpage.jade'));
  
  // //res.send(html);
  // connection.query(sql, function(err, rows, fields) {
  //   if (err) throw err;
  //   var html = template({ title: 'L\'équipe', rows: rows })
  //   res.send(html);
  //   //res.render('findsearchnew', { title: 'Users', rows: rows });
  // });

if(req.body.typeselect == 'songandsinger'){
   var MongoClient = require('mongodb').MongoClient;
   MongoClient.connect("mongodb://cis550:CIS550Project@ds133776.mlab.com:33776/nosqldb", function(err, db){
    if(!err) {
        const mDB = db.db('nosqldb');
        //var regex_genrename = new RegExp(["^", genrename, "$"].join(""), "i");
        console.log();

      mDB.collection("raw_tracks").find({$and: [{"artist_name": singername},{"track_title": songname}]}).toArray(function(err, result) {
        if (err){
          throw err;
        }
        console.log(result);
        template = require('jade').compileFile(path1.join(__dirname, '../',  '/source/templates/findsearchnewpage.jade'));
        var html = template({ title: 'MUSIC', rows: result})
        res.send(html);
      });  
      console.log("We are connected");
    }

   });

}

if(req.body.typeselect == 'album'){
   var MongoClient = require('mongodb').MongoClient;
   MongoClient.connect("mongodb://cis550:CIS550Project@ds133776.mlab.com:33776/nosqldb", function(err, db){
    if(!err) {
        const mDB = db.db('nosqldb');
        //var regex_genrename = new RegExp(["^", genrename, "$"].join(""), "i");
        console.log();

      mDB.collection("raw_tracks").find({album_title: albumname}).toArray(function(err, result) {
        if (err){
          throw err;
        }
        console.log(result);
        template = require('jade').compileFile(path1.join(__dirname, '../',  '/source/templates/findsearchnewpage.jade'));
        var html = template({ title: 'MUSIC', rows: result})
        res.send(html);
      });  
      console.log("We are connected");
    }

   });

}

if(req.body.typeselect == 'all'){
   var MongoClient = require('mongodb').MongoClient;
   MongoClient.connect("mongodb://cis550:CIS550Project@ds133776.mlab.com:33776/nosqldb", function(err, db){
    if(!err) {
        const mDB = db.db('nosqldb');
        //var regex_genrename = new RegExp(["^", genrename, "$"].join(""), "i");
        console.log();

      mDB.collection("raw_tracks").find({$and: [{"artist_name": singername},{"track_title": songname},{album_title: albumname}]}).toArray(function(err, result) {
        if (err){
          throw err;
        }
        console.log(result);
        template = require('jade').compileFile(path1.join(__dirname, '../',  '/source/templates/findsearchnewpage.jade'));
        var html = template({ title: 'MUSIC', rows: result})
        res.send(html);
      });  
      console.log("We are connected");
    }

   });

}


});

router.get('/recommendmusic1', function(req, res, next) {
  var connection = mysql.createConnection({
    host     : "cis550project.cod7doq3mxuo.us-west-1.rds.amazonaws.com",
    user     : "CIS550Project",
    password : "CIS550Project",
    port     : "3306",
    database : "innodb"
  });

  //var sql = 'select title, artist_name, year, artist_hotttnesss from songs order by artist_hotttnesss desc limit 1';
  //var sql = 'select DISTINCT title, artist_name, year, artist_hotttnesss, mbtag from songs LEFT JOIN artist_mbtag ON songs.artist_id = artist_mbtag.artist_id order by artist_hotttnesss desc limit 1';
  var sql = 'select DISTINCT title, artist_name, year, artist_hotttnesss, artist_mbtag.mbtag from songs LEFT JOIN artist_mbtag ON songs.artist_id = artist_mbtag.artist_id GROUP BY artist_name order by artist_hotttnesss desc limit 9';
  template = require('jade').compileFile(path1.join(__dirname, '../',  '/source/templates/recommendmusicpage1.jade'));
  //res.sendFile(path1.join(__dirname, '../', 'views', 'insert.html'));
  connection.query(sql, function(err, rows, fields) {
    if (err) throw err;
    //console.log(rows[1].title);
    //var rows = rows[1];
    //var row2 = rows.rows.item(1);
    //console.log(rows.rows.item(1));
    var html = template({ title: 'MUSIC', rows: rows})
    res.send(html);
    //res.render('findsearchnew', { title: 'Users', rows: rows });
  });

});

router.get('/recommendmusic2', function(req, res, next) {
  var connection = mysql.createConnection({
    host     : "cis550project.cod7doq3mxuo.us-west-1.rds.amazonaws.com",
    user     : "CIS550Project",
    password : "CIS550Project",
    port     : "3306",
    database : "innodb"
  });

  //var sql = 'select title, artist_name, year, artist_hotttnesss from songs order by artist_hotttnesss desc limit 1';
  var sql = 'select DISTINCT title, artist_name, year, artist_hotttnesss, artist_mbtag.mbtag from songs LEFT JOIN artist_mbtag ON songs.artist_id = artist_mbtag.artist_id GROUP BY artist_name order by artist_hotttnesss desc limit 9';

  template = require('jade').compileFile(path1.join(__dirname, '../',  '/source/templates/recommendmusicpage2.jade'));
  //res.sendFile(path1.join(__dirname, '../', 'views', 'insert.html'));
  connection.query(sql, function(err, rows, fields) {
    if (err) throw err;
    var html = template({ title: 'MUSIC', rows: rows})
    res.send(html);
    //res.render('findsearchnew', { title: 'Users', rows: rows });
  });

});

router.get('/recommendmusic3', function(req, res, next) {
  var connection = mysql.createConnection({
    host     : "cis550project.cod7doq3mxuo.us-west-1.rds.amazonaws.com",
    user     : "CIS550Project",
    password : "CIS550Project",
    port     : "3306",
    database : "innodb"
  });

  //var sql = 'select title, artist_name, year, artist_hotttnesss from songs order by artist_hotttnesss desc limit 1';
  var sql = 'select DISTINCT title, artist_name, year, artist_hotttnesss, artist_mbtag.mbtag from songs LEFT JOIN artist_mbtag ON songs.artist_id = artist_mbtag.artist_id GROUP BY artist_name order by artist_hotttnesss desc limit 9';

  template = require('jade').compileFile(path1.join(__dirname, '../',  '/source/templates/recommendmusicpage3.jade'));
  //res.sendFile(path1.join(__dirname, '../', 'views', 'insert.html'));
  connection.query(sql, function(err, rows, fields) {
    if (err) throw err;
    var html = template({ title: 'MUSIC', rows: rows})
    res.send(html);
    //res.render('findsearchnew', { title: 'Users', rows: rows });
  });

});

router.get('/recommendmusic4', function(req, res, next) {
  var connection = mysql.createConnection({
    host     : "cis550project.cod7doq3mxuo.us-west-1.rds.amazonaws.com",
    user     : "CIS550Project",
    password : "CIS550Project",
    port     : "3306",
    database : "innodb"
  });

  //var sql = 'select title, artist_name, year, artist_hotttnesss from songs order by artist_hotttnesss desc limit 1';
  var sql = 'select DISTINCT title, artist_name, year, artist_hotttnesss, artist_mbtag.mbtag from songs LEFT JOIN artist_mbtag ON songs.artist_id = artist_mbtag.artist_id GROUP BY artist_name order by artist_hotttnesss desc limit 9';

  template = require('jade').compileFile(path1.join(__dirname, '../',  '/source/templates/recommendmusicpage4.jade'));
  //res.sendFile(path1.join(__dirname, '../', 'views', 'insert.html'));
  connection.query(sql, function(err, rows, fields) {
    if (err) throw err;
    var html = template({ title: 'MUSIC', rows: rows})
    res.send(html);
    //res.render('findsearchnew', { title: 'Users', rows: rows });
  });

});

router.get('/recommendmusic5', function(req, res, next) {
  var connection = mysql.createConnection({
    host     : "cis550project.cod7doq3mxuo.us-west-1.rds.amazonaws.com",
    user     : "CIS550Project",
    password : "CIS550Project",
    port     : "3306",
    database : "innodb"
  });

  //var sql = 'select title, artist_name, year, artist_hotttnesss from songs order by artist_hotttnesss desc limit 1';
  var sql = 'select DISTINCT title, artist_name, year, artist_hotttnesss, artist_mbtag.mbtag from songs LEFT JOIN artist_mbtag ON songs.artist_id = artist_mbtag.artist_id GROUP BY artist_name order by artist_hotttnesss desc limit 9';

  template = require('jade').compileFile(path1.join(__dirname, '../',  '/source/templates/recommendmusicpage5.jade'));
  //res.sendFile(path1.join(__dirname, '../', 'views', 'insert.html'));
  connection.query(sql, function(err, rows, fields) {
    if (err) throw err;
    var html = template({ title: 'MUSIC', rows: rows})
    res.send(html);
    //res.render('findsearchnew', { title: 'Users', rows: rows });
  });

});

router.get('/recommendmusic6', function(req, res, next) {
  var connection = mysql.createConnection({
    host     : "cis550project.cod7doq3mxuo.us-west-1.rds.amazonaws.com",
    user     : "CIS550Project",
    password : "CIS550Project",
    port     : "3306",
    database : "innodb"
  });

  //var sql = 'select title, artist_name, year, artist_hotttnesss from songs order by artist_hotttnesss desc limit 1';
  var sql = 'select DISTINCT title, artist_name, year, artist_hotttnesss, artist_mbtag.mbtag from songs LEFT JOIN artist_mbtag ON songs.artist_id = artist_mbtag.artist_id GROUP BY artist_name order by artist_hotttnesss desc limit 9';

  template = require('jade').compileFile(path1.join(__dirname, '../',  '/source/templates/recommendmusicpage6.jade'));
  //res.sendFile(path1.join(__dirname, '../', 'views', 'insert.html'));
  connection.query(sql, function(err, rows, fields) {
    if (err) throw err;
    var html = template({ title: 'MUSIC', rows: rows})
    res.send(html);
    //res.render('findsearchnew', { title: 'Users', rows: rows });
  });

});

router.get('/recommendmusic7', function(req, res, next) {
  var connection = mysql.createConnection({
    host     : "cis550project.cod7doq3mxuo.us-west-1.rds.amazonaws.com",
    user     : "CIS550Project",
    password : "CIS550Project",
    port     : "3306",
    database : "innodb"
  });

  //var sql = 'select title, artist_name, year, artist_hotttnesss from songs order by artist_hotttnesss desc limit 1';
  var sql = 'select DISTINCT title, artist_name, year, artist_hotttnesss, artist_mbtag.mbtag from songs LEFT JOIN artist_mbtag ON songs.artist_id = artist_mbtag.artist_id GROUP BY artist_name order by artist_hotttnesss desc limit 9';

  template = require('jade').compileFile(path1.join(__dirname, '../',  '/source/templates/recommendmusicpage7.jade'));
  //res.sendFile(path1.join(__dirname, '../', 'views', 'insert.html'));
  connection.query(sql, function(err, rows, fields) {
    if (err) throw err;
    var html = template({ title: 'MUSIC', rows: rows})
    res.send(html);
    //res.render('findsearchnew', { title: 'Users', rows: rows });
  });

});

router.get('/recommendmusic8', function(req, res, next) {
  var connection = mysql.createConnection({
    host     : "cis550project.cod7doq3mxuo.us-west-1.rds.amazonaws.com",
    user     : "CIS550Project",
    password : "CIS550Project",
    port     : "3306",
    database : "innodb"
  });

  //var sql = 'select title, artist_name, year, artist_hotttnesss from songs order by artist_hotttnesss desc limit 1';
  var sql = 'select DISTINCT title, artist_name, year, artist_hotttnesss, artist_mbtag.mbtag from songs LEFT JOIN artist_mbtag ON songs.artist_id = artist_mbtag.artist_id GROUP BY artist_name order by artist_hotttnesss desc limit 9';

  template = require('jade').compileFile(path1.join(__dirname, '../',  '/source/templates/recommendmusicpage8.jade'));
  //res.sendFile(path1.join(__dirname, '../', 'views', 'insert.html'));
  connection.query(sql, function(err, rows, fields) {
    if (err) throw err;
    var html = template({ title: 'MUSIC', rows: rows})
    res.send(html);
    //res.render('findsearchnew', { title: 'Users', rows: rows });
  });

});

router.get('/recommendmusic9', function(req, res, next) {
  var connection = mysql.createConnection({
    host     : "cis550project.cod7doq3mxuo.us-west-1.rds.amazonaws.com",
    user     : "CIS550Project",
    password : "CIS550Project",
    port     : "3306",
    database : "innodb"
  });

  //var sql = 'select title, artist_name, year, artist_hotttnesss from songs order by artist_hotttnesss desc limit 1';
  var sql = 'select DISTINCT title, artist_name, year, artist_hotttnesss, artist_mbtag.mbtag from songs LEFT JOIN artist_mbtag ON songs.artist_id = artist_mbtag.artist_id GROUP BY artist_name order by artist_hotttnesss desc limit 9';

  template = require('jade').compileFile(path1.join(__dirname, '../',  '/source/templates/recommendmusicpage9.jade'));
  //res.sendFile(path1.join(__dirname, '../', 'views', 'insert.html'));
  connection.query(sql, function(err, rows, fields) {
    if (err) throw err;
    var html = template({ title: 'MUSIC', rows: rows})
    res.send(html);
    //res.render('findsearchnew', { title: 'Users', rows: rows });
  });

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