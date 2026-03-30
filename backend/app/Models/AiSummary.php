<?php

namespace App\Models;

use App\Enums\AiSuggestedCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiSummary extends Model
{
    protected $fillable = [
        'ticket_id',
        'summary',
        'suggested_category',
    ];

    protected function casts(): array
    {
        return [
            'suggested_category' => AiSuggestedCategory::class,
        ];
    }

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }
}
