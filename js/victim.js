// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
/* global console: true, _: true, chance: true */ /* ,alert: true */

var main = function () {
    "use strict";

    var hostname = "http://" + window.location.hostname;

    var urlhash = (window.location.search).substring(1).split("=")[1];
    console.log("hash", urlhash)

    var $ransom = {
        server: {
            db: hostname + ":3000"
        },
        victimPage: {
            content: ".ransom-content",
        }
    };

    function loadRansom(urlhash) {
        var $img = "";
        var $msg = "";

        $.ajax({
            url: $ransom.server.db + "/demands?hash=" + urlhash,
            dataType: "json",
            method: "GET",
            success: function (result) {

                // result is an array if it return
                if (result.length === 1) {
                    $msg = result[0].demand;
                    $("#mwahaha").text(result[0].demand);

                    console.log("photoId", result[0].photoId);
                    $img = result[0].photoId;

                    $.ajax({
                        url: $ransom.server.db + "/photos?id=" + $img,
                        dataType: "json",
                        method: "GET",
                        success: function (result) {

                            // result is an array if it return
                            if (result.length === 1) {
                                console.log("src", result[0].src);
                                $("#redhanded").attr("src", "../" + result[0].src);

                            } else if (result.length > 1) {
                                // We have duplicate photos.
                                console.log("error: duplicate photo")
                                return false;
                            }
                        },
                        error: function (result) {
                            console.log("ajax error " + result.status);
                        }
                    });

                } else if (result.length > 1) {
                    // We have duplicate demands.
                    console.log("error: duplicate demand")
                    return false;
                }
            },
            error: function (result) {
                console.log("ajax error " + result.status);
            }
        });
    }

    loadRansom(urlhash)
};

$(document).ready(main);
