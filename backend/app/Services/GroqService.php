<?php

namespace App\Services;

use App\Enums\AiSuggestedCategory;
use Exception;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GroqService
{
    public function generateTicketSummary(string $description): array
    {
        $apiKey = Config::get('services.groq.api_key');
        $apiUrl = Config::get('services.groq.api_url', 'https://api.groq.com/openai/v1/chat/completions');
        $model = Config::get('services.groq.model', 'llama-3.1-8b-instant');

        if (! $apiKey) {
            throw new Exception('Cle API Groq manquante dans le fichier .env');
        }

        $prompt = <<<PROMPT
Tu es un assistant IT.

Analyse la description du ticket ci-dessous et retourne uniquement un JSON valide avec cette structure exacte :

{
  "summary": "resume court en francais",
  "suggested_category": "PC"
}

Regles :
- summary = resume tres court et clair
- suggested_category doit etre exactement une seule valeur parmi :
PC, Imprimante, Réseau, Caméra, Autre
- aucune phrase avant ou apres le JSON
- aucune balise markdown
- aucune explication

Description du ticket :
{$description}
PROMPT;

        $response = Http::withToken($apiKey)
            ->timeout(30)
            ->acceptJson()
            ->post($apiUrl, [
                'model' => $model,
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'Tu reponds uniquement en JSON valide.',
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt,
                    ],
                ],
                'temperature' => 0.2,
            ]);

        if (! $response->successful()) {
            Log::error('Erreur Groq API', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            throw new Exception('Erreur lors de l appel a Groq API.');
        }

        $content = $response->json('choices.0.message.content');

        if (! $content) {
            throw new Exception('Reponse vide de Groq API.');
        }

        $decoded = json_decode($content, true);

        if (! is_array($decoded)) {
            throw new Exception('Reponse Groq non valide : JSON invalide.');
        }

        $summary = $decoded['summary'] ?? null;
        $category = AiSuggestedCategory::fromInput($decoded['suggested_category'] ?? null);

        if (! $summary || ! $category) {
            throw new Exception('Reponse Groq incomplete ou categorie invalide.');
        }

        return [
            'summary' => trim($summary),
            'suggested_category' => $category->value,
        ];
    }
}
