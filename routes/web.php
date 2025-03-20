<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SurveyController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/create-survey', function () {
    return Inertia::render('CreateSurvey');
})->name('create-survey');

Route::get('/status-survey', function () {
    return Inertia::render('StatusSurvey');
})->name('status-survey');

Route::get('/analyze-survey', function () {
    return Inertia::render('AnalyzeSurvey');
})->name('analyze-survey');

Route::get('/collect-survey', function () {
    return Inertia::render('CollectResponse');
})->name('collect-survey');

Route::get('/survey-preview', function () {
    return Inertia::render('SurveyPreview');
})->name('survey.preview');

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::post('/surveys', [SurveyController::class, 'store']);
Route::patch('/surveys/{survey}/update-title', [SurveyController::class, 'updateTitle']);


require __DIR__.'/auth.php';
