<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\TicketAssignmentController;
use App\Http\Controllers\Api\TicketStatusController;
use App\Http\Controllers\Api\TicketCommentController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AiSummaryController;
use App\Http\Controllers\Api\TechnicianController;

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1');

/*
|--------------------------------------------------------------------------
| Protected routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Auth
    |--------------------------------------------------------------------------
    */

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |--------------------------------------------------------------------------
    | Clients (admin only)
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:admin')->group(function () {
        Route::get('/clients', [ClientController::class, 'index']);
        Route::post('/clients', [ClientController::class, 'store']);
        Route::get('/clients/{client}', [ClientController::class, 'show']);
        Route::put('/clients/{client}', [ClientController::class, 'update']);
        Route::delete('/clients/{client}', [ClientController::class, 'destroy']);
        Route::get('/dashboard', [DashboardController::class, 'index']);
    });

    /*
    |--------------------------------------------------------------------------
    | Tickets
    |--------------------------------------------------------------------------
    */

    // Lecture des tickets : admin voit tout, technicien voit ses tickets assignés
    Route::middleware('role:admin,technicien')->group(function () {
        Route::get('/tickets', [TicketController::class, 'index']);
        Route::get('/tickets/{ticket}', [TicketController::class, 'show']);
        Route::match(['post', 'patch'], '/tickets/{ticket}/status', [TicketStatusController::class, 'update']);
        Route::post('/tickets/{ticket}/comments', [TicketCommentController::class, 'store']);
        Route::post('/tickets/{ticket}/generate-summary', [AiSummaryController::class, 'generate'])
            ->middleware('throttle:10,1');
    });

    // Création / modification ticket : admin seulement
    Route::middleware('role:admin')->group(function () {
        Route::post('/tickets', [TicketController::class, 'store']);
        Route::patch('/tickets/{ticket}', [TicketController::class, 'update']);
        Route::post('/tickets/{ticket}/assign', [TicketAssignmentController::class, 'assign']);
    });


});

/*
|--------------------------------------------------------------------------
| Technicians (admin only)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/technicians', [TechnicianController::class, 'index']);
});

/*
|--------------------------------------------------------------------------
| Technician dashboard
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:technicien'])->group(function () {
    Route::get('/technician/dashboard', [DashboardController::class, 'technicianDashboard']);
});
