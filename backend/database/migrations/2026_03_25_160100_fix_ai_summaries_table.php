<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('ai_summaries')) {
            // The base create migration owns table creation.
            return;
        }

        Schema::table('ai_summaries', function (Blueprint $table) {
            if (! Schema::hasColumn('ai_summaries', 'ticket_id')) {
                $table->foreignId('ticket_id')->nullable()->unique()->after('id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            }

            if (! Schema::hasColumn('ai_summaries', 'summary')) {
                $table->text('summary')->nullable()->after('ticket_id');
            }

            if (! Schema::hasColumn('ai_summaries', 'suggested_category')) {
                $table->enum('suggested_category', ['PC', 'Imprimante', 'Réseau', 'Caméra', 'Autre'])->nullable()->after('summary');
            }
        });
    }

    public function down(): void
    {
        // No-op on rollback: the base create migration owns these columns.
    }
};
