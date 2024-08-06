jQuery(document).ready(function($) {
    let currentCommentCount = realtime_comments_obj.first_number;
    // Benachrichtigung anzeigen
    function showNotification(newCommentCount, lastNumber) {
        const notification = $('<div class="comment-notification">' +
            'Es gibt ' + newCommentCount + ' neue Kommentare ' +
            '<button onclick="location.href=location.href+\'#\'+lastNumber" id="load-comments">Kommentare laden</button>' +
            '</div>');

        $('#comments').append(notification);


    }

    // Heartbeat Tick Event
    $(document).on('heartbeat-send.realtime-comments', function(event, data) {

        if (typeof realtime_comments_obj !== 'undefined') {
            data.post_id = realtime_comments_obj.post_id;
            data.first_number = realtime_comments_obj.first_number;
            console.log('send.realtime-comments', data);
        }

    });
    // Heartbeat Receive Event
    $(document).on('heartbeat-tick.realtime-comments', function(event, data) {
        console.info('tick.realtime-comments', data);
    });




    $(document).on('heartbeat-tick', function(e, data) {
         console.info('Heartbeat tick empfangen', data);
         if(data.hasOwnProperty('realtime_comments')){
             if(data.realtime_comments.has_new_comments === true){

                    console.log('New comments available');
                    loadComments();
                    //showNotification(data.realtime_comments.new_comments_count ,data.realtime_comments.last_number);

             }
         }

    });

    // Flag to check if comments are loaded already.
    var llcLoaded = 0;
    // Function that makes ajax request and loaded comments.
    var loadComments = function () {
        // Do not load again.
        if ( llcLoaded > 0 ) {
            return;
        }
        // Show loader div and element if not disabled.
        $( "#llc-comments-loader" ).show();
        // Data to send over ajax request.
        var data = {
            "action": "llc_load_comments",
            "post": $( "#llc_post_id" ).val(),
        };
        // Ajax request link.
        var llcajaxurl = $( "#llc_ajax_url" ).val();
        // Full url to get comments (Adding parameters).
        var commentUrl = llcajaxurl + '?' + $.param( data );
        // Make ajax request to get comments.
        $.get( commentUrl, function ( response ) {
            if ( response !== "" ) {
                $( "#llc_comments" ).html( response );
                // Initialize comments after lazy loading.
                if ( window.addComment && window.addComment.init ) {
                    window.addComment.init();
                }
                // Get the comment li id from url if exist.
                var commentId = document.URL.substr( document.URL.indexOf( "#comment" ) );
                // If comment id found, scroll to that comment.
                if ( commentId.indexOf( '#comment' ) > -1 ) {
                    $( window ).scrollTop( $( commentId ).offset().top );
                }

                // Woocommerce reviews compatibility.
                if ( $( '.wc-tabs .reviews_tab' ).length > 0 ) {
                    $( '#rating' ).trigger( 'init' );
                    // Make sure we are on reviews tab.
                    $( '.reviews_tab a' ).click();
                }
            }
        } );
        // Set comments load flag as 1.
        llcLoaded = 1;
    }


});
