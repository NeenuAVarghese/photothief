// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
/* global alert: true, console: true, componentHandler: true */

var main = function () {
    "use strict";

    /*
        Change the individual variable into a object with tree structure like
        this allow us to group all the fields, actions and allow easy access
        to the individual item accordingly.

        i.e. to select the login button: $($pt.landPage.login)

    */
    var $pt = {
        landPage: {
            navbar : ".pt_navAction",
            content: ".pt_landPage-content",
            login : ".pt_openLoginCardAction",
            logout : ".pt_logOutAction",
            signup : ".pt_openSignupCardAction",
            demand : ".pt_demandAction",
            loginInfo: ".pt_landPage-loginInfo",
            authenId: "#pt_authenticated_Id",
            authenEmail: "#pt_authenticated_Email"
        },

        loginCard: {
            handle: ".pt_loginCard",
            userId : "#pt_loginCard-loginId",
            userPass: "#pt_loginCard-loginPassword",
            revealPass: "#pt_loginCard-revealPassword",
            login: ".pt_loginAction",
            errorStatus: "#pt_loginCard-errorMessage"
        }
    };

    // Function to load the Picture Carousel with specified AJAX source
    // and the sliderId
    function loadCarousel($sliderId, source) {
        // Load owlCarousel for slider 1.  Sample data pull from image 40 to 60
        $($sliderId).owlCarousel({
            jsonPath : source,
            jsonSuccess : function (data) {
                // Call back function to process the photo data we pull
                data.forEach(function(image) {
                    var $img = $("<img>");
                    $img.attr("src", image.src);
                    $img.attr("alt", "images from json");
                    $($sliderId).append($img);
                });
            },
            navigation: true,
            navigationText: [
              "<i class='material-icons'>navigate_before</i>",
              "<i class='material-icons'>navigate_next</i>" ],
            autoPlay : 5000, //Set AutoPlay to 3 seconds
            items : 8,
            lazyLoad : true,
            itemsDesktop : [1199,5],
            itemsDesktopSmall : [979,3]
        });
    }

    // Function for the initial load of the page.
    function initialize() {

        // TODO: More code to handle the sign up
        var $template = $("<div class=\"mdl-grid\">").hide();

        // We define the carousel object
        var carousel = {
            mostWanted: {
                slider: "#pt_photoSlider1",
                source: "http://localhost:3000/photos?_start=40&_end=60"
            },
            newestUpload: {
                slider: "#pt_photoSlider2",
                source: "http://localhost:3000/photos?_start=0&_end=30"
            }
        };

        // Use AJAX to load in the template file with the main carousel
        $template.load("templates/main.tmpl", function (result, status) {
            if (status === "success") {
                // Empty all stuff inside the land page content
                $($pt.landPage.content).empty();
                // Add the newly add template login into the land page content
                $($pt.landPage.content).append($template);

                // MDL update it
                componentHandler.upgradeAllRegistered();

                // Loop to load carousel
                for (var key in carousel) {
                    if (carousel.hasOwnProperty(key)) {
                        var slider = carousel[key].slider;
                        var source = carousel[key].source;
                        loadCarousel(slider, source);
                    }
                }

                // Show the carousel
                $template.fadeIn(300);

            } else {
                // Encountered error
                console.log(status, "Unable to load templates/main.tmpl");
            }
        });

        // TODO: Any other tasks need to be done here to initialize page
    } // End iniitalize function

    function processSuccessLogin(result) {
        // Success Login save the id and the loginId to the footer
        // Can't save to session or anything here
        $($pt.landPage.authenId).text(result[0].id);
        $($pt.landPage.authenEmail).text(result[0].email);

        // We hide the loginCard
        $($pt.loginCard.handle).fadeOut(300).remove();
        // Hide signup button
        $($pt.landPage.signup).fadeOut();
        // Toggle the login Button to say logout
        $($pt.landPage.login).addClass(($pt.landPage.logout).substr(1));
        $($pt.landPage.login).text("Logout");
        $($pt.landPage.login).removeClass(($pt.landPage.login).substr(1));

        // Reload the main page with carousel
        initialize();
    }
    // Function to handle the loginCard login button
    function handleLoginAction() {
        //var $target = $(event.currentTarget);
        // Grab all the fields on the login Card
        var $userId = $($pt.loginCard.userId);
        var $userPass = $($pt.loginCard.userPass);
        var $revealPass = $($pt.loginCard.revealPass);
        var $errorStatus = $($pt.loginCard.errorStatus);

        if ($userId.val().trim() === "" || $userPass.val().trim() === "") {
            // Empty login Information
            $errorStatus.text("Either User or Password is empty");
            return false;
        }

        // Build the JSON urlHost
        var urlHost = "http://localhost:3000/users";
        urlHost += "?loginId=" + $userId.val().trim();
        urlHost += "&password=" + $userPass.val().trim();

        // Clear input boxes
        $errorStatus.text("");
        $userId.val("");
        $userId.parent().removeClass("is-dirty");
        $userPass.val("");
        $userPass.parent().removeClass("is-dirty");
        // Reset the show password checkbox and also the password type
        if ($revealPass.is(":checked") === true) {
            $revealPass.prop("checked", false);
            $revealPass.parent().removeClass("is-checked");
            $userPass.prop("type", "password");
        }

        // TODO:  Perform AJAX to check data here
        $.ajax({
            url: urlHost,
            type: "json",
            method: "GET",
            success: function (result) {
                // result is an array if it return
                if (result.length === 0) {
                    // Failed login
                    $($pt.loginCard.errorStatus).text("Invalid Login Information");
                    return false;
                } else if (result.length === 1) {
                    processSuccessLogin(result);
                }
            },
            error: function (result) {
                console.log("ajax error " + result.status);
            }
        });
    }

    // Event handler for Sign Up link
    $($pt.landPage.signup).on("click", function (event) {
        var $target = $(event.currentTarget);
        alert ("Action click:" + $target.text());

        // TODO: More code to handle the sign up

        // TODO: When successful, auto sign in the person

        // TODO: Maybe trigger auto sign in
        // $(signInOutAction).trigger("click");
        // Needed to stop follow link
        return false;
    });

    // Even handler for Login Link
    $($pt.landPage.navbar).on("click", $pt.landPage.login, function () {
        //var $target = $(event.currentTarget);

        // TODO: More code to handle the sign up
        var $template = $("<div class=\"mdl-grid\">").hide();

        // Use AJAX to load in the template file with the login form
        $template.load("templates/login.tmpl", function (result, status) {
            if (status === "success") {
                // Empty all stuff inside the land page content
                $($pt.landPage.content).empty();
                // Add login Card into the land page content
                $($pt.landPage.content).append($template);

                // IMPORTANT:  Must run the command below to register the
                // dynamic content to MDL
                componentHandler.upgradeAllRegistered();

                // Add Event handler for the login button
                $($pt.loginCard.login).on("click", handleLoginAction);

                // Add Event handler for the Checkbox toggle
                $($pt.loginCard.revealPass).on("click", function (event) {
                    var $target = $(event.currentTarget);
                    // Set the type of the password input to either text or password
                    if ($target.is(":checked") === true) {
                        $($pt.loginCard.userPass).prop("type", "text");
                    } else {
                        $($pt.loginCard.userPass).prop("type", "password");
                    }
                });

                // Show the login Card
                $template.fadeIn(500);
            } else {
                // Encountered error
                console.log(status, "Unable to load templates/login.tmpl");
            }
        });

        // TODO: When successful, auto sign in the person

        // TODO: Maybe trigger auto sign in
        // $(signInOutAction).trigger("click");
        // Needed to stop follow link
        return false;
    });

    // Event handler for logout Link
    $($pt.landPage.navbar).on("click", $pt.landPage.logout, function (event) {
        var $target = $(event.currentTarget);

        // Remove userId and Email from footer
        // Can't save to session or anything here
        $($pt.landPage.authenId).text("");
        $($pt.landPage.authenEmail).text("");

        // show SignUp button
        $($pt.landPage.signup).fadeIn();
        // Toggle the login Button to say logout
        $($pt.landPage.logout).addClass(($pt.landPage.login).substr(1));
        $($pt.landPage.logout).text("Login");
        $($pt.landPage.logout).removeClass(($pt.landPage.logout).substr(1));

        // Needed to stop follow link
        return false;
    });

    // Event handler event for demands Action
    $($pt.landPage.demand).on("click", function (event) {
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
