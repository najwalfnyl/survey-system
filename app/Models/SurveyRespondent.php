<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SurveyRespondent extends Model
{
    protected $fillable = ['survey_id', 'user_id', 'status', 'responded_at'];

    public function survey() {
        return $this->belongsTo(Survey::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function response() {
        return $this->hasOne(Response::class);
    }
}
