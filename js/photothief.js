// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
/* global alert: true, console: true, _: true */

var main = function () {
    "use strict";

    var jsonPath = "http://localhost:3000";
    var indices = [1,2,3,4,5,6,7,8,9,10];

    /*
        Change the individual variable into a object with tree structure like
        this allow us to group all the fields, actions and allow easy access
        to the individual item accordingly.

        i.e. to select the login button: $($pt.landPage.login)

    */
    var $pt = {
        landPage: {
            section: {
                navbar: ".pt_landPage-navigation",
                slogan: ".pt_landPage-slogan",
                content: ".pt_landPage-content",
                loginInfo: ".pt_landPage-loginInfo"
            },
            session: {
                info: ".pt_landPage_loginInfo",
                id: "#pt_session_Id",
                user: "#pt_session_User",
                email: "#pt_session_Email",
                notify: "#pt_session_Notify"
            },
            action: {
                icon: "#pt_log_icon",
                text: "#pt_log_text",
                image: ".counter",
                login: ".pt_openLoginCardAction",
                logout: ".pt_logOutAction",
                signup: ".pt_openSignupCardAction",
                demand: ".pt_openDemandCardAction",
                upload: ".pt_openUploadCardAction"
            }
        },
        carousel: {
            handle: ".pt_landPage-carousels",
            template: "templates/main.tmpl",
            mostWanted: "#pt_carouselMostWanted",
            newestUpload: "#pt_carouselNewestUpload"
        },
        imageCard: {
            handle: "#pt_imageCard",
            field: {
                imgSrc: ".pt_imageCard-src",
                errorStatus: "#pt_imageCard-errorMessage"
            },
            action: {
                image: ".pt_imageAction"
            }
        },
        loginCard: {
            handle: "#pt_loginCard",
            field: {
                loginId: "#pt_loginCard-loginId",
                password: "#pt_loginCard-loginPassword",
                revealPass: "#pt_loginCard-revealPassword",
                errorStatus: "#pt_loginCard-errorMessage"
            },
            action: {
                login: ".pt_loginAction"
            }
        },
        signupCard: {
            handle: "#pt_signupCard",
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
            handle: "#pt_uploadCard",
            field: {
                file: "#pt_uploadCard-file",
                email: "#pt_uploadCard-victim",
                paymentType: "#pt_uploadCard-payment",
                amount: "#pt_uploadCard-amount",
                errorStatus: "#pt_uploadCard-errorMessage"
            },
            action: {
                upload: ".pt_uploadAction"
            }
        },
        demandCard: {
            handle: "#pt_demandCard",
            content: ".pt_demandCard-content",
            field: {
                photoId: "#pt_demandsCard-photoId",
                demand: "#pt_demandsCard-demand",
                victimEmail: "#pt_demandsCard-victimEmail",
                errorStatus: "#pt_demandCard-errorMessage",
                removeVictim: "#pt_demandcard-removeVictim"

            },
            action: {
                collected: ".pt_demandcard-removeVictim",

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

    // Function to load thumbs up/down for each image
    function loadScores(indices) {
        var pt_img = [];
        var pt_rand = 0;

        _.each(indices, function (n) {
            // Get random image, no dupes
            pt_rand = chance.pad(chance.integer({min: 1, max: 72}), 3);
            while (_.contains(pt_img, pt_rand)) {
              console.log("Dupe found " + pt_rand);
              pt_rand = chance.pad(chance.integer({min: 1, max: 72}), 3);
            }

            // Add random score to each random image
            pt_img.push(pt_rand);
            $("#rand" + n).children("img").eq(0).attr("src", "photos/" + pt_img[n-1] + ".jpg");
            $("#rand" + n).attr("data-caption",
                "<a class='like'><i id='upvote" + n + "'"
                + "class='mdi mdi-thumb-up-outline'>&nbsp;</i></a><button class='counter'>"
                + chance.integer({min: 0, max: 30}) + "</button>"
                + "<a class='like'><i id='downvote" + n + "'"
                + "class='mdi mdi-thumb-down-outline'>&nbsp;</i></a>");
            //console.log("Loading score for " + n);
          });
    }

    // Function for the initial load of the page.
    function initialize() {

        // TODO: More code to handle the sign up
        var $template = $("<div>").hide();
        var $wantedSource = jsonPath + "/photos?_start=40&_end=60";
        var $newestSource = jsonPath + "/photos?_start=0&_end=30";

        // Update the template with class mdl-grid
        $template.addClass("mdl-grid");
        // Use AJAX to load in the template file with the main carousel
        $template.load($pt.carousel.template, function (result, status) {
            if (status === "success") {
                // Empty all stuff inside the land page content
                $($pt.landPage.section.content).empty();
                // Add the newly add template login into the land page content
                $($pt.landPage.section.content).append($template);

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
        loadScores(indices);
        handleVoteAction(indices);
    } // End iniitalize function

    // Function to set things up when login is successful
    function processSuccessLogin(result) {
        // Success Login save the id and the loginId to the footer
        // Can't save to session or anything here
        $($pt.landPage.session.id).text(result[0].id);
        $($pt.landPage.session.user).text(result[0].loginId);
        $($pt.landPage.session.email).text(result[0].email);
        $($pt.landPage.session.notify).attr("data-badge", 5 /*result[0].notify*/);
        $(document).attr("title", "PhotoThief (" + 5 + ")");

        // Hide slogan
        $($pt.landPage.section.slogan).addClass("hidden").removeClass("show");
        // Hide signup button
        $($pt.landPage.action.signup).addClass("hidden").removeClass("show");
        // Show demand button
        $($pt.landPage.action.demand).addClass("show").removeClass("hidden");
        // Show upload button
        $($pt.landPage.action.upload).addClass("show").removeClass("hidden");
        // Show user info
        $($pt.landPage.session.info).addClass("show").removeClass("hidden");

        // Toggle the login Button to say logout
        $($pt.landPage.action.icon).text("exit_to_app");
        $($pt.landPage.action.text).text("Logout");
        $($pt.landPage.action.login).addClass(($pt.landPage.action.logout).substr(1));
        $($pt.landPage.action.login).removeClass(($pt.landPage.action.login).substr(1));

        // Reload the main page with carousel with user specific data ???
        //initialize();
    }

    // Function to handle the loginCard login button
    function handleLoginAction() {
        //var $target = $(event.currentTarget);
        // Grab all the fields on the login Card
        var $loginId = $($pt.loginCard.field.loginId);
        var $password = $($pt.loginCard.field.password);
        var $revealPass = $($pt.loginCard.field.revealPass);
        var $error = $($pt.loginCard.field.errorStatus);

        if ($loginId.val().trim() === "" || $password.val().trim() === "") {
            // Empty login Information
            $error.text("Either User or Password is empty");
            return false;
        }

        // Build the JSON urlHost
        var urlHost = jsonPath + "/users";
        urlHost += "?loginId=" + $loginId.val().trim();
        urlHost += "&password=" + $password.val().trim();

        // Clear input boxes
        $error.text("");
        $loginId.val("");
        $password.val("");
        // Reset the show password checkbox and also the password type
        if ($revealPass.is(":checked") === true) {
            $revealPass.prop("checked", false);
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
                    $error.text("Invalid Login Information");
                    return false;
                } else if (result.length === 1) {
                    // Close Bootstrap Login Modal
                    $($pt.loginCard.handle).modal("hide");
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
        $($pt.landPage.session.notify).removeAttr("data-badge");
        $(document).attr("title", "PhotoThief");

        // Hide user info
        $($pt.landPage.session.info).addClass("hidden").removeClass("show");
        // Hide Upload button
        $($pt.landPage.action.upload).addClass("hidden").removeClass("show");
        // Hide Demand button
        $($pt.landPage.action.demand).addClass("hidden").removeClass("show");
        // Show signup button
        $($pt.landPage.action.signup).addClass("show").removeClass("hidden");
        // Show slogan
        $($pt.landPage.section.slogan).addClass("show").removeClass("hidden");

        // Toggle the login Button to say logout
        $($pt.landPage.action.icon).text("person");
        $($pt.landPage.action.text).text("Login");
        $($pt.landPage.action.logout).addClass(($pt.landPage.action.login).substr(1));
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
        var urlHost = jsonPath + "/users";
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
                    var urlHost = jsonPath + "/users";

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
                            // Reset the show password checkbox and also the password type
                            if ($hidePass.is(":checked") === true) {
                                $hidePass.prop("checked", false);
                                $password.prop("type", "text");
                            }
                            // Close the signup modal
                            $($pt.signupCard.handle).modal("hide");

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

    function handleUploadAction() {
        // Retrieve all the necessary data to prepare the following:
        // 1. File upload to server
        // 2. Insert data into photos database
        // 3. Insert data into demands database
        // 4. Possibly need to send link to victim ???
        var userId = $($pt.landPage.session.id).text().trim();
        //var userEmail = $($pt.landPage.session.email).text().trim();
        var $file = $($pt.uploadCard.field.file)[0];
        var victimEmail = $($pt.uploadCard.field.email).val().trim();
        var pymntType = $($pt.uploadCard.field.paymentType).find("option:selected").text().trim();
        var amount = $($pt.uploadCard.field.amount).val().trim();
        var $error = $($pt.uploadCard.field.errorStatus).hide();

        // Empty the error container
        $error.empty();

        var errorFlag = false;
        // Perform validation here
        if ($file.files.length === 0) {
            $error.append($("<p>").text("A photo is required"));
            errorFlag = true;
        }
        if (victimEmail === "") {
            $error.append($("<p>").text("Victim email is required"));
            errorFlag = true;
        }
        if (amount === "") {
            $error.append($("<p>").text("Demand amount is required"));
            errorFlag = true;
        }
        if (errorFlag) {
            $error.show();
            return false;
        }

        // If we get here, it's good
        // Perform upload of the image
        var form = new FormData();
        form.append("photo", $file.files[0]);

        $.ajax({
            url: "http://localhost:8000/ptupload",
            method: "POST",
            data: form,
            contentType: false,
            processData: false,
            success: function (result) {
                if (result.hasOwnProperty("filename")) {
                    // We got the file uploaded, now save it to photos
                    var photoData = {
                        src: result.path,
                        creationDate: result.created,
                        score: 0,
                        source: "own",
                        used: false,
                        userId: userId
                    };

                    // Perform add to photos database
                    $.ajax({
                        url: "http://localhost:3000/photos",
                        dataType: "json",
                        method: "POST",
                        data: photoData,
                        success: function (result) {
                            // Now we need to add it to the demands database
                            var demandData = {
                                photoId: result.id,
                                demand: amount + " " + pymntType,
                                victimEmail: victimEmail,
                                createDate: Date.now(),
                                link: "localhost:8000/ransom.html?id=",
                                met: false,
                                userId: userId
                            };

                            $.ajax({
                                url: "http://localhost:3000/demands",
                                dataType: "json",
                                method: "POST",
                                data: demandData,
                                success: function (result) {
                                    // Now we need update the link with the id
                                    var linkData = {
                                        link: result.link + result.id
                                    };

                                    $.ajax({
                                        url: "http://localhost:3000/demands/" + result.id,
                                        dataType: "json",
                                        method: "PATCH",
                                        data: linkData,
                                        success: function () {
                                            // Reset form and close modal
                                            $($pt.uploadCard.field.file).attr("type", "text");
                                            $($pt.uploadCard.field.file).attr("type", "file");
                                            $($pt.uploadCard.field.email).val("");
                                            $($pt.uploadCard.field.amount).val("");
                                            $error.empty();
                                            // Hide modal
                                            $($pt.uploadCard.handle).modal("hide");
                                        },
                                        error: function (result) {
                                            console.log("Fail update link" + result.status);
                                        }
                                    });
                                },
                                error: function (result) {
                                    console.log("Fail added to demands database " + result.status);
                                }
                            }); // Finished AJAX for Demands
                        },
                        error: function (result) {
                            console.log("Failed add to photos database " + result.status);
                        }
                    }); // Finish AJAX for Photos
                } // If has filename as result from upload
            },
            error: function (result) {
                $error.append($("<p>").text(result.responseJSON.message));
                return false;
            }
        });  // Finish AJAX to upload picture

        // Stop link follow if anything
        return false;
    }

    // Event handler for upvote/downvote
    function handleVoteAction(indices) {
        _.each(indices, function (n) {
            $(".Collage").on("click", "#upvote" + n, function() {
                $(this).prop("disabled", true);
                $(this).addClass("mdi-thumb-up").removeClass("mdi-thumb-up-outline");
                console.log("upvote");
                $("#downvote" + n).removeClass("mdi-thumb-down").addClass("mdi-thumb-down-outline");
                $("#downvote" + n).prop("disabled", false);

                // TODO
            });
        });

        _.each(indices, function (n) {
            $(".Collage").on("click", "#downvote" + n, function() {
                $(this).prop("disabled", true);
                $(this).addClass("mdi-thumb-down").removeClass("mdi-thumb-down-outline");
                console.log("downvote");
                $("#upvote" + n).removeClass("mdi-thumb-up").addClass("mdi-thumb-up-outline");
                $("#upvote" + n).prop("disabled", false);

                // TODO
            });
        });
    }

    // Event handler for Image Link
    $(".Collage").on("click", $pt.landPage.action.image, function () {
        var imgFocus = $(this).parent().parent().parent().children("img").eq(0).attr('src');
        console.log(imgFocus);
        $($pt.imageCard.field.imgSrc).attr("src", imgFocus);
        //$("#rand" + n).children("img").eq(0).attr("src", "photos/" + pt_img[n-1] + ".jpg");

        // Bootstrap open up modal for sign up
        $($pt.imageCard.handle).modal("show");

        // Needed to stop follow link
        return false;
    });

    // Event handler for Sign Up link
    $($pt.landPage.section.navbar).on("click", $pt.landPage.action.signup, function () {
        //var $target = $(event.currentTarget);

        // Bootstrap open up modal for sign up
        $($pt.signupCard.handle).modal("show");

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

        // Needed to stop follow link
        return false;
    });

    // Event handler for Login Link
    $($pt.landPage.section.navbar).on("click", $pt.landPage.action.login, function () {
        // Show the Login Modal
        $($pt.loginCard.handle).modal("show");

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

        return false;
    });

    // Event handler for logout Link
    $($pt.landPage.section.navbar).on("click", $pt.landPage.action.logout, handleLogOutAction);

    // Event handler for Upload Link
    $($pt.landPage.section.navbar).on("click", $pt.landPage.action.upload, function () {
        // Show the Upload Modal
        $($pt.uploadCard.handle).modal("show");

        // Add Event handler for the login button
        $($pt.uploadCard.action.upload).on("click", handleUploadAction);

        return false;
    });

    $($pt.landPage.section.navbar).on("click", $pt.landPage.action.demand, function () {
        //Get our user info
        var userId = $($pt.landPage.session.id).text().trim();

        //Show content in the modal for the given user
        if (userId !== "") {
            $($pt.demandCard.handle).modal("show");
            $.ajax({
                url: jsonPath + "/demands",
                method: "GET",
                type: "json",
                data: {
                    userId: userId,
                    met: false
                },
                success: function (data) {
                    // Empty the list
                    $(".mdl-list").empty();

                    if (data.length > 0) {
                        $.each(data, function (index, element) {
                            $(".mdl-list").append($("<div id='pt_demandcard-removeVictim' class='mdl-list__item'><span class='mdl-list__item-primary-content'><i class='material-icons'>person</i><span class='elementname'>" + element.victimEmail + "</span></span><a class='mdl-list__item-secondary-action' href='#'><i class='material-icons'>delete</i></a></div>"));
                        });
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            });
        } else {
            console.log("not logged in");
            //$error.text("Either User or Password is empty");
            //$($pt.demandCard.handle).modal("hide");
        }

        // Add event handler for the remove button
        $($pt.demandCard.field.removeVictim).on("click", function (event){
            var $target = $(event.currentTarget);
            $target.parent();
            //to be coded
        });

        return false;
    });

    // Call function to intitialize it here
    initialize();

};

$(document).ready(main);
