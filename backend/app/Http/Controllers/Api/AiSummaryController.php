<?php

namespace App\Http\Controllers\Api;

use App\Enums\AiSuggestedCategory;
use App\Http\Controllers\Controller;
use App\Models\AiSummary;
use App\Models\Ticket;
use App\Services\GroqService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Throwable;

class AiSummaryController extends Controller
{
    public function __construct(private GroqService $groqService)
    {
    }

    public function generate(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        if (! in_array($user->role, ['admin', 'technicien'], true)) {
            return response()->json([
                'message' => 'Accès interdit.',
            ], 403);
        }

        if ($user->role === 'technicien' && $ticket->technician_id !== $user->id) {
            return response()->json([
                'message' => 'Accès interdit à ce ticket.',
            ], 403);
        }

        if (blank($ticket->description)) {
            return response()->json([
                'message' => 'Impossible de générer un résumé sans description.',
            ], 422);
        }

        $generated = $this->generateSummaryPayload($ticket->description);

        $summary = AiSummary::updateOrCreate(
            ['ticket_id' => $ticket->id],
            [
                'summary' => $generated['summary'],
                'suggested_category' => $generated['suggested_category'],
            ]
        );

        return response()->json([
            'message' => 'Résumé généré avec succès.',
            'source' => $generated['source'],
            'data' => $summary,
        ]);
    }

    private function generateSummaryPayload(string $description): array
    {
        try {
            $payload = $this->groqService->generateTicketSummary($description);

            return [
                'summary' => $payload['summary'],
                'suggested_category' => $payload['suggested_category'],
                'source' => 'groq',
            ];
        } catch (Throwable) {
        }

        return $this->generateFallbackSummary($description);
    }

    private function generateFallbackSummary(string $description): array
    {
        $cleanDescription = trim(preg_replace('/\s+/', ' ', $description) ?? $description);
        $normalized = Str::lower($cleanDescription);

        $categoryMap = [
            AiSuggestedCategory::IMPRIMANTE->value => ['imprimante', 'printer', 'papier', 'cartouche', 'scan'],
            AiSuggestedCategory::RESEAU->value => ['reseau', 'réseau', 'wifi', 'internet', 'routeur', 'ethernet', 'connexion'],
            AiSuggestedCategory::CAMERA->value => ['camera', 'caméra', 'webcam', 'surveillance', 'video'],
            AiSuggestedCategory::PC->value => ['pc', 'ordinateur', 'laptop', 'ecran', 'windows', 'clavier', 'souris'],
        ];

        $category = AiSuggestedCategory::AUTRE->value;

        foreach ($categoryMap as $candidate => $keywords) {
            foreach ($keywords as $keyword) {
                if (Str::contains($normalized, $keyword)) {
                    $category = $candidate;
                    break 2;
                }
            }
        }

        $summaryText = $cleanDescription !== '' ? $cleanDescription : 'Aucune description fournie.';

        return [
            'summary' => Str::limit('Résumé automatique : '.$summaryText, 280),
            'suggested_category' => $category,
            'source' => 'fallback',
        ];
    }
}
