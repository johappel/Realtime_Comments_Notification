# Realtime Comments

Dieses WordPress-Plugin prüft im Frontend auf neue Kommentare via Heartbeat und lädt diese bei Bedarf nach. Es nutzt das Plugin "[Lazy Load for Comments](https://de.wordpress.org/plugins/lazy-load-for-comments/)" von Joel James, um Kommentare automatisch nachzuladen. Deshalb sollte dieses Plugin ebenfalls installiert und aktiviert sein.

## Installation

1. Installiere und aktiviere das Plugin "Lazy Load for Comments".
2. Installiere und aktiviere das "Realtime Comments" Plugin.

## Hooks for Developers

### Heartbeat Empfang

Filter, um den Heartbeat zu empfangen und die Kommentare für einen bestimmten Post zu laden.

```php
add_filter('rtc_heartbeat', function(array $response, array $post_data) {
    // Füge hier deinen Code ein
});
```

Verwende `$post_data['post_id']`, um die ID des Posts zu erhalten, für den die Kommentare geladen werden sollen.

### Init JS Object

Filter, um das JS-Objekt zu initialisieren, das für den Heartbeat benötigt wird.

```php
add_filter('rtc_js_object', function(array $js_object) {
    $js_object = [
        'ajaxurl' => admin_url('admin-ajax.php'),
        'action' => 'rtc_heartbeat',
        'nonce' => wp_create_nonce('rtc_heartbeat'),
        'interval' => 15,
        'post_id' => get_the_ID(),
    ];
    return $js_object;
});
```

## Lizenz

Dieses Plugin wird unter der [GPLv2-Lizenz](https://www.gnu.org/licenses/old-licenses/gpl-2.0.de.html) veröffentlicht.
