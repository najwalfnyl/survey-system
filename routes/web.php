<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SurveyController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Survey;

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

Route::get('/status-survey/{slug}', function ($slug) {
    $survey = Survey::where('slug', $slug)->firstOrFail();
    return Inertia::render('StatusSurvey', [
        'slug' => $slug,
        'surveyId' => $survey->id,
    ]);
})->middleware('auth')->name('status-survey');

Route::get('/analyze-survey/{slug}', [SurveyController::class, 'analyze'])->name('analyze-survey.show');


Route::get('/collect-survey/{slug}', function ($slug) {
    $survey = Survey::where('slug', $slug)->firstOrFail();

    return Inertia::render('CollectResponse', [
        'survey' => $survey
    ]);
})->middleware('auth')->name('collect-survey.show');

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

Route::get('/dashboard', [SurveyController::class, 'dashboard'])->middleware(['auth'])->name('dashboard');

Route::get('/analyze-survey/{slug}/export', [SurveyController::class, 'exportCsv'])->name('survey.export');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/survey-preview/{slug}', function ($slug) {
        $survey = Survey::where('slug', $slug)
            ->with('questions.options') // ← ini penting
            ->firstOrFail();
    
        return Inertia::render('SurveyPreview', [
            'survey' => $survey,
        ]);
    })->name('survey-preview');
});

Route::post('/surveys', [SurveyController::class, 'store']);
Route::patch('/surveys/{survey}/update-title', [SurveyController::class, 'updateTitle']);
Route::get('/respond/{slug}', function ($slug) {
    $survey = Survey::where('slug', $slug)->with('questions.options')->firstOrFail();
    return Inertia::render('RespondSurvey', ['survey' => $survey]);
})->name('respond-survey');

Route::post('/status-survey/{slug}/set-status', [SurveyController::class, 'setStatus'])->middleware('auth');

Route::get('/edit-survey/{slug}', function ($slug) {
    $survey = \App\Models\Survey::with('questions.options')->where('slug', $slug)->firstOrFail();
    return Inertia::render('CreateSurvey', [  // pakai CreateSurvey view
        'mode' => 'edit',
        'survey' => $survey
    ]);
})->middleware('auth')->name('survey.edit');

require __DIR__.'/auth.php';
