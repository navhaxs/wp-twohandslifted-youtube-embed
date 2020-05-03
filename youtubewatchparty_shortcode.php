<?php

const VERSION = '1.0.0';

function twohandslifted_youtubewatchparty_wp_enqueue_scripts()
{
    wp_register_style('twohandslifted-youtubewatchparty', plugins_url('/public/style.css', __FILE__), array(), VERSION, 'all');
    wp_register_script('twohandslifted-youtubewatchparty', plugins_url('/public/shortcode.js', __FILE__) , array('jquery'), VERSION, false);
}

add_action('wp_enqueue_scripts', 'twohandslifted_youtubewatchparty_wp_enqueue_scripts');

add_shortcode('YouTubeWatchParty', function ($atts) {

    $instance_id = uniqid();

    $params = shortcode_atts( array(
        'instance_id' => $instance_id,
        'video_id' => null,
        'start_time' => null,
        'width' => 853,
        'height' => 505,
        'enable_sync_button' => true,
        'debug' => false,
        'wait_title' => "Stay Tuned!",
        'wait_text' => "This is a scheduled video"
    ), $atts );

    wp_enqueue_style('twohandslifted-youtubewatchparty');
    wp_enqueue_script('twohandslifted-youtubewatchparty');
    wp_localize_script('twohandslifted-youtubewatchparty','twohandsliftedYoutubeEmbedParams' . $instance_id ,$params);

    if ($params['video_id'] == null) {
        ob_start();
        echo '<div>video_id must be set</div>';
        return ob_get_clean();    
    }

    // output plugin html
    ob_start();
    echo '<div data-instance-id="' . $instance_id . '" class="twohandslifted_youtubewatchparty_videoWrapper" style="height: ' . $params['height'] . 'px; max-width: ' . $params['width'] . 'px;">';
    // NOTE: The <iframe> (and video player) will replace this <div> tag
    echo '<div class="twohandslifted_youtubewatchparty_overlay">';
    echo '<div class="twohandslifted_youtubewatchparty_button twohandslifted_youtubewatchparty_sync"><svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M13,6V18L21.5,12M4,18L12.5,12L4,6V18Z" /></svg>Resume live playback</div>';
    echo '<div class="twohandslifted_youtubewatchparty_button twohandslifted_youtubewatchparty_unmute">Tap to unmute</div>';
    echo '</div>';
    echo '<div id="twohandslifted_youtubewatchparty_player' . $instance_id . '"></div>';
    echo '<div class="twohandslifted_youtubewatchparty_wait"></div>';
    echo '</div>';
    return ob_get_clean();
});
