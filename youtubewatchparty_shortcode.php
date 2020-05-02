<?php

const VERSION = '1.0.0';

function twohandslifted_youtubewatchparty_wp_enqueue_scripts()
{
    wp_register_style('twohandslifted-youtubewatchparty', plugins_url('/public/style.css', __FILE__), array(), VERSION, 'all');
    wp_register_script('twohandslifted-youtubewatchparty', plugins_url('/public/shortcode.js', __FILE__) , array('jquery'), VERSION, false);
}

add_action('wp_enqueue_scripts', 'twohandslifted_youtubewatchparty_wp_enqueue_scripts');

add_shortcode('YouTubeWatchParty', function ($atts) {

    $x = shortcode_atts( array(
        'video_id' => null,
        'start_time' => null,
        'width' => 853,
        'height' => 505,
    ), $atts );

    wp_enqueue_style('twohandslifted-youtubewatchparty');
    wp_enqueue_script('twohandslifted-youtubewatchparty');
    wp_localize_script('twohandslifted-youtubewatchparty','twohandsliftedYoutubeEmbedAtts',$x);

    // output plugin html
    ob_start();
    // <!-- 1. The <iframe> (and video player) will replace this <div> tag. -->
    echo '<div class="twohandslifted_youtubewatchparty_videoWrapper" style="height: ' . $x['height'] . 'px; width: ' . $x['width'] . 'px;">';
    echo '<div id="player"></div>';
    echo '</div>';
    return ob_get_clean();
});
