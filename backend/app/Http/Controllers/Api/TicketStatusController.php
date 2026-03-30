<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TicketStatusController extends Controller
{
    public function update(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        $data = $request->validate([
            'status' => ['required', Rule::in(['pending', 'in_progress', 'resolved', 'closed'])],
        ]);

        $currentStatus = $ticket->status;
        $nextStatus = $data['status'];

        if ($currentStatus === $nextStatus) {
            return response()->json([
                'message' => 'Le ticket a deja ce statut.',
                'data' => $ticket->load(['client', 'technician', 'creator']),
            ]);
        }

        if ($currentStatus === 'closed') {
            return response()->json([
                'message' => 'Un ticket cloture ne peut plus changer de statut.',
            ], 422);
        }

        $allowedTransitions = [
            'pending' => ['in_progress'],
            'in_progress' => ['resolved'],
            'resolved' => ['closed'],
        ];

        if (! in_array($nextStatus, $allowedTransitions[$currentStatus] ?? [], true)) {
            return response()->json([
                'message' => 'Transition de statut interdite.',
            ], 422);
        }

        if (in_array($nextStatus, ['in_progress', 'resolved'], true)) {
            if ($user->role !== 'technicien') {
                return response()->json([
                    'message' => 'Seul le technicien assigne peut faire cette transition.',
                ], 403);
            }

            if ($ticket->technician_id !== $user->id) {
                return response()->json([
                    'message' => 'Ce ticket n est pas assigne a ce technicien.',
                ], 403);
            }
        }

        if ($nextStatus === 'closed' && $user->role !== 'admin') {
            return response()->json([
                'message' => 'Seul un admin peut cloturer un ticket.',
            ], 403);
        }

        $attributes = ['status' => $nextStatus];

        if ($nextStatus === 'resolved') {
            $attributes['resolved_at'] = now();
        }

        if ($nextStatus === 'closed') {
            $attributes['closed_at'] = now();
        }

        $ticket->update($attributes);

        return response()->json([
            'message' => 'Statut du ticket mis a jour avec succes.',
            'data' => $ticket->load(['client', 'technician', 'creator']),
        ]);
    }
}
