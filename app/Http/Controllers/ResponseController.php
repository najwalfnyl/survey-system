<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Response;
use App\Models\Answer;

class ResponseController extends Controller
{
    public function store(Request $request, $surveyId)
    {
        $request->validate([
            'survey_respondent_id' => 'required|exists:survey_respondents,id',
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:survey_questions,id',
            'answers.*.option_id' => 'nullable|exists:survey_question_options,id',
            'answers.*.answer_text' => 'nullable|string',
        ]);

        $response = Response::create([
            'survey_id' => $surveyId,
            'survey_respondent_id' => $request->survey_respondent_id,
            'submitted_at' => now(),
        ]);

        foreach ($request->answers as $ans) {
            Answer::create([
                'response_id' => $response->id,
                'question_id' => $ans['question_id'],
                'option_id' => $ans['option_id'] ?? null,
                'answer_text' => $ans['answer_text'] ?? null,
            ]);
        }

        return response()->json(['message' => 'Response submitted successfully']);
    }

    public function index($surveyId)
    {
        $responses = Response::with('answers')->where('survey_id', $surveyId)->get();
        return response()->json($responses);
    }
}
