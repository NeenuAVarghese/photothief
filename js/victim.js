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
            files: hostname + ":" + port /*8000*/,
            hash: hostname + ":" + port + "/victim?hash=",
            db: hostname + ":3000"
        },
        victimPage: {
            content: ".ransom-content",
            image: "#redhanded",
            payment: "#amount",
            comment: "#message"
        },
        img: "",
        msg: "",
        type: ""
    };

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
                            success: function (result) {
                                // redirect
                                window.location.href = $ransom.server.files;
                                console.log("result " + result);
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
                            success: function (result) {
                                // redirect
                                window.location.href = $ransom.server.files;
                                console.log("result " + result);
                            },
                            error: function (error) {
                                console.log("result " + result.length +  " : ajax error " + error.status);
                                return false;
                            }
                        });

                    // error
                    } else {
                        console.log("Invalid ajax haggle");
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
