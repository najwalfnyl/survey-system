<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLikertScaleIdToAnswersTable extends Migration
{
    public function up()
    {
        Schema::table('answers', function (Blueprint $table) {
            $table->unsignedBigInteger('likert_scale_id')->nullable()->after('option_id'); // Relasi opsional ke likert_scales
            $table->foreign('likert_scale_id')->references('id')->on('likert_scales')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('answers', function (Blueprint $table) {
            $table->dropForeign(['likert_scale_id']);
            $table->dropColumn('likert_scale_id');
        });
    }
}
