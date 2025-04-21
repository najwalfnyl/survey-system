<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Collection;
use App\Models\Survey;
use Inertia\Inertia;


class SurveyController extends Controller
{
    public function index()
    {
        return Survey::with('questions.options')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'slug' => 'nullable|string|unique:surveys,slug',
            'status' => 'required|in:draft,open',
            'qr_code' => 'nullable|string|max:255',
        ]);

        $survey = Survey::create([
            'user_id' => auth()->id(),
            'title' => $request->title,
            'description' => $request->description,
            'slug' => $request->slug ?? \Str::random(10),
            'status' => $request->status,
            'qr_code' => $request->qr_code,
        ]);

        return response()->json([
            'message' => 'Survey created successfully',
            'survey' => $survey
        ]);
    }

    public function show(Survey $survey)
    {
        return $survey->load('questions.options');
    }

    public function updateTitle(Request $request, Survey $survey)
    {
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $survey->update(['title' => $request->title]);

        return response()->json([
            'message' => 'Survey title updated successfully!',
            'survey' => $survey
        ]);
    }

    public function getBySlug($slug)
    {
        $survey = Survey::where('slug', $slug)->with('questions.options')->firstOrFail();
        return response()->json($survey);
    }

    public function analyzeSummary(Survey $survey)
{
    $result = $survey->questions->map(function ($q) {
        $total = $q->answers->count();
        return [
            'question' => $q->question_text,
            'options' => $q->options->map(function ($o) use ($total) {
                $count = $o->answers->count();
                return [
                    'option' => $o->option_text,
                    'count' => $count,
                    'percent' => $total ? round(($count / $total) * 100) : 0
                ];
            }),
        ];
    });

    return response()->json($result);
}

    public function storeQuestions(Request $request, Survey $survey)
{
    $data = $request->validate([
        'questions' => 'required|array',
        'questions.*.question_text' => 'required|string',
        'questions.*.question_type' => 'required|string',
        'questions.*.choices' => 'nullable|array',
        'questions.*.likertLabels' => 'nullable|array',
        'questions.*.placeholder_text' => 'nullable|string',
    ]);    

    foreach ($data['questions'] as $q) {
        Log::info("Saving question", $q);
    
        $question = $survey->questions()->create([
            'question_text' => $q['question_text'],
            'question_type' => $q['question_type'],
            'placeholder_text' => $q['placeholder_text'] ?? null,
        ]);
    
        if ($q['question_type'] === 'Multiple Choices' && !empty($q['choices'])) {
            foreach ($q['choices'] as $choice) {
                if (!empty($choice)) {
                    $question->options()->create(['option_text' => $choice]);
                }
            }
        }
    
        if ($q['question_type'] === 'Likert Scale' && !empty($q['likertLabels'])) {
            foreach ($q['likertLabels'] as $label) {
                if (!empty($label)) {
                    $question->options()->create(['option_text' => $label]);
                }
            }
        }
    }
    
    return response()->json(['message' => 'Questions saved successfully']);
}

    // Survey.php
public function questions() {
    return $this->hasMany(SurveyQuestion::class);
}

// SurveyQuestion.php
public function options() {
    return $this->hasMany(SurveyQuestionOption::class);
}

public function setStatus(Request $request, $slug)
{
    $survey = Survey::where('slug', $slug)->firstOrFail();

    $data = $request->validate([
        'status' => 'required|in:draft,open',
        'status_mode' => 'nullable|string',
        'max_responses' => 'nullable|integer',
        'start_date' => 'nullable|date',
        'end_date' => 'nullable|date',
    ]);

    $survey->update([
        'status' => $data['status'],
        'status_mode' => $data['status_mode'] ?? null,
        'max_responses' => $data['max_responses'] ?? null,
        'start_date' => $data['start_date'] ?? null,
        'end_date' => $data['end_date'] ?? null,
    ]);

    return response()->json(['message' => 'Survey status updated']);
    return redirect()->route('survey.analyze', ['slug' => $slug]); 
}

public function storeResponses(Request $request, $slug)
{
    $survey = Survey::where('slug', $slug)->firstOrFail();

    $data = $request->validate([
        'answers' => 'required|array',
    ]);

    $response = $survey->responses()->create([
        'survey_respondent_id' => null,
        'submitted_at' => now(),
    ]);

    foreach ($data['answers'] as $questionId => $answerValue) {
        $question = \App\Models\SurveyQuestion::findOrFail($questionId);

        $optionId = null;
        if (in_array($question->question_type, ['Multiple Choices', 'Likert Scale'])) {
            $optionId = $question->options()
                ->where('option_text', $answerValue)
                ->value('id');
        }

        // Debug di sini
        Log::info("Saving answer", [
            'question_id' => $questionId,
            'answer_value' => $answerValue,
            'option_id' => $optionId
        ]);

        $response->answers()->create([
            'question_id' => $questionId,
            'option_id' => $optionId,
            'answer_text' => $answerValue,
        ]);
    }

    return response()->json(['message' => 'Jawaban berhasil disimpan']);
}

// SurveyController.php
// SurveyController.php
public function getRespondentDataBySlug($slug)
{
    $survey = Survey::where('slug', $slug)->firstOrFail();
    $questions = $survey->questions()->get();
    $responses = $survey->responses()->with(['answers.question'])->get();

    $result = $responses->map(function ($response, $index) use ($questions) {
        $answers = collect();

        foreach ($questions as $question) {
            $answer = $response->answers->firstWhere('question_id', $question->id);
            $answers->put($question->text, $answer ? $answer->answer_text : '-');
        }

        return [
            'id' => $index + 1,
            'date' => $response->submitted_at->format('d/m/Y'),
            'time' => $response->submitted_at->format('H:i'),
            'answers' => $answers,
        ];
    });

    return response()->json([
        'questions' => $questions->pluck('text'),
        'responses' => $result,
    ]);
}


public function analyze($slug)
{
    $survey = Survey::with(['questions.options', 'responses.answers'])->where('slug', $slug)->firstOrFail();

    $questions = $survey->questions->map(function ($q) use ($survey) {
        $summary = [];

        if ($q->question_type === 'Text') {
            // Kumpulkan semua jawaban teks
            $summary = $survey->responses
                ->map(fn($r) => $r->answers->firstWhere('question_id', $q->id)?->answer_text)
                ->filter()
                ->values();
        } else {
            // Hitung frekuensi pilihan (untuk Multiple Choices & Likert)
            $choices = $q->options->pluck('option_text')->unique()->values();
            $total = $survey->responses->count();

            $summary = $choices->map(function ($choice) use ($survey, $q, $total) {
                $jumlah = $survey->responses->filter(function ($r) use ($q, $choice) {
                    return $r->answers->firstWhere('question_id', $q->id)?->answer_text === $choice;
                })->count();

                return [
                    'label' => $choice,
                    'value' => $total ? round(($jumlah / $total) * 100) : 0
                ];
            });
        }

        return [
            'id' => $q->id,
            'text' => $q->question_text,
            'type' => $q->question_type,
            'summary' => $summary
        ];
    });

    $responses = $survey->responses->map(function ($response, $index) use ($survey) {
        return [
            'id' => $response->id,
            'index' => $index + 1,
            'date' => optional($response->submitted_at)->format('d/m/Y') ?? '-',
            'time' => optional($response->submitted_at)->format('H:i') ?? '-',
            'answers' => $survey->questions->mapWithKeys(function ($question) use ($response) {
                $answer = $response->answers->firstWhere('question_id', $question->id);
                return [$question->id => $answer->answer_text ?? '-'];
            }),
        ];
    });

    return Inertia::render('AnalyzeSurvey', [
        'survey' => $survey,
        'questions' => $questions,
        'responses' => $responses,
    ]);
}


public function dashboard()
{
    $surveys = Survey::orderBy('updated_at', 'desc')->get();

    return Inertia::render('Dashboard', [
        'auth' => [
            'user' => auth()->user()
        ],
        'surveys' => $surveys
    ]);
}

public function exportCsv($slug)
{
    $survey = Survey::with(['questions', 'responses.answers'])->where('slug', $slug)->firstOrFail();

    $filename = 'survey_export_' . now()->format('Ymd_His') . '.csv';
    $headers = [
        'Content-Type' => 'text/csv',
        'Content-Disposition' => "attachment; filename=\"$filename\"",
    ];

    $questions = $survey->questions;
    $responses = $survey->responses;

    $callback = function () use ($questions, $responses) {
        $handle = fopen('php://output', 'w');

        // Header row: Q1, Q2, ...
        $columns = ['#', 'Date', 'Time'];
        foreach ($questions as $q) {
            $columns[] = $q->question_text;
        }
        fputcsv($handle, $columns);

        // Response rows
        foreach ($responses as $index => $response) {
            $row = [
                $index + 1,
                optional($response->submitted_at)->format('d/m/Y'),
                optional($response->submitted_at)->format('H:i'),
            ];

            foreach ($questions as $q) {
                $answer = $response->answers->firstWhere('question_id', $q->id);
                $row[] = $answer->answer_text ?? '-';
            }

            fputcsv($handle, $row);
        }

        fclose($handle);
    };

    return Response::stream($callback, 200, $headers);
}


}
