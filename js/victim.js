// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
/* global console: true */

var main = function () {
    "use strict";

    var hostname = "http://" + window.location.hostname;
    var port = location.port;

    var urlhash = (window.location.search).substring(1).split("=")[1];
    console.log("hash", urlhash);

    var $ransom = {
        server: {
            files: config.files,
            hash: config.files + "/victim?hash=",
            db: config.db
        },
        victimPage: {
            content: ".ransom-content",
            image: "#redhanded",
            payment: "#amount",
            comment: "#message"
        },
        img: "",
        msg: "",
        uploader: "",
        type: ""
    };

    // increment user notification count
    function sendNotification(amount) {
        console.log("send", amount, $ransom.type);
        $.ajax({
            url: $ransom.server.db + "/users?id=" + $ransom.uploader,
            dataType: "json",
            method: "GET",
            success: function (result) {
                if (result.length === 1) {
                    var userId = result[0].id;
                    var userName = result[0].name;
                    var notify = parseInt(result[0].notify) + 1;

                    var userData = {
                        notify: notify
                    };

                    $.ajax({
                        url: $ransom.server.db + "/users/" + userId,
                        dataType: "json",
                        method: "PATCH",
                        data: userData,
                        success: function () {
                            console.log(userName, "(" + userId + ")", "has", notify, "notifications");
                            // redirect
                            window.location.href = $ransom.server.files;
                        },
                        error: function (error) {
                            console.log("result " + result.length +  " : ajax error " + error.status);
                            return false;
                        }
                    });
                } else {
                    console.log("Invalid ajax user", $ransom.uploader);
                    return false;
                }
            }
        });
    }

    function checkInput() {
        // prevent invalid input
        $("#amount").blur(function() {
            var v = $(this).val();

            // numbers only
            if (isNaN(v)){
                $(this).val("");
            }
            // positive integers only
            else {
                $(this).val(Math.abs(parseInt(v, 10)));
            }
        });

        // submit form
        $(".haggle").submit(function(e) {
            e.preventDefault();

            var deal = "";
            var paid = $("#amount").val().trim();
            var comment = $("#message").val().trim();

            var victimData = {
                hash: urlhash,
                text: comment,
                paid: paid
            };

            $.ajax({
                url: $ransom.server.db + "/haggles?hash=" + urlhash,
                dataType: "json",
                method: "GET",
                success: function (result) {
                    // new haggle
                    if (result.length === 0) {
                        $.ajax({
                            url: $ransom.server.db + "/haggles",
                            dataType: "json",
                            method: "POST",
                            data: victimData,
                            success: function () {
                                // notify that victim has paid
                                sendNotification(victimData.paid);
                            },
                            error: function (error) {
                                console.log("result " + result.length +  " : ajax error " + error.status);
                                return false;
                            }
                        });


                    // update
                    } else if (result.length === 1) {
                        deal = result[0].id;
                        victimData.paid = result[0].paid + parseInt(victimData.paid);

                        $.ajax({
                            url: $ransom.server.db + "/haggles/" + deal,
                            dataType: "json",
                            method: "PATCH",
                            data: victimData,
                            success: function () {
                                // notify that victim has paid
                                sendNotification(victimData.paid);
                            },
                            error: function (error) {
                                console.log("result " + result.length +  " : ajax error " + error.status);
                                return false;
                            }
                        });

                    // error
                    } else {
                        console.log("Invalid ajax haggle");
                        return false;
                    }
                },
                error: function (error) {
                    console.log("error" + error);
                }
            });
        });
    }

    function loadRansom(urlhash) {
        $.ajax({
            url: $ransom.server.db + "/demands?hash=" + urlhash,
            dataType: "json",
            method: "GET",
            success: function (result) {

                // result is an array if it return
                if (result.length === 1) {
                    $ransom.msg = result[0].demand;
                    $("#mwahaha").text(result[0].demand);
                    $ransom.img = result[0].photoId;
                    $ransom.uploader = result[0].userId;

                    $.ajax({
                        url: $ransom.server.db + "/photos?id=" + $ransom.img,
                        dataType: "json",
                        method: "GET",
                        success: function (result) {

                            // result is an array if it return
                            if (result.length === 1) {
                                console.log("src", result[0].src);
                                $($ransom.victimPage.image).attr("src", "../" + result[0].src);
                                $ransom.type = $ransom.msg.split(" ")[1];
                                $($ransom.victimPage.payment).text($ransom.type);

                            } else if (result.length > 1) {
                                // We have duplicate photos.
                                console.log("error: duplicate photo");
                                return false;
                            }
                        },
                        error: function (result) {
                            console.log("ajax error " + result.status);
                        }
                    });

                } else if (result.length > 1) {
                    // We have duplicate demands.
                    console.log("error: duplicate demand");
                    return false;
                }
            },
            error: function (result) {
                console.log("ajax error " + result.status);
            }
        });
    }

    loadRansom(urlhash);
    checkInput();
};

$(document).ready(main);
