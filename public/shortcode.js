"use strict";

// YouTube API expects this function
var onYouTubeIframeAPIReady = function() {

};

// safely wrap jQuery code for WordPress
jQuery(document).ready(function($) {
    var embedsArray = $(".twohandslifted_youtubewatchparty_videoWrapper");

    if (embedsArray.length == 0) {
        return;
    }

    // Register our callback for once the YouTube API code has downloaded and loaded
    onYouTubeIframeAPIReady = function() {
        embedsArray.map(function(index, instance) {
            createInstance(index, instance);
        });
    }

    // This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    function createInstance(index, rootElement) {
        // 1. Get shortcode parameters
        var instanceId = $(rootElement).attr('data-instance-id');

        var shortcodeParams = window['twohandsliftedYoutubeEmbedParams' + instanceId];
        var start_time = null;

        if (shortcodeParams.start_time != null && shortcodeParams.start_time != "0") {
            start_time = Date.parse(shortcodeParams.start_time);
        }

        if (start_time != null && shortcodeParams.debug === "1") {
            start_time = new Date().setSeconds(new Date().getSeconds() + 10);
        }

        // 2. This function creates an <iframe> (and YouTube player)
        var player = new YT.Player('twohandslifted_youtubewatchparty_player' + instanceId, {
            videoId: shortcodeParams.video_id,
            playerVars: {
                modestbranding: true,
                origin: window.location.origin,
                enablejsapi: true,
                rel: 0
            },
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange
            }
        });

        var unmuteButton = $(rootElement).find('.twohandslifted_youtubewatchparty_unmute');
        var syncButton = $(rootElement).find('.twohandslifted_youtubewatchparty_sync');
        // only the first (topmost in the WP Page) video should autoplay, unless overriden
        var autoplay_feature_enabled = index === 0 || shortcodeParams.autoplay === '1';
        var sync_feature_enabled = start_time !== null && shortcodeParams.enable_sync_button === '1';
        var corrected_time_now; // Date

        var sync_clock_interval = null; // setInterval id
        var watch_unmute_interval = null; // setInterval id

        // 4. The API will call this function when the video player is ready.

        function onPlayerReady(event) {

            if (!autoplay_feature_enabled) {
                hideUnmuteButton();
                updatePlayerVisiblity(true);
                return;
            }

            // Register button events
            unmuteButton.on('click', function() {
                player.unMute();
                hideUnmuteButton();
                clearInterval(watch_unmute_interval);
            });
            syncButton.on('click', function() {
                syncVideo(corrected_time_now, true);
                syncButton.css('visibility', 'collapse');
            });

            watch_unmute_interval = setInterval(watchUnmute, 200);

            if (!sync_feature_enabled) {
                // Immediately autoplay video
                syncVideo(null);
            } else if (sync_clock_interval == null) {
                // Begin the synced clock loop
                sync_clock_interval = syncClockInterval(function(synced_time) {
                    syncVideo(synced_time);
                }, 1000);
            }
        }

        function watchUnmute() {
            if (!player.isMuted()) {
                hideUnmuteButton();
                clearInterval(watch_unmute_interval);
            }
        }

        function hideUnmuteButton() {
            unmuteButton.css('visibility', 'collapse');
            unmuteButton.css('display', 'none');
        }

        // 5. The API calls this function when the player's state changes.
        function onPlayerStateChange(event) {
            if (event.data == YT.PlayerState.PAUSED && done && sync_feature_enabled) {
                syncButton.css('visibility', 'visible');
            }
        }

        function maybePlayVideo() {
            var user_initiated = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
            player.playVideo();

            if (!user_initiated) {
                // Most browsers will not autoplay (unless muted) when the action was NOT user initiated :(
                player.mute();
                player.playVideo(); // Display 'Tap to unmute' button

                unmuteButton.css('visibility', 'visible');
                unmuteButton.css('display', 'block');
            }
        } // This is the main loop


        var done = false;

        function syncVideo() {
            var synced_time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
            var user_initiated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var now = synced_time || Date.now();
            var difference = start_time ? getSecondsBetweenDates(now, start_time) : 0;

            if (difference >= 0) {
                updatePlayerVisiblity(true);

                if (!done || user_initiated) {
                    done = true; // catch up to live point

                    maybePlayVideo(user_initiated);
                    player.seekTo(difference, true);
                }
            } else if (difference < 0) {
                // wait for start time to release the video
                updatePlayerVisiblity(false);
                renderWaitingRoom();

                if (player.getCurrentTime() !== 0) {
                    player.seekTo(0, true);
                }

                if (player.getPlayerState() === 1) {
                    player.stopVideo();
                }
            }
        }

        function getSecondsBetweenDates(from_time, to_time) {
            var dif = from_time - to_time;
            return dif / 1000;
        }

        function updatePlayerVisiblity() {
            var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            var youtube = $(rootElement).find('#twohandslifted_youtubewatchparty_player' + instanceId);
            var overlay = $(rootElement).find('.twohandslifted_youtubewatchparty_overlay');
            var wait = $(rootElement).find('.twohandslifted_youtubewatchparty_wait');

            if (visible) {
                youtube.css('visibility', 'visible');
                overlay.css('visibility', 'visible');
                wait.css('visibility', 'hidden');
            } else {
                youtube.css('visibility', 'hidden');
                overlay.css('visibility', 'hidden');
                wait.css('visibility', 'visible');
            }
        }

        function renderWaitingRoom() {
            var wait = $(rootElement).find('.twohandslifted_youtubewatchparty_wait');

            if (wait.children().length == 0) {
                wait.empty();
                addElement(wait.get(0), "h3", "").innerText = shortcodeParams.wait_title;
                addElement(wait.get(0), "p", "").innerText = shortcodeParams.wait_text;
            }
        }

        function addElement(rootElement, tag, classList) {
            var newChildElement = document.createElement(tag);
            newChildElement.setAttribute("class", classList);
            rootElement.appendChild(newChildElement);
            return newChildElement;
        }

        ;

        function getSrvTime() {
            var xmlHttp;

            try {
                //FF, Opera, Safari, Chrome
                xmlHttp = new XMLHttpRequest();
            } catch (err1) {
                //IE
                try {
                    xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
                } catch (err2) {
                    try {
                        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
                    } catch (eerr3) {
                        //AJAX not supported, use local machine time
                        console.error("twohandslifted_youtubewatchparty_player: AJAX not supported");
                        return null;
                    }
                }
            }

            xmlHttp.open('HEAD', window.location.href.toString(), false);
            xmlHttp.setRequestHeader("Content-Type", "text/html");
            xmlHttp.send('');
            return xmlHttp.getResponseHeader("Date");
        }

        function syncClockInterval(callback) {
            var serverTime = new Date(getSrvTime());
            var localTime = +Date.now();
            var timeDiff = serverTime - localTime;
            console.log('twohandslifted_youtubewatchparty_player: timeDiff=' + timeDiff);
            return setInterval(function() {
                corrected_time_now = +Date.now() + timeDiff;
                callback && callback(corrected_time_now);
            }, 1000);
        }
    }
});