<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('ai_summaries') || ! Schema::hasColumn('ai_summaries', 'suggested_category')) {
            return;
        }

        DB::table('ai_summaries')
            ->where('suggested_category', 'Reseau')
            ->update(['suggested_category' => 'Réseau']);

        DB::table('ai_summaries')
            ->where('suggested_category', 'Camera')
            ->update(['suggested_category' => 'Caméra']);

        DB::table('ai_summaries')
            ->whereNull('suggested_category')
            ->update(['suggested_category' => 'Autre']);

        if (! in_array(DB::getDriverName(), ['mysql', 'mariadb'], true)) {
            return;
        }

        DB::statement("
            ALTER TABLE ai_summaries
            MODIFY suggested_category
            ENUM('PC', 'Imprimante', 'Réseau', 'Caméra', 'Autre')
            NOT NULL
        ");
    }

    public function down(): void
    {
        if (! Schema::hasTable('ai_summaries') || ! Schema::hasColumn('ai_summaries', 'suggested_category')) {
            return;
        }

        DB::table('ai_summaries')
            ->where('suggested_category', 'Réseau')
            ->update(['suggested_category' => 'Reseau']);

        DB::table('ai_summaries')
            ->where('suggested_category', 'Caméra')
            ->update(['suggested_category' => 'Camera']);

        if (! in_array(DB::getDriverName(), ['mysql', 'mariadb'], true)) {
            return;
        }

        DB::statement("
            ALTER TABLE ai_summaries
            MODIFY suggested_category
            ENUM('PC', 'Imprimante', 'Reseau', 'Camera', 'Autre')
            NOT NULL
        ");
    }
};
