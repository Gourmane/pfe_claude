<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;

class TicketAssignmentController extends Controller
{
    public function assign(Request $request, Ticket $ticket)
    {
        if ($ticket->status === 'closed') {
            return response()->json([
                'message' => 'Impossible d’assigner un ticket clôturé.',
            ], 422);
        }

        $data = $request->validate([
            'technician_id' => ['required', 'exists:users,id'],
        ]);

        $technician = User::findOrFail($data['technician_id']);

        if ($technician->role !== 'technicien') {
            return response()->json([
                'message' => 'L’utilisateur choisi n’est pas un technicien.',
            ], 422);
        }

        $ticket->update([
            'technician_id' => $technician->id,
        ]);

        return response()->json([
            'message' => 'Ticket assigné avec succès.',
            'data' => $ticket->load(['client', 'technician', 'creator']),
        ]);
    }
}
