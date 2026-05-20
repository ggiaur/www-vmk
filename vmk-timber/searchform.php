<?php

declare(strict_types=1);
?>
<form class="search-box search-box--standalone" role="search" method="get" action="<?php echo esc_url(home_url('/')); ?>">
    <label class="screen-reader-text" for="wp-search-field"><?php esc_html_e('Keresés', 'vmk-timber'); ?></label>
    <input id="wp-search-field" type="search" name="s" value="<?php echo esc_attr(get_search_query()); ?>" placeholder="<?php esc_attr_e('Keresés a tartalmak között', 'vmk-timber'); ?>">
    <button type="submit"><?php esc_html_e('Keresés', 'vmk-timber'); ?></button>
</form>
