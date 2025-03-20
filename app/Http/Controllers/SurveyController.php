<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Survey;

class SurveyController extends Controller
{
    public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'expected_respondents' => 'nullable|integer',
        'status' => 'required|in:draft,open',
        'link' => 'nullable|string|max:255',
        'qr_code' => 'nullable|string|max:255',
    ]);

    $survey = Survey::create([
        'user_id' => auth()->id(), // Ambil user yang sedang login
        'name' => $request->name,
        'expected_respondents' => $request->expected_respondents,
        'status' => $request->status,
        'link' => $request->link,
        'qr_code' => $request->qr_code,
    ]);

    return response()->json(['message' => 'Survey created successfully', 'survey' => $survey]);
}



    public function updateTitle(Request $request, Survey $survey)
{
    $request->validate([
        'name' => 'required|string|max:255',
    ]);

    $survey->update(['name' => $request->name]);

    return response()->json([
        'message' => 'Survey title updated successfully!',
        'survey' => $survey
    ]);
}

}

