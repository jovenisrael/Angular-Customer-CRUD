<?php

return [
    'hosts' => [
        'http://' . env('ELASTICSEARCH_HOST', 'searcher') . ':' . env('ELASTICSEARCH_PORT', 9200),
    ],
];
