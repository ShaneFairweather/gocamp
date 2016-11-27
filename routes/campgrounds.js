var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware')


router.get('/', function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

router.get('/new', middleware.isLoggedIn, function(req, res) {
    res.render('campgrounds/new')
});

router.get('/:id', function(req, res) {
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCamp) {
        if(err) {
            console.log(err);
        } else {
            res.render('campgrounds/show', {campground: foundCamp})
        }
    })
    
});


router.post('/', middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: description, author: author};
    //campgrounds.unshift(newCampground);
    Campground.create(newCampground, function(err, newCamp) {
        if(err) {
            console.log(err);
        } else {
            console.log(newCamp);
            res.redirect('/campgrounds');
        }
    })
});

// Edit Campground Route

router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render('campgrounds/edit', {campground: foundCampground});
    })
})


// Update Campground route

router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {
    //find and update correct campground then redirect
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
})


// Destroy Campground Route

router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    })
})


module.exports = router;
