<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LikertEntity extends Model
{
    use HasFactory;

    protected $fillable = [
        'question_id',
        'entity_name',
    ];

    public function question()
    {
        return $this->belongsTo(SurveyQuestion::class, 'question_id');
    }
}
