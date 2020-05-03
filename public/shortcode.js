// "YouTube watch party embed shortcode for WordPress"
// Jeremy Wong 2020 for CBS
// v1.0

// YouTube API expects this function
var onYouTubeIframeAPIReady;

// safely wrap jQuery code for WordPress
jQuery(document).ready(function($) {

    // 1. Get shortcode parameters
    var shortcodeAtts = window.twohandsliftedYoutubeEmbedAtts;
    var start_time = Date.parse(shortcodeAtts.start_time);

    // DEV
    // DEV
    // DEV
    // DEV
    start_time = new Date().setSeconds((new Date()).getSeconds() + 10);
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
            videoId: shortcodeAtts.video_id,
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

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {

        event.target.playVideo();

        if (player.getPlayerState() !== 1) {
            // Most browsers will not autoplay unless muted :(
            event.target.mute();
            event.target.playVideo();

            // Display 'Tap to unmute' button
            document.getElementById("twohandslifted_youtubewatchparty_unmute").style.visibility = 'visible';
        }

        syncVideo();

        $('#twohandslifted_youtubewatchparty_unmute').on('click', function() {
            player.unMute();
            $('#twohandslifted_youtubewatchparty_unmute').remove();
        });

    }

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    function onPlayerStateChange(event) {
        // if (event.data == YT.PlayerState.PLAYING && !done) {
        //     setTimeout(stopVideo, 6000);
        //     done = true;
        // }
    }

    var registered_interval = null;

    function syncVideo() {
        // start video if check
        const now = Date.now();

        const difference = getSecondsBetweenDates(now, start_time);
        console.error(difference);

        if (difference >= 0) {
            updatePlayerVisiblity(true);

            if (registered_interval != null) {
                clearInterval(registered_interval);
            }

            // catch up to live point
            player.playVideo();
            player.seekTo(difference, true);
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

            if (registered_interval == null) {
                registered_interval = setInterval(() => {
                    syncVideo();
                }, 200);
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

});