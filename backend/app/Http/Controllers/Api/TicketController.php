<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $tickets = Ticket::with(['client', 'technician', 'creator', 'aiSummary'])
            ->when($user->role === 'technicien', function ($query) use ($user) {
                $query->where('technician_id', $user->id);
            })
            ->when($request->query('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->query('priority'), function ($query, $priority) {
                $query->where('priority', $priority);
            })
            ->when($request->query('client_id'), function ($query, $clientId) {
                $query->where('client_id', $clientId);
            })
            ->when($request->query('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10);

        return response()->json([
            'message' => 'Liste des tickets.',
            'data' => $tickets,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'priority' => ['required', Rule::in(['low', 'medium', 'high', 'urgent'])],
            'client_id' => ['required', 'exists:clients,id'],
        ]);

        $ticket = Ticket::create([
            'title' => $data['title'],
            'description' => $data['description'],
            'priority' => $data['priority'],
            'client_id' => $data['client_id'],
            'status' => 'pending',
            'created_by' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Ticket créé avec succès.',
            'data' => $ticket->load(['client', 'technician', 'creator']),
        ], 201);
    }

    public function show(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        if ($user->role === 'technicien' && $ticket->technician_id !== $user->id) {
            return response()->json([
                'message' => 'Accès interdit à ce ticket.',
            ], 403);
        }

        $ticket->load(['client', 'technician', 'creator', 'comments.user', 'aiSummary']);

        return response()->json([
            'message' => 'Détails du ticket.',
            'data' => $ticket,
        ]);
    }

    public function update(Request $request, Ticket $ticket)
    {
        if ($ticket->status === 'closed') {
            return response()->json([
                'message' => 'Un ticket clôturé ne peut pas être modifié.',
            ], 422);
        }

        $data = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
            'priority' => ['sometimes', 'required', Rule::in(['low', 'medium', 'high', 'urgent'])],
            'client_id' => ['sometimes', 'required', 'exists:clients,id'],
        ]);

        $ticket->update($data);

        return response()->json([
            'message' => 'Ticket modifié avec succès.',
            'data' => $ticket->load(['client', 'technician', 'creator']),
        ]);
    }

    public function destroy(Ticket $ticket)
    {
        return response()->json([
            'message' => 'Suppression de ticket non autorisée dans ce MVP.',
        ], 403);
    }
}
