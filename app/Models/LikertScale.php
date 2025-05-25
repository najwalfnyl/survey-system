<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LikertScale extends Model
{
    use HasFactory;

    // Tentukan nama tabel jika berbeda dari konvensi
    protected $table = 'likert_scales';

    // Tentukan kolom yang dapat diisi
    protected $fillable = [
        'question_id',
        'scale_value',
        'scale_label',
    ];

    // Relasi ke tabel survey_questions
    public function question()
    {
        return $this->belongsTo(SurveyQuestion::class, 'question_id');
    }
}
