<?php

/**
 * Plugin Name: Realtime Comments Notification
 * Description: Benachrichtigt Besucher über neue Kommentare und lädt diese via AJAX. Dieses Plugin nutzt "Lazy Load for Comments" von Joel James, zum automatischen Nachladen der Kommentare. Deshalb sollte dieses Plugin ebenfalls installiert und aktiviert sein.
 * Version: 0.0.1
 * Author: Joachim Happel
 */

class Realtime_Comments_Notification
{
    public function __construct()
    {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_filter('heartbeat_send', array($this,'send_heartbeat_data'));
        add_filter('heartbeat_received', array($this,'receive_heartbeat'), 10, 2);

    }

    public function send_heartbeat_data($response)
    {
        return $response;
    }
    public function receive_heartbeat($response, $data)
    {
        error_log('receive_heartbeat');


        $post_id = intval($data['post_id']);
        $last_number = $this->get_comments_number($post_id);
        $first_number = intval($data['first_number']);

        $response['realtime_comments'] = array(
            'post_id' => $post_id,
            'last_number' => $last_number,
            'first_number' => $first_number,
            'new_comments_count' => $last_number - $first_number,
            'has_new_comments' => $last_number > $first_number

        );
        // Filter the response data
        $response = apply_filters('rtc_heartbeat',$response, $data);
        return $response;
    }
    public function get_comments_number($post_id)
    {
        $comments = get_comments(array(
            'post_id' => $post_id,
            'status' => 'approve'
        ));
        return count($comments);
    }
    public function enqueue_scripts()
    {
        if (is_singular() && comments_open()) {
            wp_enqueue_script('heartbeat');
            wp_enqueue_script('realtime-comments', plugin_dir_url(__FILE__) . 'js/realtime-comments.js', array('jquery'), '1.0', true);

            $js_object = array(
                'ajax_url' => admin_url('admin-ajax.php'),
                'post_id' => get_the_ID(),
                'first_number' => get_comments_number()
            );
            $js_object = apply_filters('rtc_js_object', $js_object);

            wp_localize_script('realtime-comments', 'realtime_comments_obj', $js_object);
        }
    }


}

$realtime_comments_notification = new Realtime_Comments_Notification();
