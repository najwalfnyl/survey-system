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
        Schema::table('surveys', function (Blueprint $table) {
            $table->string('status_mode')->nullable()->after('status'); // "Tanpa batasan", "Private", "Terbatas"
            $table->integer('max_responses')->nullable()->after('status_mode');
            $table->date('start_date')->nullable()->after('max_responses');
            $table->date('end_date')->nullable()->after('start_date');
        });
    }
    
    public function down()
    {
        Schema::table('surveys', function (Blueprint $table) {
            $table->dropColumn(['status_mode', 'max_responses', 'start_date', 'end_date']);
        });
    }
    };
