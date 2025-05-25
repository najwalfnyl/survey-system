<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLikertScalesTable extends Migration
{
    public function up()
    {
        Schema::create('likert_scales', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->unsignedBigInteger('question_id'); // Foreign key ke survey_questions
            $table->integer('scale_value'); // Nilai skala (misalnya, 1, 2, 3, 4, 5)
            $table->string('scale_label')->nullable(); // Label untuk nilai skala (misalnya, "Sangat Setuju")
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('question_id')->references('id')->on('survey_questions')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('likert_scales');
    }
}
