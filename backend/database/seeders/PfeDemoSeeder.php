<?php

namespace Database\Seeders;

use App\Enums\AiSuggestedCategory;
use App\Models\AiSummary;
use App\Models\Client;
use App\Models\Ticket;
use App\Models\TicketComment;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PfeDemoSeeder extends Seeder
{
    public function run(): void
    {
        $admin = $this->upsertUser(
            'Admin PFE',
            'admin@pfe.test',
            'admin'
        );

        $technicians = [
            $this->upsertUser('Technicien 1', 'tech1@pfe.test', 'technicien'),
            $this->upsertUser('Technicien 2', 'tech2@pfe.test', 'technicien'),
        ];

        $clients = collect(range(1, 15))
            ->map(fn (int $index) => $this->upsertClient($index))
            ->values();

        $ticketPlan = [
            ['status' => 'pending', 'count' => 10],
            ['status' => 'in_progress', 'count' => 15],
            ['status' => 'resolved', 'count' => 10],
            ['status' => 'closed', 'count' => 5],
        ];

        $scenarios = $this->scenarios();
        $tickets = [];
        $ticketNumber = 1;

        foreach ($ticketPlan as $plan) {
            for ($i = 1; $i <= $plan['count']; $i++) {
                $scenario = $scenarios[($ticketNumber - 1) % count($scenarios)];
                $client = $clients[($ticketNumber - 1) % $clients->count()];
                $technician = $plan['status'] === 'pending' && $i <= 4
                    ? null
                    : $technicians[($ticketNumber - 1) % count($technicians)];

                $ticket = Ticket::updateOrCreate(
                    ['title' => sprintf('PFE-%s-%02d', strtoupper($plan['status']), $i)],
                    [
                        'description' => $this->buildDescription($scenario['description'], $client->nom, $client->entreprise),
                        'priority' => $scenario['priority'],
                        'status' => $plan['status'],
                        'client_id' => $client->id,
                        'technician_id' => $technician?->id,
                        'created_by' => $admin->id,
                        'resolved_at' => in_array($plan['status'], ['resolved', 'closed'], true) ? now()->subDays(3) : null,
                        'closed_at' => $plan['status'] === 'closed' ? now()->subDay() : null,
                    ]
                );

                $tickets[] = [
                    'model' => $ticket,
                    'scenario' => $scenario,
                ];

                if (in_array($plan['status'], ['in_progress', 'resolved', 'closed'], true) && $technician) {
                    $this->upsertComment($ticket, $technician, 'Diagnostic initial effectue et prise en charge confirmee.');

                    if (in_array($plan['status'], ['resolved', 'closed'], true)) {
                        $this->upsertComment($ticket, $technician, 'Intervention terminee, solution appliquee et ticket documente.');
                    }
                }

                $ticketNumber++;
            }
        }

        foreach (array_slice($tickets, 0, 32) as $ticketData) {
            $ticket = $ticketData['model'];
            $scenario = $ticketData['scenario'];

            AiSummary::updateOrCreate(
                ['ticket_id' => $ticket->id],
                [
                    'summary' => $scenario['summary'],
                    'suggested_category' => $scenario['category'],
                ]
            );
        }
    }

    private function upsertUser(string $name, string $email, string $role): User
    {
        return User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make('password123'),
                'role' => $role,
            ]
        );
    }

    private function upsertClient(int $index): Client
    {
        return Client::updateOrCreate(
            ['email' => sprintf('client%02d@demo.test', $index)],
            [
                'nom' => sprintf('Client Demo %02d', $index),
                'telephone' => sprintf('060000%04d', $index),
                'adresse' => sprintf('Adresse Demo %02d, Casablanca', $index),
                'entreprise' => sprintf('Entreprise Demo %02d', $index),
            ]
        );
    }

    private function upsertComment(Ticket $ticket, User $user, string $comment): void
    {
        TicketComment::firstOrCreate([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'comment' => $comment,
        ]);
    }

    private function buildDescription(string $description, string $clientName, ?string $company): string
    {
        return sprintf(
            '%s Client concerne: %s. Entreprise: %s.',
            $description,
            $clientName,
            $company ?? 'N/A'
        );
    }

    private function scenarios(): array
    {
        return [
            [
                'category' => AiSuggestedCategory::PC->value,
                'priority' => 'high',
                'description' => 'Le poste Windows ne demarre plus et affiche un ecran noir au lancement.',
                'summary' => 'Incident PC au demarrage avec ecran noir sur poste Windows.',
            ],
            [
                'category' => AiSuggestedCategory::IMPRIMANTE->value,
                'priority' => 'medium',
                'description' => 'L imprimante reseau n imprime plus et reste bloquee dans la file d attente.',
                'summary' => 'Probleme d impression sur imprimante reseau avec file bloquee.',
            ],
            [
                'category' => AiSuggestedCategory::RESEAU->value,
                'priority' => 'urgent',
                'description' => 'Connexion internet instable avec pertes reseau sur plusieurs postes du bureau.',
                'summary' => 'Incident reseau avec connexion internet instable sur plusieurs postes.',
            ],
            [
                'category' => AiSuggestedCategory::CAMERA->value,
                'priority' => 'high',
                'description' => 'La camera de surveillance ne remonte plus d image dans l interface de controle.',
                'summary' => 'Camera de surveillance hors service dans l interface de controle.',
            ],
            [
                'category' => AiSuggestedCategory::AUTRE->value,
                'priority' => 'low',
                'description' => 'Probleme bureautique general avec lenteurs sur les applications internes.',
                'summary' => 'Lenteurs applicatives sur poste utilisateur a investiguer.',
            ],
        ];
    }
}
