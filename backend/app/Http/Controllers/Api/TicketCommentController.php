<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketComment;
use Illuminate\Http\Request;

class TicketCommentController extends Controller
{
    public function store(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        // Admin can comment on any ticket, technicien only on assigned tickets
        if ($user->role === 'technicien' && $ticket->technician_id !== $user->id) {
            return response()->json([
                'message' => 'Vous ne pouvez ajouter des notes que sur vos tickets assignés.',
            ], 403);
        }

        $data = $request->validate([
            'comment' => ['required', 'string', 'min:2'],
        ]);

        $comment = TicketComment::create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'comment' => $data['comment'],
        ]);

        return response()->json([
            'message' => 'Note ajoutée avec succès.',
            'data' => $comment->load('user'),
        ], 201);
    }
}
