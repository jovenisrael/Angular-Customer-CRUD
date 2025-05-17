<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CustomerController;

Route::get('customers/search', [CustomerController::class, 'search']);
Route::apiResource('customers', CustomerController::class);
