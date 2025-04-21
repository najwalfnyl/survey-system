<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Response extends Model
{
    public $timestamps = false;
    protected $fillable = ['survey_id', 'survey_respondent_id', 'submitted_at'];
    protected $casts = [
        'submitted_at' => 'datetime',
    ];
    

    public function survey() {
        return $this->belongsTo(Survey::class);
    }

    public function respondent() {
        return $this->belongsTo(SurveyRespondent::class);
    }

    public function answers() {
        return $this->hasMany(\App\Models\Answer::class);
    }
    
}

