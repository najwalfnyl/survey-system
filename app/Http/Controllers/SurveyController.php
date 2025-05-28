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
            'status' => 'required|in:draft,open,closed',
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
    return $survey->load([
        'questions.options',
        'questions.likertScales',
        'questions.entities'
    ]);
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

    public function showBySlug($slug)
{
    $survey = \App\Models\Survey::with([
        'questions.options',
        'questions.likertScales',
        'questions.entities'
    ])->where('slug', $slug)->first();

    if (!$survey) {
        return response()->json(['message' => 'Survey not found'], 404);
    }

    return response()->json($survey);
}

    public function getBySlug($slug)
{
    $survey = Survey::where('slug', $slug)
        ->with('questions.options', 'questions.likertScales', 'questions.entities')
        ->firstOrFail();

    // Debugging: Log data yang dikirim ke frontend
    Log::info("Survey data:", $survey->toArray());

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
    // Validasi data yang diterima dari frontend
    $data = $request->validate([
        'questions' => 'required|array',
        'questions.*.question_text' => 'required|string',
        'questions.*.question_type' => 'required|string|in:Text,Multiple Choices,Likert Scale',
        'questions.*.choices' => 'nullable|array',
        'questions.*.choices.*' => 'string', // Validasi setiap pilihan
        'questions.*.likertLabels' => 'nullable|array',
        'questions.*.likertLabels.*' => 'string', // Validasi setiap label skala
        'questions.*.entities' => 'nullable|array',
        'questions.*.entities.*' => 'string', // Validasi setiap entitas
        'questions.*.placeholder_text' => 'nullable|string',
    ]);

    // Iterasi setiap pertanyaan yang dikirimkan
    foreach ($data['questions'] as $q) {
        Log::info("Saving question", $q);

        // Simpan pertanyaan ke tabel `survey_questions`
        $question = $survey->questions()->create([
            'question_text' => $q['question_text'],
            'question_type' => $q['question_type'],
            'placeholder_text' => $q['placeholder_text'] ?? null,
        ]);

        // Simpan pilihan untuk pertanyaan tipe Multiple Choices
        if ($q['question_type'] === 'Multiple Choices' && !empty($q['choices'])) {
            foreach ($q['choices'] as $choice) {
                if (!empty($choice)) {
                    $question->options()->create(['option_text' => $choice]);
                }
            }
        }

        // Simpan skala Likert untuk pertanyaan tipe Likert Scale
        // Simpan skala Likert untuk pertanyaan tipe Likert Scale
if ($q['question_type'] === 'Likert Scale' && !empty($q['likertLabels'])) {
    foreach ($q['likertLabels'] as $index => $label) {
        if (!empty($label)) {
            $question->likertScales()->create([
                'scale_value' => $index + 1, // Nilai skala dimulai dari 1
                'scale_label' => $label,
            ]);
        }
    }
}


        // Simpan entitas untuk pertanyaan tipe Likert Scale
        if ($q['question_type'] === 'Likert Scale' && !empty($q['entities'])) {
            foreach ($q['entities'] as $entity) {
                if (!empty($entity)) {
                    $question->entities()->create(['entity_name' => $entity]);
                }
            }
        }
    }

    // Kembalikan respons sukses
    return response()->json(['message' => 'Questions saved successfully']);
}

public function patchQuestions(Request $request, Survey $survey)
{
    $data = $request->validate([
        'questions' => 'required|array',
        'questions.*.id' => 'required|integer|exists:survey_questions,id',
        'questions.*.question_text' => 'sometimes|string',
        'questions.*.question_type' => 'sometimes|string|in:Text,Multiple Choices,Likert Scale',
        'questions.*.choices' => 'nullable|array',
        'questions.*.choices.*' => 'string',
        'questions.*.likertLabels' => 'nullable|array',
        'questions.*.likertLabels.*' => 'string',
        'questions.*.entities' => 'nullable|array',
        'questions.*.entities.*' => 'string',
        'questions.*.placeholder_text' => 'nullable|string',
    ]);

    foreach ($data['questions'] as $q) {
        $question = \App\Models\SurveyQuestion::find($q['id']);

        // Update kolom yang dikirim saja
        $question->fill([
            'question_text' => $q['question_text'] ?? $question->question_text,
            'question_type' => $q['question_type'] ?? $question->question_type,
            'placeholder_text' => $q['placeholder_text'] ?? $question->placeholder_text,
        ])->save();

        // Hanya update opsi/entitas/likert kalau dikirim
        if (array_key_exists('choices', $q)) {
            $question->options()->delete();
            foreach ($q['choices'] as $choice) {
                if (!empty($choice)) {
                    $question->options()->create(['option_text' => $choice]);
                }
            }
        }

        if (array_key_exists('likertLabels', $q)) {
            $question->likertScales()->delete();
            foreach ($q['likertLabels'] as $index => $label) {
                $question->likertScales()->create([
                    'scale_value' => $index + 1,
                    'scale_label' => $label,
                ]);
            }
        }

        if (array_key_exists('entities', $q)) {
            $question->entities()->delete();
            foreach ($q['entities'] as $entity) {
                $question->entities()->create(['entity_name' => $entity]);
            }
        }
    }

    return response()->json(['message' => 'Questions patched successfully']);
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

    $data = $request->all(); // Ambil semua inputan tanpa asumsi

    $validated = validator($data, [
        'status' => 'required|in:draft,open,closed',
        'status_mode' => 'nullable|string',
        'max_responses' => 'nullable|integer',
        'start_date' => 'nullable|date',
        'end_date' => 'nullable|date',
    ])->validate();

    // Hindari error key tidak ada
    $validated['start_date'] = $data['start_date'] ?? null;
    $validated['end_date'] = $data['end_date'] ?? null;

    $survey->update([
        'status' => $validated['status'],
        'status_mode' => $validated['status_mode'] ?? null,
        'max_responses' => $validated['max_responses'] ?? null,
        'start_date' => $validated['start_date'],
        'end_date' => $validated['end_date'],
    ]);

    return response()->json([
        'message' => 'Survey status updated successfully!',
        'survey' => $survey
    ]);
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

        if ($question->question_type === 'Likert Scale') {
            $likertScaleId = $question->likertScales()
                ->where('scale_value', $answerValue['scale'])
                ->value('id');

            $likertEntityId = $question->entities()
                ->where('entity_name', $answerValue['entity'])
                ->value('id');

            $response->answers()->create([
                'question_id' => $questionId,
                'likert_scale_id' => $likertScaleId,
                'likert_entity_id' => $likertEntityId,
            ]);
        } elseif ($question->question_type === 'Multiple Choices') {
            $response->answers()->create([
                'question_id' => $questionId,
                'option_id' => $answerValue['option_id'],
            ]);
        } else {
            $response->answers()->create([
                'question_id' => $questionId,
                'answer_text' => $answerValue['answer_text'],
            ]);
        }
    }

    // ✅ Tambahkan pengecekan setelah jawaban berhasil disimpan
    $totalResponses = $survey->responses()->count();

    if ($survey->status_mode === 'Private' && $survey->max_responses && $totalResponses >= $survey->max_responses) {
        $survey->update(['status' => 'closed']);
    }

    return response()->json(['message' => 'Responses saved successfully']);
}


public function analyze($slug)
{
    // Load the survey with related data
    $survey = Survey::with([
        'questions.options',
        'questions.likertScales',
        'questions.entities',
        'responses.answers.option',
        'responses.answers.likertScale',
        'responses.answers.likertEntity',
    ])->where('slug', $slug)->firstOrFail();

    $totalResponses = $survey->responses->count();

    // Summary pertanyaan seperti sebelumnya
    $questions = $survey->questions->map(function ($q) use ($survey) {
        $summary = [];

        if ($q->question_type === 'Text') {
            $summary = $survey->responses
                ->map(fn($r) => $r->answers->firstWhere('question_id', $q->id)?->answer_text)
                ->filter()
                ->values();
        } elseif ($q->question_type === 'Multiple Choices') {
            $summary = $q->options->map(function ($option) use ($survey, $q) {
                $count = $survey->responses->filter(function ($r) use ($q, $option) {
                    return $r->answers->firstWhere('question_id', $q->id)?->option_id === $option->id;
                })->count();

                return [
                    'label' => $option->option_text,
                    'count' => $count
                ];
            });
        } elseif ($q->question_type === 'Likert Scale') {
            $summary = $q->entities->map(function ($entity) use ($survey, $q) {
                return [
                    'entity' => $entity->entity_name,
                    'scales' => $q->likertScales->map(function ($scale) use ($entity, $q, $survey) {
                        $count = $survey->responses->filter(function ($response) use ($q, $scale, $entity) {
                            $answer = $response->answers->firstWhere('question_id', $q->id);
                            return $answer &&
                                $answer->likert_scale_id === $scale->id &&
                                $answer->likert_entity_id === $entity->id;
                        })->count();

                        return [
                            'scale' => $scale->scale_label,
                            'count' => $count
                        ];
                    })
                ];
            });
        }

        return [
            'question_id' => $q->id,
            'question_text' => $q->question_text,
            'question_type' => $q->question_type,
            'summary' => $summary
        ];
    });

    // Data lengkap per responden
    $respondents = $survey->responses->map(function ($response, $index) use ($survey) {
        $answers = $survey->questions->mapWithKeys(function ($q) use ($response) {
            $answer = $response->answers->firstWhere('question_id', $q->id);
            if (!$answer) return [$q->id => null];

            switch ($q->question_type) {
                case 'Text':
                    return [$q->id => $answer->answer_text];
                case 'Multiple Choices':
                    return [$q->id => $answer->option?->option_text ?? null];
                case 'Likert Scale':
                    $scaleLabel = $answer->likertScale?->scale_label ?? '';
                    $entityName = $answer->likertEntity?->entity_name ?? '';
                    return [$q->id => trim("$entityName - $scaleLabel")];
                default:
                    return [$q->id => null];
            }
        });

        return [
            'id' => $index + 1,
            'submitted_at' => $response->submitted_at,
            'date' => $response->submitted_at->format('d/m/Y'),
            'time' => $response->submitted_at->format('H:i'),
            'answers' => $answers->toArray(),
        ];
    });

    return response()->json([
        'total_responses' => $totalResponses,
        'questions' => $questions,
        'respondents' => $respondents,
    ]);
}


public function respondentData($slug)
{
    $survey = Survey::with(['questions', 'responses.answers.option', 'responses.answers.likertScale', 'responses.answers.likertEntity'])
        ->where('slug', $slug)
        ->firstOrFail();

    $questions = $survey->questions()->get();
    $responses = $survey->responses()->with('answers')->get();

    $mappedResponses = $responses->map(function ($response, $index) use ($questions) {
        $answers = $questions->mapWithKeys(function ($q) use ($response) {
            $answer = $response->answers->firstWhere('question_id', $q->id);

            if (!$answer) {
                return [$q->id => "-"];
            }

            switch ($q->question_type) {
                case 'Text':
                    return [$q->id => $answer->answer_text ?? "-"];

                case 'Multiple Choices':
                    // Pastikan relasi option sudah ada di model Answer
                    $option = $answer->option;
                    return [$q->id => $option ? $option->option_text : "-"];

                case 'Likert Scale':
                    $scaleLabel = $answer->likertScale ? $answer->likertScale->scale_label : null;
                    $entityName = $answer->likertEntity ? $answer->likertEntity->entity_name : null;

                    if ($scaleLabel && $entityName) {
                        return [$q->id => "{$entityName} - {$scaleLabel}"];
                    } elseif ($scaleLabel) {
                        return [$q->id => $scaleLabel];
                    } else {
                        return [$q->id => "-"];
                    }

                default:
                    return [$q->id => "-"];
            }
        });

        return [
            'id' => $index + 1,
            'date' => $response->submitted_at->format('d/m/Y'),
            'time' => $response->submitted_at->format('H:i'),
            'answers' => $answers->toArray(),
        ];
    });

    return response()->json([
        'questions' => $questions->map(fn($q) => [
            'id' => $q->id,
            'question_text' => $q->question_text,
        ]),
        'responses' => $mappedResponses,
    ]);
}

public function dashboard()
{
    $surveys = \App\Models\Survey::withCount('responses')
        ->orderBy('updated_at', 'desc')
        ->get();

    return Inertia::render('Dashboard', [
        'auth' => [
            'user' => auth()->user()
        ],
        'surveys' => $surveys
    ]);
}


public function exportCsv($slug)
{
    $survey = Survey::with(['questions.options', 'questions.likertScales', 'questions.entities', 'responses.answers'])
        ->where('slug', $slug)
        ->firstOrFail();

    $filename = 'survey_export_' . now()->format('Ymd_His') . '.csv';

    $headers = [
        'Content-Type' => 'text/csv',
        'Content-Disposition' => "attachment; filename=\"$filename\"",
    ];

    $questions = $survey->questions;
    $responses = $survey->responses;

    $callback = function () use ($questions, $responses) {
        $handle = fopen('php://output', 'w');

        $columns = ['No', 'Date', 'Time'];
        foreach ($questions as $q) {
            $columns[] = $q->question_text;
        }
        fputcsv($handle, $columns);

        foreach ($responses as $index => $response) {
            $row = [
                $index + 1,
                optional($response->submitted_at)->format('d/m/Y'),
                optional($response->submitted_at)->format('H:i'),
            ];

            foreach ($questions as $q) {
                $answer = $response->answers->firstWhere('question_id', $q->id);

                if ($answer) {
                    if ($answer->answer_text) {
                        $row[] = $answer->answer_text;
                    } elseif ($answer->option_id) {
                        $optionText = $q->options->firstWhere('id', $answer->option_id)?->option_text ?? '-';
                        $row[] = $optionText;
                    } elseif ($answer->likert_scale_id) {
                        $likertLabel = $q->likertScales->firstWhere('id', $answer->likert_scale_id)?->scale_label ?? '-';
                        $row[] = $likertLabel;
                    } else {
                        $row[] = '-';
                    }
                } else {
                    $row[] = '-';
                }
            }

            fputcsv($handle, $row);
        }

        fclose($handle);
    };

    return response()->stream($callback, 200, $headers);
}


}
