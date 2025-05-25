<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\ResponseController;
use App\Http\Controllers\API\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes - Disusun untuk pemula
|--------------------------------------------------------------------------
| Public routes: Bisa diakses tanpa login (frontend bisa fetch langsung)
| Auth routes: Pakai Sanctum kalau login sudah aktif
*/

// ========================
// 📢 PUBLIC ROUTES
// ========================

// Login API
Route::post('/login', [AuthController::class, 'login']);

// Ambil survei via slug
Route::get('/survey-link/{slug}', [SurveyController::class, 'getBySlug']);

// Submit jawaban responden
Route::post('/surveys/{surveyId}/responses', [ResponseController::class, 'store']);

Route::post('/respond/{slug}', [SurveyController::class, 'storeResponses']);

// ========================
// 🔐 AUTH ROUTES
// ========================
Route::middleware('auth:sanctum')->group(function () {

    // Dapatkan user yang login (cek token valid atau tidak)
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Logout API
    Route::post('/logout', [AuthController::class, 'logout']);

    // CRUD dasar survei
    Route::get('/surveys', [SurveyController::class, 'index']);
    Route::post('/surveys', [SurveyController::class, 'store']);
    Route::get('/surveys/{survey}', [SurveyController::class, 'show']);
    Route::patch('/surveys/{survey}/update-title', [SurveyController::class, 'updateTitle']);
    // Route::post('/surveys/{survey:slug}/set-status', [SurveyController::class, 'setStatus']);
    Route::post('/surveys/{survey}/questions', [SurveyController::class, 'storeQuestions']);
Route::patch('/status-survey/{slug}/set-status', [SurveyController::class, 'setStatus']);

    // Lihat semua response dari satu survei
    Route::get('/surveys/{surveyId}/responses', [ResponseController::class, 'index']);

    Route::get('/api/analyze-survey/{slug}', [SurveyController::class, 'analyze'])->name('survey.analyze');

// Untuk ambil summary data JSON
Route::get('/api/surveys/{survey}/analyze', [SurveyController::class, 'analyzeSummary']);

});