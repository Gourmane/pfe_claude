<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Ticket;

class Client extends Model
{
    protected $fillable = [
        'nom',
        'email',
        'telephone',
        'adresse',
        'entreprise',
    ];

    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }
}