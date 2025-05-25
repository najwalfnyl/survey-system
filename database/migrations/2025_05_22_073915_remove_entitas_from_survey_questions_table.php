<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveEntitasFromSurveyQuestionsTable extends Migration
{
    public function up()
    {
        Schema::table('survey_questions', function (Blueprint $table) {
            $table->dropColumn('entitas');
        });
    }

    public function down()
    {
        Schema::table('survey_questions', function (Blueprint $table) {
            $table->string('entitas')->nullable()->after('question_type');
        });
    }
}
