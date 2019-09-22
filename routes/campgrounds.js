var express = require("express")
var router = express.Router()
var Campground = require("../models/campground")
var middleware = require("../middleware")

// Campground Rputes
// Passport confifuration
// index
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err)
        } else {
        res.render("campgrounds/index", {campgrounds: allcampgrounds})   
    }
    })
    
    })

    router.post("/", middleware.isLoggedIn, function(req, res){
        // get data from form
       var name = req.body.name;
       var price = req.body.price;
       var image = req.body.image;
       var description = req.body.description;
       var author = {
           id: req.user._id,
           username: req.user.username
       }
       var newCampground = {name: name, price:price, image: image, description: description, author: author}
      
        // Create new campground and save to database
        Campground.create(newCampground, function(err, newcampground){
            if(err){
                console.log(err)
            } else {
                // redirect back to /campgrounds page
                console.log(newCampground)
                res.redirect("/campgrounds")
            }
        })
       
    })


    router.get("/new", middleware.isLoggedIn, function(req, res){
        res.render("campgrounds/new")
    })
// SHOW - Shows more info about a specific campground
router.get("/:id", function(req, res){
    // find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err)        
        } else {
            // render show template with that ID
            res.render("campgrounds/show", {campground: foundCampground})
        }
    })
    
})

// EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){    
        Campground.findById(req.params.id, function(err, foundCampground){
            // add flash here
        res.render("campgrounds/edit", {campground: foundCampground})
    })
})
// UPDATE ROUTE

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
//  find and update the correct campground
Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if(err){
        res.redirect("/campgorunds")
    } else {
        res.redirect("/campgrounds/" + req.params.id)
    }
})
// redirect somewhere (show page)
})

// Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndDelete(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds")
      }  else {
          res.redirect("/campgrounds")
      }
     })
})  

module.exports = router