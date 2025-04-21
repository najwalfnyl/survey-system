<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SurveyQuestionOption extends Model
{
    protected $fillable = ['survey_question_id', 'option_text'];

    public function question() {
        return $this->belongsTo(SurveyQuestion::class);
    }

    public function answers() {
        return $this->hasMany(Answer::class, 'option_id');
    }
}