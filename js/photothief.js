// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */

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

        var slider;
        var photoData;

        // TODO: pull data from JSON-Server here to get photoData
        photoData = "Get JSON Server data here and turn it into array";

        // Configured the BeaverSlider and pass photoData in
        slider = new BeaverSlider({
            type: "carousel",
            structure: {
                container: {
                    id: "pt_PhotosSlider",
                    width: 640,
                    height: 480
                }
            },
            content: {
                images: ["http://lorempixel.com/640/480/nature",
                "http://lorempixel.com/640/480/animals",
                "http://lorempixel.com/640/480/cats"]
            },
            animation: {
                effects: effectSets["carousel: slideOver"],
                interval: 4000,
                initialInterval: 4000,
                waitAllImages: true
            }
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
