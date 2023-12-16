<?php

use App\Http\Controllers\LocationController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('/index');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile/{username}', [ProfileController::class, 'show'])->name('profile.show');
});

Route::resource('locations', LocationController::class)->only(['index', 'store', 'create']);

require __DIR__.'/auth.php';
