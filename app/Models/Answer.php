<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $fillable = ['response_id', 'question_id', 'option_id', 'answer_text'];

    public function response() {
        return $this->belongsTo(Response::class, 'response_id');
    }

    public function question() {
        return $this->belongsTo(SurveyQuestion::class);
    }

    public function option() {
        return $this->belongsTo(SurveyQuestionOption::class, 'option_id');
    }
}