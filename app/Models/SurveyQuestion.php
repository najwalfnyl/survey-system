<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SurveyQuestion extends Model
{
    protected $fillable = ['survey_id', 'question_text', 'question_type', 'order'];

    public function survey() {
        return $this->belongsTo(Survey::class);
    }

    public function options() {
        return $this->hasMany(SurveyQuestionOption::class);
    }

    public function answers() {
        return $this->hasMany(Answer::class, 'question_id');
    }

    public function likertScales()
    {
        return $this->hasMany(LikertScale::class, 'question_id');
    }  

    public function entities()
    {
        return $this->hasMany(LikertEntity::class, 'question_id'); // Menambahkan relasi ke tabel likert_entities
    }
}
