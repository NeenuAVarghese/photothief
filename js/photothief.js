// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
/* global console: true, alert: true */

var main = function () {
    "use strict";

    /*
        Declare a set of variable for the Actions to make it easy to change
        Legend:
        variable with $ indicate a jQuery object
        variable without $ indicate normal variable
    */
    var navigationAction = ".pt_navAction";
    var signInOutAction = ".pt_signInOutAction";
    var signUpAction = ".pt_signUpAction";
    var demandsAction = ".pt_demandAction";

    // Function for the initial load of the page.
    function initialize() {

        // Load owlCarousel for slider 1.  Sample data pull from image 40 to 50
        $("#pt_photoSlider1").owlCarousel({
            jsonPath : "http://localhost:3000/photos?_start=40&_end=50",
            jsonSuccess : function (data) {
                // Call back function to process the photo data we pull
                data.forEach(function(image) {
                    var $img = $("<img>");
                    $img.attr("src", image.src);
                    $img.attr("alt", "images from json");
                    $("#pt_photoSlider1").append($img);
                });
            },
            autoPlay : 5000, //Set AutoPlay to 3 seconds
            items : 6,
            lazyLoad : true,
            itemsDesktop : [1199,5],
            itemsDesktopSmall : [979,3]
        });

        $("#pt_photoSlider2").owlCarousel({
            jsonPath : "http://localhost:3000/photos?_start=0&_end=10",
            jsonSuccess : function (data) {
                // Call back function to process the photo data we pull
                data.forEach(function(image) {
                    var $img = $("<img>");
                    $img.attr("src", image.src);
                    $img.attr("alt", "images from json");
                    $("#pt_photoSlider2").append($img);
                });
            },
            autoPlay : 5000, //Set AutoPlay to 3 seconds
            items : 6,
            lazyLoad : true,
            itemsDesktop : [1199,5],
            itemsDesktopSmall : [979,3]
        });



        // TODO: Any other tasks need to be done here to initialize page
    } // End iniitalize function


    // Event handler for Sign Up link
    $(navigationAction).on("click", signUpAction, function (event) {
        var $target = $(event.currentTarget);
        alert ("Action click:" + $target.text());

        // TODO: More code to handle the sign up

        // TODO: When successful, auto sign in the person

        // TODO: Maybe trigger auto sign in
        $(signInOutAction).trigger("click");
        // Needed to stop follow link
        return false;
    });

    // Event handler for SignIn and SignOut Link
    $(navigationAction).on("click", signInOutAction, function (event) {
        var $target = $(event.currentTarget);
        // Toggle the value from sign in to sign out on click
        var toggleValue;
        var successFlag = true;

        if ($target.text() === "Sign In") {
            toggleValue = "Sign Out";
            // TODO: Code to handle Sign In action
            alert ("Action click:" + $target.text());

            // TODO: More code here

            // Set successFlag
            successFlag = true;

            // Hide Sign Up Action
            $(signUpAction).hide();

        } else {
            toggleValue = "Sign In";

            // TODO: Code to handle Sign Out action
            alert ("Action click:" + $target.text());

            // TODO: More code here

            // set successFlag
            successFlag = true;

            // Show Sign Up Action
            $(signUpAction).fadeIn();
        }

        // Toggle Text only when the action is successfully handled
        if (successFlag) {
            $target.fadeOut("fast", function () {
                $(this).text(toggleValue);
                $(this).fadeIn();
            });
        }

        // Needed to stop follow link
        return false;
    });

    // Event handler event for demands Action
    $(navigationAction).on("click", demandsAction, function (event) {
        var $target = $(event.currentTarget);

        // TODO: code needed here to handle demands
        alert ("Action click: " + $target.text());


        // Need to stop follow Link
        return false;
    });

    // Call function to intitialize it here
    initialize();

};

$(document).ready(main);
