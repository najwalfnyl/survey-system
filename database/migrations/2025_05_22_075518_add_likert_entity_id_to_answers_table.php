<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLikertEntityIdToAnswersTable extends Migration
{
    public function up()
    {
        Schema::table('answers', function (Blueprint $table) {
            $table->unsignedBigInteger('likert_entity_id')->nullable()->after('likert_scale_id'); // Menambahkan kolom likert_entity_id
            $table->foreign('likert_entity_id')->references('id')->on('likert_entities')->onDelete('cascade'); // Menambahkan foreign key
        });
    }

    public function down()
    {
        Schema::table('answers', function (Blueprint $table) {
            $table->dropForeign(['likert_entity_id']);
            $table->dropColumn('likert_entity_id');
        });
    }
}

