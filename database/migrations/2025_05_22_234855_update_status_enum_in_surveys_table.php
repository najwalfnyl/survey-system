<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateStatusEnumInSurveysTable extends Migration
{
    public function up()
    {
        // Menggunakan DB::statement untuk menambahkan nilai enum pada kolom status
        DB::statement("ALTER TABLE surveys MODIFY COLUMN status ENUM('draft', 'open', 'closed') DEFAULT 'draft'");
    }

    public function down()
    {
        // Untuk rollback migrasi, kembalikan status enum ke nilai sebelumnya
        DB::statement("ALTER TABLE surveys MODIFY COLUMN status ENUM('draft', 'open') DEFAULT 'draft'");
    }
}
