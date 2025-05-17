<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerRequest;
use App\Models\Customer;
use App\Services\ElasticsearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    protected $elasticsearch;

    public function __construct(ElasticsearchService $elasticsearch)
    {
        $this->elasticsearch = $elasticsearch;
    }

    public function index(Request $request): JsonResponse
    {
        $query = $request->query('search');

        if ($query) {
            $results = $this->elasticsearch->searchCustomers($query);
            return response()->json($results);
        }

        return response()->json(Customer::all());
    }

    public function store(CustomerRequest $request): JsonResponse
    {
        $customer = Customer::create($request->validated());

        // Index in Elasticsearch
        $this->elasticsearch->indexCustomer($customer->toArray());

        return response()->json($customer, 201);
    }

    public function show(Customer $customer): JsonResponse
    {
        return response()->json($customer);
    }

    public function update(CustomerRequest $request, Customer $customer): JsonResponse
    {
        $customer->update($request->validated());

        $this->elasticsearch->indexCustomer($customer->toArray());

        return response()->json($customer);
    }

    public function destroy(Customer $customer): JsonResponse
    {
        $customer->delete();

        $this->elasticsearch->deleteCustomer($customer->id);

        return response()->json(null, 204);
    }

    public function search(Request $request): JsonResponse
    {
        $query = $request->input('query');

        if (!$query) {
            return response()->json(['error' => 'Search query is required.'], 422);
        }

        $results = $this->elasticsearch->searchCustomers($query);

        return response()->json($results);
    }
}
