// "YouTube watch party embed shortcode for WordPress"
// Jeremy Wong 2020 for CBS
// v1.0

// YouTube API expects this function
var onYouTubeIframeAPIReady;

// safely wrap jQuery code for WordPress
jQuery(document).ready(function ($) {

    // 1. Get shortcode parameters
    var shortcodeAtts = window.twohandsliftedYoutubeEmbedAtts;

    // DEV
    // DEV
    // DEV
    // DEV
    var dt = new Date();
    dt.setSeconds( dt.getSeconds() + 60 );

    var start_time = dt; // shortcodeAtts.dt;//Date.parse()
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
    onYouTubeIframeAPIReady = function () {
        player = new YT.Player('player', {
            height: '390',
            width: '640',
            videoId: shortcodeAtts.videoid,
            playerVars: {
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
        event.target.mute();
        // event.target.playVideo();

        syncVideo();

        $('#mutevideo').on('click', function () {
            player.unMute();
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
            
            if (registered_interval != null) {
                clearInterval(registered_interval);
            }

            // catch up to live point
            player.playVideo();
            player.seekTo(difference, true);
        }
        else if (difference < 0) {
            // wait for start time to release the video

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
    
});
