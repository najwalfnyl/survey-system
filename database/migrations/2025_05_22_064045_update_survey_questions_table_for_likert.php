<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateSurveyQuestionsTableForLikert extends Migration
{
    public function up()
    {
        Schema::table('survey_questions', function (Blueprint $table) {
            $table->string('entitas')->nullable()->after('question_type'); // Entitas atau unit (opsional)
            $table->integer('scale_min')->default(1)->after('entitas'); // Nilai minimum skala (default 1)
            $table->integer('scale_max')->default(5)->after('scale_min'); // Nilai maksimum skala (default 5)
        });
    }

    public function down()
    {
        Schema::table('survey_questions', function (Blueprint $table) {
            $table->dropColumn('entitas');
            $table->dropColumn('scale_min');
            $table->dropColumn('scale_max');
        });
    }
}

