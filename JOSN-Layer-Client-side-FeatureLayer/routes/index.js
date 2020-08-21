var express = require('express');
var router = express.Router();

var db = require('../config/db');
var sql = require('mssql');
var GeoJSON = require('geojson')

 const pool = new sql.ConnectionPool(db)
/* GET home page. */

async function getcustomerdata(req,res){
    // config for your database

      await pool.connect().then(function(err){
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request(pool);
           
        // query to the database and get the records
         request.query("SELECT * FROM Customer_evw", function (err, result) {
            if (err) {
            console.log(err)
            res.send(err);
          }
          else {
             result.recordsets.forEach(i => {
                res.send(i)
              })
            /*  for(i=0;i<result.recordsets.length;i++) {
                  res.send(result.recordsets[i])
                  //res.send(GeoJSON.parse(result.recordsets[i], {Point: ['lat', 'lng']}))
              }*/
                pool.close()
            }
            
        });
       
    });
  
}

async function getdc(req,res){
    // config for your database

      await pool.connect().then(function(err){
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request(pool);
           
        // query to the database and get the records
        request.query('select * from DC_ODB_evw', function (err, result) {
            if (err) {
            console.log(err)
            res.send(err);
          }
          else {
             result.recordsets.forEach(i => {
                res.send(i)
              })
            /*  for(i=0;i<result.recordsets.length;i++) {
                  res.send(result.recordsets[i])
                  //res.send(GeoJSON.parse(result.recordsets[i], {Point: ['lat', 'lng']}))
              }*/
                pool.close()
            }
            
        });
        
    });
  
}
router.get('/', getcustomerdata);

router.get('/dc', getdc);

router.get('/fiber', function (req, res, next) {

  sql.connect(db, function (err) {
    if (err)
      console.log(err);

    var request = new sql.Request();

    request.query('select * from Fiber_evw', function (err, result) {

      if (err) {
        console.log(err)
        res.send(err);
      }
       else {

              for(i=0;i<result.recordsets.length;i++) {
                  res.send(result.recordsets[i])
              }

            }

      //res.json(GeoJSON.parse(result.recordset, {Point: ['lat', 'lng']}))
      sql.close();

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
    request.query("select * from FAT_evw where OBJECTID=@id", function (err, result) {

      if (err) {
        console.log(err)
        res.send(err);
      }
      // var rowsCount = result.rowsAffected;
       else {

              for(i=0;i<result.recordsets.length;i++) {
                  res.send(result.recordsets[i])
              }

            }
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

router.post('/post', function (req, res, next) {

  sql.connect(db, function (err) {
    if (err)
      console.log(err);

    var request = new sql.Request();
    request.input('OBJECTID', sql.Int, req.body.OBJECTID)
      .input('Tube', sql.NVarChar(50), req.body.Tube)
      .query('insert into Pole_evw (Name,Email,Password) ', function (err, result) {

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
