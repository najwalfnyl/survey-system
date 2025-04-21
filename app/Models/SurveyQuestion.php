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
}
