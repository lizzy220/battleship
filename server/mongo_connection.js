//need to be replaced by new mlab account
var MongoClient = require('mongodb').MongoClient;
var mongoURI = 'mongodb://ec2-54-175-174-41.compute-1.amazonaws.com:80/'
var db_name = "5117-individual"
var db_user = "5117user"
var db_pswd = "5117pass"
var x500 = "lixx3524";
var db;
var connect = function(callback){
  if(db){
    callback(err,db)
  }else{
    MongoClient.connect(mongoURI + db_name, function(err, db){
      db.authenticate(db_user, db_pswd, function(err, result) {
        if (err) {
          throw err;
        }
        else {
          console.log("Connected successfully to mongodb");
          callback(err,db)
        }
      })
    });
  }
}

module.exports.connect = connect
