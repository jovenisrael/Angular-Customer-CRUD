<?php

namespace App\Services;

use Elastic\Elasticsearch\Client;
use Elastic\Elasticsearch\Exception\ClientResponseException;

class ElasticsearchService
{
    protected $client;

    protected $index = 'customers';

    public function __construct(Client $client)
    {
        $this->client = $client;
        $this->createIndexIfNotExists();
    }

    protected function createIndexIfNotExists(): void
    {
        try {
            if (!$this->client->indices()->exists(['index' => $this->index])) {
                $this->client->indices()->create([
                    'index' => $this->index,
                    'body' => [
                        'settings' => [
                            'number_of_shards' => 1,
                            'number_of_replicas' => 0,
                        ],
                        'mappings' => [
                            'properties' => [
                                'firstname' => ['type' => 'text'],
                                'lastname' => ['type' => 'text'],
                                'email' => ['type' => 'keyword'],
                                'contact_number' => ['type' => 'keyword'],
                                // Add other fields here as needed
                            ],
                        ],
                    ],
                ]);
            }
        } catch (ClientResponseException $e) {
            // Handle exceptions, e.g. log error
            // If index exists, you might get an error, so you can ignore or handle it accordingly
        }
    }

    protected function ensureIndexExists(): void
    {
        $retries = 5;
        while ($retries > 0) {
            try {
                if (!$this->client->indices()->exists(['index' => $this->index])) {
                    $this->client->indices()->create([
                        'index' => $this->index,
                        'body' => [
                            // mappings and settings
                        ],
                    ]);
                }
                break; // success
            } catch (\Exception $e) {
                $retries--;
                sleep(2);
                if ($retries == 0) {
                    throw $e; // rethrow after max attempts
                }
            }
        }
    }
    
    
    public function indexCustomer(array $data): void
    {
        $this->ensureIndexExists();
    
        $this->client->index([
            'index' => $this->index,
            'id' => $data['id'],
            'body' => $data,
        ]);
    }
    
    public function searchCustomers(string $query): array
    {
        $this->ensureIndexExists();
    
        $response = $this->client->search([
            'index' => $this->index,
            'body' => [
                'query' => [
                    'multi_match' => [
                        'query' => $query,
                        'fields' => ['firstname', 'lastname', 'email', 'contact_number'],
                    ],
                ],
            ],
        ]);
    
        return array_column($response['hits']['hits'], '_source');
    }
    

    public function deleteCustomer(int $id): void
    {
        $this->client->delete([
            'index' => $this->index,
            'id' => $id,
        ]);
    }
}
