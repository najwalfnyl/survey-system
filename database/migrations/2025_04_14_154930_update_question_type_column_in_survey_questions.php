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
    Schema::table('survey_questions', function (Blueprint $table) {
        $table->string('question_type', 50)->change();
    });
}

public function down()
{
    Schema::table('survey_questions', function (Blueprint $table) {
        $table->string('question_type', 20)->change(); // Atur ke value lama
    });
}

};
