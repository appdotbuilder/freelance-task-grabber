<?php

use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserTaskController;
use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', [TaskController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();
        
        // Redirect regular users to the main task browsing
        if ($user->isUser()) {
            return redirect()->route('home');
        }
        
        // For admins and superadmins, show dashboard
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Task routes
    Route::get('/categories/{category}/tasks', [TaskController::class, 'show'])->name('categories.show');
    Route::post('/tasks/take', [TaskController::class, 'store'])->name('tasks.take');
    
    // User task routes
    Route::get('/my-tasks/{task}', [UserTaskController::class, 'show'])->name('user-tasks.show');
    Route::post('/my-tasks/{task}/proof', [UserTaskController::class, 'update'])->name('user-tasks.proof');
    
    // Wallet route
    Route::get('/wallet', [WalletController::class, 'index'])->name('wallet');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
