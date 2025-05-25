<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLikertEntitiesTable extends Migration
{
    public function up()
    {
        Schema::create('likert_entities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('question_id'); // Foreign key ke survey_questions
            $table->string('entity_name');
            $table->timestamps();

            $table->foreign('question_id')->references('id')->on('survey_questions')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('likert_entities');
    }
}
