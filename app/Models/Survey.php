<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    protected $fillable = ['user_id', 'title', 'description', 'slug', 'qr_code', 'status', 'max_responses', 'start_date', 'end_date'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function questions() {
        return $this->hasMany(SurveyQuestion::class);
    }

    public function respondents() {
        return $this->hasMany(SurveyRespondent::class);
    }

    public function responses() {
        return $this->hasMany(Response::class);
    }
}