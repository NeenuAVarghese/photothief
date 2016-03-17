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
            section: {
                navbar : ".pt_landPage-navigation",
                content: ".pt_landPage-content",
                loginInfo: ".pt_landPage-loginInfo"
            },
            session: {
                id: "#pt_session_Id",
                user: "#pt_session_User",
                email: "#pt_session_Email"
            },
            action: {
                login : ".pt_openLoginCardAction",
                logout : ".pt_logOutAction",
                signup : ".pt_openSignupCardAction",
                demand : ".pt_openDemandAction",
            }
        },
        carousel: {
            handle: ".pt_landPage-carousels",
            mostWanted: "#pt_carouselMostWanted",
            newestUpload: "#pt_carouselNewestUpload"
        },
        loginCard: {
            handle: ".pt_loginCard",
            template: "templates/login.tmpl",
            field: {
                loginId : "#pt_loginCard-loginId",
                password: "#pt_loginCard-loginPassword",
                revealPass: "#pt_loginCard-revealPassword",
                errorStatus: "#pt_loginCard-errorMessage"
            },
            action: {
                login: ".pt_loginAction"
            }

        },
        signupCard: {
            handle: ".pt_signupCard",
            template: "templates/signup.tmpl",
            field: {
                name: "#pt_signupCard-name",
                email: "#pt_signupCard-email",
                loginId: "#pt_signupCard-loginId",
                password: "#pt_signupCard-password",
                hidePass: "#pt_signupCard-hidePassword",
                status: "#pt_signupCard-errorMessage"
            },
            action: {
                signup: ".pt_signupAction"
            }
        },
        uploadCard: {
            handle: ".pt_uploadCard",
            template: "template/upload.tmpl",
            field: {
                source: "#pt_uploadCard-source"
            },
            action: {
                upload: ".pt_uploadImageAction"
            }
        },
        demandCard: {
            handle: ".pt_demandCard",
            template: "templates/demand.tmpl",
            field: {
                photoId: "#pt_demandCard-photoId",
                demand: "#pt_demandCard-demand",
                victimEmail: "#pt_demandCard-victimEmail"
            },
            action: {
                create: ".pt_demandAction"
            }
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
                    $img.prop("src", image.src);
                    $img.prop("alt", "images from json");
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
        var $template = $("<div>").hide();
        var $wantedSource = "http://localhost:3000/photos?_start=40&_end=60";
        var $newestSource = "http://localhost:3000/photos?_start=0&_end=30";

        // Update the template with class mdl-grid
        $template.addClass("mdl-grid");
        // Use AJAX to load in the template file with the main carousel
        $template.load("templates/main.tmpl", function (result, status) {
            if (status === "success") {
                // Empty all stuff inside the land page content
                $($pt.landPage.section.content).empty();
                // Add the newly add template login into the land page content
                $($pt.landPage.section.content).append($template);

                // MDL update it
                componentHandler.upgradeAllRegistered();

                // Loop to load carousel
                loadCarousel($pt.carousel.mostWanted, $wantedSource);
                loadCarousel($pt.carousel.newestUpload, $newestSource);

                // Show the carousel
                $template.fadeIn(300);

            } else {
                // Encountered error
                console.log(status, "Unable to load templates/main.tmpl");
            }
        });

        // TODO: Any other tasks need to be done here to initialize page
    } // End iniitalize function

    // Function to set things up when login is successful
    function processSuccessLogin(result) {
        // Success Login save the id and the loginId to the footer
        // Can't save to session or anything here
        $($pt.landPage.session.id).text(result[0].id);
        $($pt.landPage.session.user).text(result[0].loginId);
        $($pt.landPage.session.email).text(result[0].email);
        // Hide signup button
        $($pt.landPage.action.signup).fadeOut();
        // Toggle the login Button to say logout
        $($pt.landPage.action.login).addClass(($pt.landPage.action.logout).substr(1));
        $($pt.landPage.action.login).text("Logout");
        $($pt.landPage.action.login).removeClass(($pt.landPage.action.login).substr(1));

        // Reload the main page with carousel
        initialize();
    }

    // Function to handle the loginCard login button
    function handleLoginAction() {
        //var $target = $(event.currentTarget);
        // Grab all the fields on the login Card
        var $loginId = $($pt.loginCard.field.loginId);
        var $password = $($pt.loginCard.field.password);
        var $revealPass = $($pt.loginCard.field.revealPass);
        var $errorStatus = $($pt.loginCard.field.errorStatus);

        if ($loginId.val().trim() === "" || $password.val().trim() === "") {
            // Empty login Information
            $errorStatus.text("Either User or Password is empty");
            return false;
        }

        // Build the JSON urlHost
        var urlHost = "http://localhost:3000/users";
        urlHost += "?loginId=" + $loginId.val().trim();
        urlHost += "&password=" + $password.val().trim();

        // Clear input boxes
        $errorStatus.text("");
        $loginId.val("");
        $loginId.parent().removeClass("is-dirty");
        $password.val("");
        $password.parent().removeClass("is-dirty");
        // Reset the show password checkbox and also the password type
        if ($revealPass.is(":checked") === true) {
            $revealPass.prop("checked", false);
            $revealPass.parent().removeClass("is-checked");
            $password.prop("type", "password");
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
                    $errorStatus.text("Invalid Login Information");
                    return false;
                } else if (result.length === 1) {
                    // We remove the loginCard
                    $($pt.loginCard.handle).fadeOut(300).remove();
                    // Then process the login with the result
                    processSuccessLogin(result);
                }
            },
            error: function (result) {
                console.log("ajax error " + result.status);
            }
        });
    }

    // Function to handle logout action
    function handleLogOutAction() {
        // Remove userId and Email from footer
        // Can't save to session or anything here
        $($pt.landPage.session.id).text("");
        $($pt.landPage.session.user).text("");
        $($pt.landPage.session.email).text("");

        // show SignUp button
        $($pt.landPage.action.signup).fadeIn();
        // Toggle the login Button to say logout
        $($pt.landPage.action.logout).addClass(($pt.landPage.action.login).substr(1));
        $($pt.landPage.action.logout).text("Login");
        $($pt.landPage.action.logout).removeClass(($pt.landPage.action.logout).substr(1));

        // TODO:  Anything else that we need to handle go here

        // Stop link follow
        return false;
    }

    // Function to handle SignUpCard Signup button
    function handleSignupAction() {
        //var $target = $(event.currentTarget);
        // Grab all the fields on the login Card
        var $name = $($pt.signupCard.field.name);
        var $email = $($pt.signupCard.field.email);
        var $loginId = $($pt.signupCard.field.loginId);
        var $password = $($pt.signupCard.field.password);
        var $hidePass = $($pt.signupCard.field.hidePass);
        var $status = $($pt.signupCard.field.status);
        var signupData = {};

        // Formulate data to store
        signupData.name = $name.val().trim();
        signupData.email = $email.val().trim();
        signupData.loginId = $loginId.val().trim();
        signupData.password = $password.val().trim();

        // Check to make sure we don't have blank one
        if (signupData.name === "" ||
            signupData.email === "" ||
            signupData.loginId === "" ||
            signupData.password === "") {

            $status.text("All fields are required !");
            return false;
        }

        // Add an empty avatar for now.
        signupData.avatar = "";

        // Build the JSON urlHost to check if loginId already exist
        var urlHost = "http://localhost:3000/users";
        urlHost += "?loginId=" + signupData.loginId;

        // TODO:  Perform AJAX to check data here
        $.ajax({
            url: urlHost,
            type: "json",
            method: "GET",
            success: function (result) {
                // result is an array if it return
                if (result.length === 0) {
                    // We have no duplicate, allow the user to signup
                    // WS to add the user signup
                    var urlHost = "http://localhost:3000/users";

                    // Call ajax to save the signupData
                    $.ajax({
                        url: urlHost,
                        type: "json",
                        method: "POST",
                        data: signupData,
                        success: function (result) {
                            // Clear up the signup form page data
                            $status.text("");
                            $name.val("");
                            $email.val("");
                            $loginId.val("");
                            $password.val("");
                            $name.parent().removeClass("is-dirty");
                            $email.parent().removeClass("is-dirty");
                            $loginId.parent().removeClass("is-dirty");
                            $password.parent().removeClass("is-dirty");
                            // Reset the show password checkbox and also the password type
                            if ($hidePass.is(":checked") === true) {
                                $hidePass.prop("checked", false);
                                $hidePass.parent().removeClass("is-checked");
                                $password.prop("type", "text");
                            }
                            // Remove the signupCard
                            $($pt.signupCard.handle).fadeOut(300).remove();
                            
                            // Call processSuccessLogin to log the user in
                            // result is an object, wrap it in array
                            processSuccessLogin([result]);
                        },
                        error: function (result) {
                            console.log("ajax error post signup " + result.status);
                        }
                    });
                } else if (result.length >= 1) {
                    // We have duplicate.
                    $status.text("LoginId existed. Choose a different loginId");
                    return false;
                }
            },
            error: function (result) {
                console.log("ajax error " + result.status);
            }
        });

    }

    // Event handler for Sign Up link
    $($pt.landPage.section.navbar).on("click",$pt.landPage.action.signup, function (event) {
        var $target = $(event.currentTarget);
        console.log("Action click: " + $target.text());

        var $template = $("<div>").hide();
        $template.addClass("mdl-grid");

        // Use AJAX to load in the template file
        $template.load($pt.signupCard.template, function (result, status) {
            if (status === "success") {
                // Empty all stuff inside the land page content
                $($pt.landPage.section.content).empty();
                // Add SignUp Card into the land page content
                $($pt.landPage.section.content).append($template);

                // IMPORTANT:  Must run the command below to register the
                // dynamic content to MDL
                componentHandler.upgradeAllRegistered();

                // Add Event handler for the login button
                $($pt.signupCard.action.signup).on("click", handleSignupAction);

                // Add Event handler for the Checkbox toggle
                $($pt.signupCard.field.hidePass).on("click", function (event) {
                    var $target = $(event.currentTarget);
                    // Set the type of the password input to either text or password
                    if ($target.is(":checked") === true) {
                        $($pt.signupCard.field.password).prop("type", "password");
                    } else {
                        $($pt.signupCard.field.password).prop("type", "text");
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

    // Even handler for Login Link
    $($pt.landPage.section.navbar).on("click", $pt.landPage.action.login, function () {
        //var $target = $(event.currentTarget);

        // TODO: More code to handle the sign up
        var $template = $("<div>").hide();
        $template.addClass("mdl-grid");

        // Use AJAX to load in the template file with the login form
        $template.load($pt.loginCard.template, function (result, status) {
            if (status === "success") {
                // Empty all stuff inside the land page content
                $($pt.landPage.section.content).empty();
                // Add login Card into the land page content
                $($pt.landPage.section.content).append($template);

                // IMPORTANT:  Must run the command below to register the
                // dynamic content to MDL
                componentHandler.upgradeAllRegistered();

                // Add Event handler for the login button
                $($pt.loginCard.action.login).on("click", handleLoginAction);

                // Add Event handler for the Checkbox toggle
                $($pt.loginCard.field.revealPass).on("click", function (event) {
                    var $target = $(event.currentTarget);
                    // Set the type of the password input to either text or password
                    if ($target.is(":checked") === true) {
                        $($pt.loginCard.field.password).prop("type", "text");
                    } else {
                        $($pt.loginCard.field.password).prop("type", "password");
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
    $($pt.landPage.section.navbar).on("click", $pt.landPage.action.logout, handleLogOutAction);

    // Event handler event for demands Action
    $($pt.landPage.section.navbar).on("click", $pt.landPage.action.demand, function (event) {
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
