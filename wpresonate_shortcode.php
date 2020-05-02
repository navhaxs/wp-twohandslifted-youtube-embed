<?php

function wpse_165754_avatar_shortcode_wp_enqueue_scripts()
{
    //wp_register_style('get-avatar-style', plugins_url('/css/style.css', __FILE__), array(), '1.0.0', 'all');
    wp_register_script('twohandslifted-youtube-embed', plugin_dir_url( __FILE__ ) . 'public/shortcode.js', array( 'jquery' ), '1.0.0', false );
}

add_action('wp_enqueue_scripts', 'wpse_165754_avatar_shortcode_wp_enqueue_scripts');
// if (function_exists('get_avatar')) {
//     function wpse_165754_user_avatar_shortcode($attributes)
//     {

//         global $current_user;
//         get_currentuserinfo();

//         extract(shortcode_atts(
//             array(
//                 "id"      => $current_user->ID,
//                 "size"    => 32,
//                 "default" => 'mystery',
//                 "alt"     => '',
//                 "class"   => '',
//             ),
//             $attributes,
//             'get_avatar'
//         ));

//         $get_avatar = get_avatar($id, $size, $default, $alt);

//         wp_enqueue_script('twohandslifted-youtube-embed');

//         return '<span class="get_avatar ' . $class . '">' . $get_avatar . '</span>';
//     }

//     add_shortcode('get_avatar', 'wpse_165754_user_avatar_shortcode');
// }

add_shortcode('WPResonateContent', function ($atts) {

    // set $url
    $church_id = get_option('wpresonate_church_id');
    $url = "https://admin.resonate.org.au/plugins/allchurchmedia?organisation=" . $church_id . "&section=.allsermonbox&results=6";
    if (isset($_GET['seriesname'])) {
        $url .= "&seriesname=" . urlencode($_GET['seriesname']);
    }

    wp_enqueue_script('twohandslifted-youtube-embed');

    // output resonate plugin html
    ob_start();
    echo '<script src="' . $url . '"></script>';
    echo '<div class="allsermonbox">';
    echo '<h1 style="text-align:center;"><a href="https://admin.resonate.org.au/all/?organisation=148">Resonate sermon portal</a></h1>';
    echo '<div align="center"><img src="https://admin.resonate.org.au/modules/theme/images/loading2.gif" style="margin-top:15px; width:25px;height:25px" /></div>';
    echo '</div>';
    // <!-- 1. The <iframe> (and video player) will replace this <div> tag. -->
    echo '<div id="player"></div>';
    return ob_get_clean();
});
