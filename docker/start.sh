#!/bin/bash

# Fix permissions
chown -R www-data:www-data /var/www
chmod -R ug+rw /var/www

# Start PHP-FPM
php-fpm
