<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Ticket;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $ticketCounts = Ticket::query()
            ->selectRaw('status, COUNT(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $statusCounts = [
            'pending' => (int) ($ticketCounts['pending'] ?? 0),
            'in_progress' => (int) ($ticketCounts['in_progress'] ?? 0),
            'resolved' => (int) ($ticketCounts['resolved'] ?? 0),
            'closed' => (int) ($ticketCounts['closed'] ?? 0),
        ];

        $recentTickets = Ticket::with(['client', 'technician', 'creator', 'aiSummary'])
            ->latest()
            ->limit(5)
            ->get();

        return response()->json([
            'message' => 'Tableau de bord.',
            'data' => [
                'total_clients' => Client::count(),
                'total_tickets' => Ticket::count(),
                'tickets_by_status' => $statusCounts,
                'recent_tickets' => $recentTickets,
            ],
        ]);
    }

    public function technicianDashboard(Request $request)
    {
        $user = $request->user();

        $assigned = Ticket::where('technician_id', $user->id);

        $statusCounts = (clone $assigned)
            ->selectRaw('status, COUNT(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $recentTickets = Ticket::with(['client', 'creator', 'aiSummary'])
            ->where('technician_id', $user->id)
            ->latest()
            ->limit(5)
            ->get();

        return response()->json([
            'message' => 'Tableau de bord technicien.',
            'data' => [
                'assigned_count' => (int) ($statusCounts->sum()),
                'in_progress_count' => (int) ($statusCounts['in_progress'] ?? 0),
                'resolved_count' => (int) ($statusCounts['resolved'] ?? 0),
                'recent_assigned' => $recentTickets,
            ],
        ]);
    }
}
