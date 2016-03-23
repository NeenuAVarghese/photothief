// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
/* global console: true, _: true, chance: true, Clipboard: true */ /* ,alert: true */

var main = function () {
    "use strict";

	var hostname = "http://" + window.location.hostname;
    var port = location.port;
    var indices = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

    /*
        Change the individual variable into a object with tree structure like
        this allow us to group all the fields, actions and allow easy access
        to the individual item accordingly.

        i.e. to select the login button: $($pt.landPage.login)

    */
    var $pt = {
        server: {
            files: hostname + ":" + port /*8000*/,
            db: hostname + ":3000"
        },
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
                errorStatus: "#pt_signupCard-errorMessage"
            },
            action: {
                signup: ".pt_signupAction"
            }
        },
        uploadCard: {
            handle: "#pt_uploadCard",
            field: {
                file: "#pt_uploadCard-file",
                fileInfo: "#pt_uploadCard-fileInfo",
                email: "#pt_uploadCard-victim",
                paymentType: "#pt_uploadCard-payment",
                amount: "#pt_uploadCard-amount",
                errorStatus: "#pt_uploadCard-errorMessage",
                preview: ".pt_uploadCard-preview"
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
                demandId: "#pt_demandId"
            },
            action: {
                collected: ".pt_demandcard-removeVictim"
            }
        }
    };

    // Pretty errors
    var alertBar = "<div class='alert alert-danger fade in'><strong class='pull-left'>Error!&nbsp;</strong><span>";
    var alertEnd = "</span>&nbsp;<a class='close' data-dismiss='alert' aria-label='close'>&times;</a></div>";

    // Function to load the Picture Carousel with specified AJAX source
    // and the sliderId
    function loadCarousel($sliderId, source) {
        // Load owlCarousel for slider 1.  Sample data pull from image 40 to 60
        $($sliderId).empty();
        $($sliderId).owlCarousel({
            jsonPath: source,
            jsonSuccess: function (data) {
                if (data.length >= 1) {
                    // Call back function to process the photo data we pull
                    data.forEach(function (image) {
                        var $img = $("<img>");
                        $img.prop("src", image.src);
                        $img.prop("alt", "images from json");
                        $($sliderId).append($img);
                    });
                }
            },
            navigation: true,
            navigationText: [
                "<span class=\"glyphicon glyphicon-chevron-left\"></span>",
                "<span class=\"glyphicon glyphicon-chevron-right\"></span>"],
            autoPlay: 5000, //Set AutoPlay to 3 seconds
            items: 8,
            lazyLoad: true,
            itemsDesktop: [1199,5],
            itemsDesktopSmall: [979,3]
        });
    }

    // Function to load random images from DB
    function loadRandom(indices) {
        var pt_img = [];

        $.ajax({
            url: $pt.server.db + "/photos?used=false",
            dataType: "json",
            method: "GET",
            success: function (result) {
                // result is an array if it return
                if (result.length >= 1) {
                    // select random sample of unused images
                    var sample = _.sample(_.toArray(_.range(0, result.length)), indices.length);

                    // store image filenames in array
                    _.each(sample, function (img) {
                        //console.log(img, result[img].src);
                        pt_img.push(result[img].src);
                    });

                    // shove images onto page
                    _.each(indices, function (n) {
                        $("#rand" + n).children("img").eq(0).attr("src", pt_img[n-1]);
                    });


                } else if (result.length < 1) {
                    console.log("error: unknown image");
                    return false;
                }
            },
            error: function (result) {
                console.log("ajax error " + result.status);
            }
        });
    }

    // Function to load thumbs up/down for each image
    function loadScores(indices) {
        _.each(indices, function (n) {
            // Add random score to each random image
            $("#rand" + n).attr("data-caption",
                "<a class='like'><i id='upvote" + n + "'" +
                "class='mdi mdi-thumb-up-outline'>&nbsp;</i></a><button class='counter'>" +
                chance.integer({min: 0, max: 30}) + "</button>" +
                "<a class='like'><i id='downvote" + n + "'" +
                "class='mdi mdi-thumb-down-outline'>&nbsp;</i></a>");
            //console.log("Loading score for " + n);
        });
    }

    // Event handler for upvote/downvote
    function handleVoteAction(indices) {
        _.each(indices, function (n) {
            $(".Collage").on("click", "#upvote" + n, function () {
                $(this).prop("disabled", true);
                $(this).addClass("mdi-thumb-up").removeClass("mdi-thumb-up-outline");
                console.log("upvote");
                $("#downvote" + n).removeClass("mdi-thumb-down").addClass("mdi-thumb-down-outline");
                $("#downvote" + n).prop("disabled", false);

                // TODO
                $(this).parent().next("button").text(function (i, oldval) {
                    return ++oldval;
                });
            });
        });

        _.each(indices, function (n) {
            $(".Collage").on("click", "#downvote" + n, function () {
                $(this).prop("disabled", true);
                $(this).addClass("mdi-thumb-down").removeClass("mdi-thumb-down-outline");
                console.log("downvote");
                $("#upvote" + n).removeClass("mdi-thumb-up").addClass("mdi-thumb-up-outline");
                $("#upvote" + n).prop("disabled", false);

                // TODO
                $(this).parent().prev("button").text(function (i, oldval) {
                    return --oldval;
                });
            });
        });
    }

    // Function for the initial load of the page.
    function initialize() {

        // TODO: More code to handle the sign up
        var $template = $("<div>").hide();
        var $wantedSource = $pt.server.db + "/photos?used_ne=true&_sort=createDate&_order=ASC&_limit=20";
        // Get the latest 10 pictures
        var $newestSource = $pt.server.db + "/photos?used_ne=true&_sort=createDate&_order=DESC&_limit=10";

        // Change to use bootstrap
        $template.addClass("row");
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
        loadRandom(indices);
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

        // Notifications
        if (result[0].notify !== 0) {
            $($pt.landPage.session.notify).attr("data-badge", result[0].notify);
            $(document).attr("title", "* PhotoThief");
            $("#favicon").attr("href", "favicon2.ico");
        }

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

        // Confirm leaving webapp
        window.onbeforeunload = function() {
           return "";
        };

        // Reload the main page with carousel with user specific data ???
        //initialize();
    }

    // Function to handle the loginCard login button
    function handleLoginAction(event) {
        event.preventDefault();
        //var $target = $(event.currentTarget);
        // Grab all the fields on the login Card
        var $loginId = $($pt.loginCard.field.loginId);
        var $password = $($pt.loginCard.field.password);
        var $revealPass = $($pt.loginCard.field.revealPass);
        var $error = $($pt.loginCard.field.errorStatus);

        // Fixed problem with multiple error appending to error
        $error.empty();
        if ($loginId.val().trim() === "" || $password.val().trim() === "") {
            // Empty login Information
            $error.append(alertBar + "Either User or Password is empty" + alertEnd);
            return false;
        }

        // Build the JSON urlHost
        var urlHost = $pt.server.db + "/users";
        urlHost += "?loginId=" + $loginId.val().trim();
        urlHost += "&password=" + $password.val().trim();

        // TODO:  Perform AJAX to check data here
        $.ajax({
            url: urlHost,
            dataType: "json",
            method: "GET",
            success: function (result) {
                // result is an array if it return
                if (result.length === 0) {
                    // Failed login
                    $error.append(alertBar + "Invalid Login Information" + alertEnd);
                    return false;
                } else if (result.length === 1) {
                    // Clear input boxes
                    $loginId.val("");
                    $password.val("").attr("type", "password");
                    $revealPass.attr("checked", false);

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
    function handleLogOutAction(event) {
        event.preventDefault();

        // Remove userId and Email from footer
        // Can't save to session or anything here
        $($pt.landPage.session.id).text("");
        $($pt.landPage.session.user).text("");
        $($pt.landPage.session.email).text("");
        $($pt.landPage.session.notify).removeAttr("data-badge");
        $(document).attr("title", "PhotoThief");
        $("#favicon").attr("href", "favicon.ico");

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

        // Remove confirmation
        window.onbeforeunload = null;

        // TODO:  Anything else that we need to handle go here

        // Stop link follow
        return false;
    }

    // Function to handle SignUpCard Signup button
    function handleSignupAction(event) {
        event.preventDefault();

        // Grab all the fields on the login Card
        var $name = $($pt.signupCard.field.name);
        var $email = $($pt.signupCard.field.email);
        var $loginId = $($pt.signupCard.field.loginId);
        var $password = $($pt.signupCard.field.password);
        var $hidePass = $($pt.signupCard.field.hidePass);
        var $status = $($pt.signupCard.field.errorStatus);
        var signupData = {};

        $status.empty();

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

            $status.append(alertBar + "All fields are required !" + alertEnd);
            return false;
        }

        // Add an empty avatar for now.
        signupData.avatar = "";
        signupData.notify = 0;

        // Build the JSON urlHost to check if loginId already exist
        var urlHost = $pt.server.db + "/users";
        urlHost += "?loginId=" + signupData.loginId;

        // TODO:  Perform AJAX to check data here
        $.ajax({
            url: urlHost,
            dataType: "json",
            method: "GET",
            success: function (result) {
                // result is an array if it return
                if (result.length === 0) {
                    // We have no duplicate, allow the user to signup
                    // WS to add the user signup
                    var urlHost = $pt.server.db + "/users";

                    // Call ajax to save the signupData
                    $.ajax({
                        url: urlHost,
                        dataType: "json",
                        method: "POST",
                        data: signupData,
                        success: function (result) {
                            // Clear up the signup form page data
                            $status.empty();
                            $name.val("");
                            $email.val("");
                            $loginId.val("");
                            $password.val("").attr("type", "text");
                            $hidePass.prop("checked", false);
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
                    $status.append(alertBar +"LoginId existed. Choose a different loginId" +alertEnd);
                    return false;
                }
            },
            error: function (result) {
                console.log("ajax error " + result.status);
            }
        });

    }

    function handleUploadAction(event) {
        event.preventDefault();
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
        var base64 = window.btoa(victimEmail + userId, true).replace("=", ".");

        // Empty the error container
        $error.empty();

        var errorFlag = false;
        // Perform validation here
        if ($file.files.length === 0) {
            $error.append(alertBar + "A photo is required" + alertEnd);
            errorFlag = true;
        }
        if (victimEmail === "") {
            $error.append(alertBar + "Victim email is required" + alertEnd);
            errorFlag = true;
        }
        if (amount === "") {
            $error.append(alertBar + "Demand amount is required" + alertEnd);
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
            url: $pt.server.files + "/ptupload",
            method: "POST",
            data: form,
            contentType: false,
            processData: false,
            success: function (result) {
                if (result.hasOwnProperty("filename")) {
                    // We got the file uploaded, now save it to photos
                    var photoData = {
                        src: result.path,
                        createDate: result.created,
                        score: 0,
                        source: "own",
                        used: false,
                        userId: userId
                    };

                    // Perform add to photos database
                    $.ajax({
                        url: $pt.server.db + "/photos",
                        dataType: "json",
                        method: "POST",
                        data: photoData,
                        success: function (result) {
                            // Now we need to add it to the demands database
                            var demandData = {
                                victimEmail: victimEmail,
                                createDate: Date.now(),
                                demand: amount + " " + pymntType,
                                photoId: result.id,
                                userId: userId,
                                hash: base64,
                                met: false
                            };

                            $.ajax({
                                url: $pt.server.db + "/demands",
                                dataType: "json",
                                method: "POST",
                                data: demandData,
                                success: function () {
                                    // Reset form and close modal
                                    $($pt.uploadCard.field.file).attr("type", "text");
                                    $($pt.uploadCard.field.file).attr("type", "file");
                                    $($pt.uploadCard.field.email).val("");
                                    $($pt.uploadCard.field.amount).val("");
                                    $($pt.uploadCard.field.preview).empty();
                                    $error.empty();

                                    // Call this for now to refresh the carousel
                                    initialize();
                                    // Hide modal
                                    $($pt.uploadCard.handle).modal("hide");
                                    return false;
                                },
                                error: function (result) {
                                    console.log("Fail added to demands database " + result.status);
                                }
                            }); // Finished AJAX for Demands
                            return false;
                        },
                        error: function (result) {
                            console.log("Failed add to photos database " + result.status);
                        }
                    }); // Finish AJAX for Photos
                } // If has filename as result from upload
                return false;
            },
            error: function (result) {
                $error.append(alertBar + result.responseJSON.message + alertEnd);
                return false;
            }
        }); // Finish AJAX to upload picture

        // Stop link follow if anything
        return false;
    }

    // Event handler for Image Link
    $(".Collage").on("click", $pt.landPage.action.image, function () {
        // FIXME
        var imgFocus = $(this).parent().parent().parent().children("img").eq(0).attr("src");
        console.log(imgFocus);
        $($pt.imageCard.field.imgSrc).attr("src", imgFocus);

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

        // Add Event handler for the login button.  Since it get add everytime
        // the modal is show, we must unregister it first then re-register
        // .off() will remove all events for the selector.  If have multiple
        // attached, specified it as .off("click") ...
        $($pt.signupCard.action.signup).off().on("click", handleSignupAction);

        // Add Event handler for the Checkbox toggle
        $($pt.signupCard.field.hidePass).off().on("click", function (event) {
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
        $($pt.loginCard.action.login).off().on("click", handleLoginAction);

        // Add Event handler for the Checkbox toggle
        $($pt.loginCard.field.revealPass).off().on("click", function (event) {
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
        $($pt.uploadCard.action.upload).off().on("click", handleUploadAction);

        // Add Event handler for image preview during upload
        // http://codepedia.info/2015/06/html5-filereader-preview-image-show-thumbnail-image-before-uploading-on-server-in-jquery/
        // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
        // Credit to the sites above for instruction and sample code
        $($pt.uploadCard.field.file).off().on("change", function (event) {
            event.preventDefault();
            // Get the select file
            var $target = $(event.currentTarget);
            var photo = event.currentTarget.files[0];
            // Initialize the preview image area
            var $preview = $($pt.uploadCard.field.preview).hide();
            var $error = $($pt.uploadCard.field.errorStatus).hide();
            var $fileInfo = $($pt.uploadCard.field.fileInfo);

            $preview.empty();
            $error.empty();
            $fileInfo.val("");

            // Only accept JPEG file
            if (!photo.type.match(".*jpeg$")) {
                // Reset the file selected
                $target.attr("type", "text").attr("type", "file");
                // Output message
                $error.append(alertBar + "We only accept jpeg file" + alertEnd).fadeIn();
                $fileInfo.val("File not selected");
                $preview.fadeIn();
                return false;
            }

            // Show the file Information
            $fileInfo.val(photo.name + " ( " + Math.floor(parseInt(photo.size)/1024) + "KB )");

            // Use FileReader to preview the image
            var reader = new FileReader();
            // Read the file as URL (so that we can link to img src)
            reader.readAsDataURL(photo);

            reader.onload = function (event) {
                // when load finish get the result of the read
                var src = event.currentTarget.result;
                var $img = $("<img>").attr("src", src);
                $img.addClass("preview img-thumbnail");
                $img.attr("alt", "Upload Preview");
                $preview.append($img).fadeIn();
            };
        }); // End onChange of image selection

        return false;
    });

    function updateDemandModal() {
        var userId = $($pt.landPage.session.id).text().trim();
        if (userId !== "") {
            $($pt.demandCard.handle).modal("show");
            $.ajax({
                url: $pt.server.db + "/demands",
                method: "GET",
                dataType: "json",
                data: {
                    userId: userId,
                    met: false
                },
                success: function (data) {
                    // Empty the list
                    $(".pt_demandCard-content").empty();

                    if (data.length > 0) {
                        $.each(data, function (index, element) {
							$(".pt_demandCard-content").append($("<li class='list-group-item'><div><i class='fa fa-usd fa-2x'></i>" +
                            "&nbsp;&nbsp;<span class='elementname'>" + element.victimEmail + "</span>&nbsp;&nbsp;" +
                            "<span class='move-right'><input id='pt_hash" + element.id + "' class='move-center' value='" +
                            $pt.server.files + "/victim/?hash=" + element.hash + "' disabled>" +
                            "<a class='btn clip' data-clipboard-target='#pt_hash" + element.id + "'>" +
                            "<i class='material-icons'>assignment</i></a><span id='pt_demandId' hidden = ''>" + element.id +
                            "</span>&nbsp;&nbsp;&nbsp;" + "<a class='btn pt_demandcard-removeVictim'>" +
                            "<i class='fa fa-trash fa-2x'></i></a></span></div></li>"));
                        });
                        var enableCopy = new Clipboard(".clip");
                        console.log(enableCopy);

                    }
                },
                error: function (error) {
                    console.log(error);
                }
            });
        } else {
            console.log("not logged in");
        }
    }

    $($pt.landPage.section.navbar).on("click", $pt.landPage.action.demand, function () {
        //Get our user info
        updateDemandModal();
        return false;
    });


    $($pt.demandCard.content).delegate($pt.demandCard.action.collected, "click", function () {
        var $demandId = $(this).siblings("#pt_demandId").text().trim();
		console.log($demandId);
        var urlHost = $pt.server.db + "/demands/" + $demandId;

        var metdata = {
            "met": true
        };

        $.ajax({
            url: urlHost,
            dataType: "json",
            method: "PATCH",
            data: metdata,
            success: function () {
				$(".pt_demandCard-content").empty();
                updateDemandModal();
            },
            error: function () {
                console.log("error occured");
            }
        });

    });

    initialize();

};

$(document).ready(main);
