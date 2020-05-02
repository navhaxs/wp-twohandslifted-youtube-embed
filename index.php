<?php
/**
* Plugin Name: YouTube Watch Party Embed
* Plugin URI: http://myc.campusbiblestudy.org/
* Description: YouTube watch party embed shortcode for WordPress.
* Version: 1.0
* Author: Jeremy Wong
* Author URI: https://visionscreens.au.eu.org/
* License: GPLv2 or later
*/

// SHORTCODES
include( plugin_dir_path( __FILE__ ) . 'youtubewatchparty_shortcode.php');

function wpresonate_log_me($message) {
    if (WP_DEBUG === true) {
        if (is_array($message) || is_object($message)) {
            error_log(print_r($message, true));
        } else {
            error_log($message);
        }
    }
}
