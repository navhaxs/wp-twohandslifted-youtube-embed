// "YouTube watch party embed shortcode for WordPress"
// Jeremy Wong 2020 for CBS
// v1.0

// YouTube API expects this function
var onYouTubeIframeAPIReady;

// safely wrap jQuery code for WordPress
jQuery(document).ready(function($) {

    // 1. Get shortcode parameters
    var shortcodeParams = window.twohandsliftedYoutubeEmbedParams;
    var start_time = shortcodeParams.start_time ? Date.parse(shortcodeParams.start_time) : null;

    // DEV
    // DEV
    // DEV
    // DEV
    start_time = new Date().setSeconds((new Date()).getSeconds() + 0);
    // DEV
    // DEV
    // DEV
    // DEV


    // 2. This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // 3. This function creates an <iframe> (and YouTube player)
    //    after the API code downloads.
    var player;
    onYouTubeIframeAPIReady = function() {
        player = new YT.Player('twohandslifted_youtubewatchparty_player', {
            // host: 'https://www.youtube-nocookie.com', // disables "Watch later" button
            videoId: shortcodeParams.video_id,
            playerVars: {
                modestbranding: true,
                origin: window.location.origin,
                rel: 0
            },
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange
            }
        });
    }

    var corrected_time_now;

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {

        // Register button events
        $('#twohandslifted_youtubewatchparty_unmute').on('click', function() {
            player.unMute();
            document.getElementById('twohandslifted_youtubewatchparty_unmute').style.visibility = 'collapse';
        });

        $('#twohandslifted_youtubewatchparty_sync').on('click', function() {
            syncVideo(corrected_time_now, true);
            document.getElementById('twohandslifted_youtubewatchparty_sync').style.visibility = 'collapse';
        });

        // Begin the synced clock loop
        if (sync_clock_interval == null) {
            sync_clock_interval = syncClockInterval((synced_time) => {
                syncVideo(synced_time);
            }, 1000);
        }
    }

    // 5. The API calls this function when the player's state changes.
    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PAUSED && done && shortcodeParams.enable_sync_button === "1") {
            document.getElementById("twohandslifted_youtubewatchparty_sync").style.visibility = 'visible';
        }
    }

    function maybePlayVideo(user_initiated = false) {

        player.playVideo();

        if (!user_initiated) {
            // Most browsers will not autoplay (unless muted) when the action was NOT user initiated :(
            player.mute();
            player.playVideo();

            // Display 'Tap to unmute' button
            document.getElementById("twohandslifted_youtubewatchparty_unmute").style.visibility = 'visible';
        }
    }

    var sync_clock_interval = null;

    // This is the main loop
    var done = false;

    function syncVideo(synced_time = null, user_initiated = false) {
        const now = synced_time || Date.now();
        const difference = start_time ? getSecondsBetweenDates(now, start_time) : 0;

        if (difference >= 0) {
            updatePlayerVisiblity(true);

            // if (sync_clock_interval != null) {
            //     clearInterval(sync_clock_interval);
            // }

            if (!done || user_initiated) {
                done = true;

                // catch up to live point
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

    function updatePlayerVisiblity(visible = true) {
        var youtube = document.getElementById("twohandslifted_youtubewatchparty_player");
        var overlay = document.getElementById("twohandslifted_youtubewatchparty_overlay");
        var wait = document.getElementById("twohandslifted_youtubewatchparty_wait");
        if (visible) {
            youtube.style.visibility = 'visible';
            overlay.style.visibility = 'visible';
            wait.style.visibility = 'hidden';
        } else {
            youtube.style.visibility = 'hidden';
            overlay.style.visibility = 'hidden';
            wait.style.visibility = 'visible';
        }
    }

    function renderWaitingRoom() {
        const elem = $('#twohandslifted_youtubewatchparty_wait');
        if (elem.children().length == 0) {
            var root = document.getElementById("twohandslifted_youtubewatchparty_wait");
            elem.empty();
            addElement(root, "h3", "mt0 pb2 mb0").innerText = "Stay Tuned!";
            addElement(root, "p", "mt0 pb2 mb0").innerText = "The evening session will begin at 7:30PM";
        }
    }

    function addElement(rootElement, tag, classList) {
        var newChildElement = document.createElement(tag);
        newChildElement.setAttribute("class", classList);
        rootElement.appendChild(newChildElement);
        return newChildElement;
    };

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

});