<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('survey_questions', function (Blueprint $table) {
        $table->id();
        $table->foreignId('survey_id')->constrained('surveys')->onDelete('cascade');
        $table->text('question_text');
        $table->enum('question_type', ['text', 'multiple_choice', 'checkbox']);
        $table->text('choices')->nullable(); // Untuk multiple choice/checkbox
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('survey_questions');
    }
};
