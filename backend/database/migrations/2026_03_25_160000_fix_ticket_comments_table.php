<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('ticket_comment') && ! Schema::hasTable('ticket_comments')) {
            Schema::rename('ticket_comment', 'ticket_comments');
        }

        if (! Schema::hasTable('ticket_comments')) {
            Schema::create('ticket_comments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('ticket_id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
                $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete()->cascadeOnUpdate();
                $table->text('comment');
                $table->timestamps();
            });

            return;
        }

        Schema::table('ticket_comments', function (Blueprint $table) {
            if (! Schema::hasColumn('ticket_comments', 'ticket_id')) {
                $table->foreignId('ticket_id')->nullable()->after('id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            }

            if (! Schema::hasColumn('ticket_comments', 'user_id')) {
                $table->foreignId('user_id')->nullable()->after('ticket_id')->constrained()->nullOnDelete()->cascadeOnUpdate();
            }

            if (! Schema::hasColumn('ticket_comments', 'comment')) {
                $table->text('comment')->nullable()->after('user_id');
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('ticket_comments')) {
            return;
        }

        Schema::table('ticket_comments', function (Blueprint $table) {
            if (Schema::hasColumn('ticket_comments', 'ticket_id')) {
                $table->dropConstrainedForeignId('ticket_id');
            }

            if (Schema::hasColumn('ticket_comments', 'user_id')) {
                $table->dropConstrainedForeignId('user_id');
            }

            if (Schema::hasColumn('ticket_comments', 'comment')) {
                $table->dropColumn('comment');
            }
        });

        if (! Schema::hasTable('ticket_comment')) {
            Schema::rename('ticket_comments', 'ticket_comment');
        }
    }
};
