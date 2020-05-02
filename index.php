<?php
/**
* Plugin Name: WP Resonate
* Plugin URI: http://navhaxs.au.eu.org/wp-resonate-plugin/
* Description: Integrate Resonate Australia sermons with your WordPress site.
* Version: 1.0
* Author: Jeremy Wong
* Author URI: http://navhaxs.au.eu.org/
* License: GPLv2 or later
*/

const WPRESONATE_STORE = 'wpresonate_store';
const WPRESONATE_CHURCH_ID = 'wpresonate_church_id';
const WPRESONATE_PAGE_ID = 'wpresonate_page_id';
const WPRESONATE_LAST_FETCH = 'wpresonate_last_fetch';
const WPRESONATE_LAST_FETCH_DATA = 'wpresonate_last_fetch_data';
const WPRESONATE_QUERY_SIZE = '50'; // How many search results to request per API query
    
// SHORTCODES
include( plugin_dir_path( __FILE__ ) . 'wpresonate_shortcode.php');
// WIDGETS
// include( plugin_dir_path( __FILE__ ) . 'wpresonate_widget.php');
// SETTINGS
// include( plugin_dir_path( __FILE__ ) . 'wpresonate_settings.php');


// EBMED

function wpresonate_log_me($message) {
    if (WP_DEBUG === true) {
        if (is_array($message) || is_object($message)) {
            error_log(print_r($message, true));
        } else {
            error_log($message);
        }
    }
}
