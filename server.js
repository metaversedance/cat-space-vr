var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT|| 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/week18Populater";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

// Routes


function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

app.get("/scrape-cats", function(res,res){
//remove old
  db.CatPost.remove({}, function(err,removed) {
    if(err) {
      throw err;
      return;
    }
     // First, we grab the body of the html with request
    axios.get("http://icanhas.cheezburger.com/lolcats").then(function(response) {


        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $(".nw-post-asset").each(function(i, element) {
          // Save an empty result object
          var result = {};

          // Add the text and href of every link, and save them as properties of the result object
          result.imgSrc = $(this)
          .find(".resp-media")
          .attr("data-src")


          result.title = $(this)
            .find(".resp-media")
            .attr("title");

          result.link = $(this)
            .find(".js-img-link")
            .attr("href");

          result.position = {
            x: getRandomNumber(-10,10),
            y: getRandomNumber(-10,10),
            z: getRandomNumber(-10,10)
          }
          result.rotation = {
            x: 0,
            y: 0,
            z: 0
          }
          result.scale = {
            x: 2,
            y: 2,
            z: 2
          }

          // Create a new Article using the `result` object built from scraping
          db.CatPost
            .create(result)
            .then(function() {
              res.send("cat scraped!")

            })
            .catch(function(err) {
              // If an error occurred, send it to the client
              res.json(err);
            });
        });
      });
  })

});

app.get("/cats", function(req,res){
  db.CatPost.find({}).then(function(dbCats){
    res.json(dbCats)
  })
})

app.post("/update-cat-attributes/:id", function(req,res){
  var catAttr = req.body;
  console.log("body",req.body)

  console.log("position",catAttr.position)


  var newAttr = { 
    position: {
      x: catAttr.posX,
      y: catAttr.posY,
      z: catAttr.posZ
    },
    scale: {
      x: catAttr.scaleX,
      y: catAttr.scaleY,
      z: catAttr.scaleZ
    },
    rotation: {
      x: catAttr.rotX,
      y: catAttr.rotY,
      z: catAttr.rotZ      
    },
   }
  db.CatPost.findOneAndUpdate(
    { _id: req.params.id }, newAttr)
  .then(function(){
      res.end()
   });

})
 








// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
