var express = require('express');
var router = express.Router();

var db = require('../config/db');
var sql = require('mssql');
var GeoJSON = require('geojson')

/* GET home page. */
router.get('/', function (req, res, next) {

  sql.connect(db, function (err) {
    if (err)
      console.log(err);

    var request = new sql.Request();

    request.query('select * from Customer_evw', function (err, result) {

      if (err) {
        console.log(err)
        res.send(err);
      }
      // var rowsCount = result.rowsAffected;
      let data = result.recordset
     
      res.json(data)

      //res.json(GeoJSON.parse(data, {Point: ['lat', 'lng']}))

      //res.send(data)
      sql.close();
      /*res.render('index', {
        route: 'home',
        data: result.recordset
      });*/

    }); // request.query
  }); // sql.conn
});

/* GET Edit page. */
router.get('/edit/:id', function (req, res, next) {

  sql.connect(db, function (err) {
    if (err)
      console.log(err);

    var request = new sql.Request();
    request.input('id', sql.Int, req.params.id)
    request.query("select * from FAT_Relate_evw where OBJECTID=@id", function (err, result) {

      if (err) {
        console.log(err)
        res.send(err);
      }
      // var rowsCount = result.rowsAffected;
         res.send(result.recordsets)
      	sql.close();
  

    }); // request.query
  }); // sql.conn
});


/* POST Edit page. */
router.put('/update', function (req, res, next) {

  sql.connect(db, function (err) {
    if (err)
      console.log(err);

    var request = new sql.Request();
    request.input('OBJECTID', sql.Int, req.body.OBJECTID)
      .input('Tube', sql.NVarChar(50), req.body.Tube)
      .query('update FAT_Relate_evw set Tube=@Tube where OBJECTID=@OBJECTID', function (err, result) {

        if (err) {
          console.log(err);
          res.send(err);
        }
        sql.close();
       return res.redirect('/');
      });
  });

});

module.exports = router;
