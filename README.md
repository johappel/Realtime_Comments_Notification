# Realtine Comments


Dieses WordPress-Plugin prüft im Frontend auf neue Kommentare via Heartbeat und lädt diese bei Bedarf nach. 
Es nutzt "[Lazy Load for Comments](https://de.wordpress.org/plugins/lazy-load-for-comments/)" von Joel James, zum automatischen Nachladen der Kommentare. 
Deshalb sollte dieses Plugin ebenfalls installiert und aktiviert sein.

# Hooks for Developers

### Recieve Hartbeat 
```php
    add_filter('rtc_heartbeat',array $response, array $post_data);
```
ID des Posts, für den die Kommentare geladen werden sollen.
```php
    $post_data['post_id']
```

### Init JS Object
```php
    add_filter('rtc_js_object', array $js_object);
```

```php
    $js_object= [
    'ajaxurl' => admin_url('admin-ajax.php'),
    'action' => 'rtc_heartbeat',
    'nonce' => wp_create_nonce('rtc_heartbeat'),
    'interval' => 15,
    'post_id' => get_the_ID(),
    ]
```
