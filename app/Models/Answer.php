<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    use HasFactory;

    protected $fillable = [
        'response_id',
        'question_id',
        'option_id',
        'likert_scale_id',
        'likert_entity_id', // Menambahkan kolom likert_entity_id
        'answer_text',
    ];

    public function question()
    {
        return $this->belongsTo(SurveyQuestion::class, 'question_id');
    }

    public function option()
    {
        return $this->belongsTo(SurveyQuestionOption::class, 'option_id');
    }

    public function likertScale()
    {
        return $this->belongsTo(LikertScale::class, 'likert_scale_id');
    }

    public function likertEntity()
    {
        return $this->belongsTo(LikertEntity::class, 'likert_entity_id'); // Menambahkan relasi ke LikertEntity
    }
}
