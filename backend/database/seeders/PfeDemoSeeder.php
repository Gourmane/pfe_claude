<?php

namespace Database\Seeders;

use App\Enums\AiSuggestedCategory;
use App\Models\AiSummary;
use App\Models\Client;
use App\Models\Ticket;
use App\Models\TicketComment;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class PfeDemoSeeder extends Seeder
{
    public function run(): void
    {
        $admin = $this->upsertUser(
            'Nadia El Mansouri',
            'admin@pfe.test',
            'admin'
        );

        $technicians = [
            'tech1' => $this->upsertUser('Yassine Berrada', 'tech1@pfe.test', 'technicien'),
            'tech2' => $this->upsertUser('Salma Oujdi', 'tech2@pfe.test', 'technicien'),
        ];

        $clients = collect($this->clientBlueprints())
            ->mapWithKeys(function (array $clientData) {
                $client = $this->upsertClient($clientData);

                return [$clientData['key'] => $client];
            });

        foreach ($this->ticketBlueprints() as $ticketData) {
            $client = $clients[$ticketData['client_key']];

            $ticket = Ticket::updateOrCreate(
                ['title' => $ticketData['title']],
                [
                    'description' => $ticketData['description'],
                    'priority' => $ticketData['priority'],
                    'status' => $ticketData['status'],
                    'client_id' => $client->id,
                    'technician_id' => $ticketData['technician_key']
                        ? $technicians[$ticketData['technician_key']]->id
                        : null,
                    'created_by' => $admin->id,
                    'created_at' => $ticketData['created_at'],
                    'updated_at' => $ticketData['updated_at'],
                    'resolved_at' => $ticketData['resolved_at'],
                    'closed_at' => $ticketData['closed_at'],
                ]
            );

            foreach ($ticketData['comments'] as $commentData) {
                $author = $commentData['author'] === 'admin'
                    ? $admin
                    : $technicians[$commentData['author']];

                TicketComment::updateOrCreate(
                    [
                        'ticket_id' => $ticket->id,
                        'user_id' => $author->id,
                        'comment' => $commentData['comment'],
                    ],
                    [
                        'created_at' => $commentData['created_at'],
                        'updated_at' => $commentData['updated_at'],
                    ]
                );
            }

            if ($ticketData['ai_summary']) {
                AiSummary::updateOrCreate(
                    ['ticket_id' => $ticket->id],
                    $ticketData['ai_summary']
                );
            }
        }

        // ========================================
        // EXTRA TICKETS FOR PAGINATION TEST (SAFE)
        // ========================================
        $clientIds = $clients->pluck('id')->values();
        $technicianIds = collect($technicians)->pluck('id')->values();

        collect([
            [
                'title' => 'Pagination test 01',
                'description' => 'Ticket supplémentaire pour vérifier la pagination de la liste.',
                'status' => 'pending',
                'priority' => 'medium',
                'client_id' => $clientIds[0],
                'technician_id' => null,
            ],
            [
                'title' => 'Pagination test 02',
                'description' => 'Ticket supplémentaire pour vérifier la pagination de la liste.',
                'status' => 'in_progress',
                'priority' => 'high',
                'client_id' => $clientIds[1],
                'technician_id' => $technicianIds[0],
            ],
            [
                'title' => 'Pagination test 03',
                'description' => 'Ticket supplémentaire pour vérifier la pagination de la liste.',
                'status' => 'resolved',
                'priority' => 'low',
                'client_id' => $clientIds[2],
                'technician_id' => $technicianIds[1],
            ],
            [
                'title' => 'Pagination test 04',
                'description' => 'Ticket supplémentaire pour vérifier la pagination de la liste.',
                'status' => 'pending',
                'priority' => 'high',
                'client_id' => $clientIds[3],
                'technician_id' => null,
            ],
            [
                'title' => 'Pagination test 05',
                'description' => 'Ticket supplémentaire pour vérifier la pagination de la liste.',
                'status' => 'in_progress',
                'priority' => 'medium',
                'client_id' => $clientIds[4],
                'technician_id' => $technicianIds[0],
            ],
            [
                'title' => 'Pagination test 06',
                'description' => 'Ticket supplémentaire pour vérifier la pagination de la liste.',
                'status' => 'resolved',
                'priority' => 'low',
                'client_id' => $clientIds[5],
                'technician_id' => $technicianIds[1],
            ],
        ])->each(function (array $ticketData) use ($admin) {
            Ticket::create([
                'title' => $ticketData['title'],
                'description' => $ticketData['description'],
                'status' => $ticketData['status'],
                'priority' => $ticketData['priority'],
                'client_id' => $ticketData['client_id'],
                'technician_id' => $ticketData['technician_id'],
                'created_by' => $admin->id,
            ]);
        });
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

    private function upsertClient(array $clientData): Client
    {
        return Client::updateOrCreate(
            ['email' => $clientData['email']],
            [
                'nom' => $clientData['nom'],
                'telephone' => $clientData['telephone'],
                'adresse' => $clientData['adresse'],
                'entreprise' => $clientData['entreprise'],
            ]
        );
    }

    private function clientBlueprints(): array
    {
        return [
            [
                'key' => 'atlas',
                'nom' => 'Karim Benali',
                'email' => 'karim.benali@atlasconseil.ma',
                'telephone' => '0661234501',
                'adresse' => '14 boulevard Moulay Youssef, Casablanca',
                'entreprise' => 'Atlas Conseil',
            ],
            [
                'key' => 'novacare',
                'nom' => 'Sara El Idrissi',
                'email' => 's.elidrissi@novacare.ma',
                'telephone' => '0661234502',
                'adresse' => '22 avenue Hassan II, Rabat',
                'entreprise' => 'NovaCare Services',
            ],
            [
                'key' => 'riadprint',
                'nom' => 'Omar Chraibi',
                'email' => 'omar.chraibi@riadprint.ma',
                'telephone' => '0661234503',
                'adresse' => '8 rue des Orangers, Marrakech',
                'entreprise' => 'Riad Print',
            ],
            [
                'key' => 'horizon',
                'nom' => 'Imane Tazi',
                'email' => 'imane.tazi@horizonlogistique.ma',
                'telephone' => '0661234504',
                'adresse' => '65 zone industrielle Sidi Bernoussi, Casablanca',
                'entreprise' => 'Horizon Logistique',
            ],
            [
                'key' => 'clinique',
                'nom' => 'Driss Lamrani',
                'email' => 'driss.lamrani@alamal.ma',
                'telephone' => '0661234505',
                'adresse' => '3 rue Ibn Sina, Fès',
                'entreprise' => 'Clinique Al Amal',
            ],
            [
                'key' => 'ecole',
                'nom' => 'Lina Aït Saïd',
                'email' => 'lina.aitsaid@orangers.ma',
                'telephone' => '0661234506',
                'adresse' => '11 avenue Mohammed V, Meknès',
                'entreprise' => 'École Les Orangers',
            ],
            [
                'key' => 'maison',
                'nom' => 'Samir Bousfiha',
                'email' => 'samir@maisonjouri.ma',
                'telephone' => '0661234507',
                'adresse' => '19 boulevard Abdelmoumen, Casablanca',
                'entreprise' => 'Maison Jouri',
            ],
            [
                'key' => 'opticom',
                'nom' => 'Nora Kabbaj',
                'email' => 'nora.kabbaj@opticom.ma',
                'telephone' => '0661234508',
                'adresse' => '27 rue de la Liberté, Tanger',
                'entreprise' => 'OptiCom Maroc',
            ],
        ];
    }

    private function ticketBlueprints(): array
    {
        $now = Carbon::now();

        return [
            [
                'title' => 'Wi-Fi instable au service comptabilité',
                'description' => 'Le réseau Wi-Fi se coupe plusieurs fois par heure au service comptabilité. Les postes perdent l’accès à l’application interne pendant quelques minutes.',
                'priority' => 'urgent',
                'status' => 'pending',
                'client_key' => 'atlas',
                'technician_key' => null,
                'created_at' => $now->copy()->subDays(2),
                'updated_at' => $now->copy()->subDays(2),
                'resolved_at' => null,
                'closed_at' => null,
                'comments' => [
                    [
                        'author' => 'admin',
                        'comment' => 'Le client indique que les coupures sont plus fréquentes près de la salle de réunion.',
                        'created_at' => $now->copy()->subDays(2)->addMinutes(10),
                        'updated_at' => $now->copy()->subDays(2)->addMinutes(10),
                    ],
                ],
                'ai_summary' => [
                    'summary' => 'Incident réseau intermittent affectant le service comptabilité avec coupures Wi-Fi répétées.',
                    'suggested_category' => AiSuggestedCategory::RESEAU->value,
                ],
            ],
            [
                'title' => 'Imprimante réseau bloquée au deuxième étage',
                'description' => 'L’imprimante principale du deuxième étage affiche une file d’attente bloquée. Les utilisateurs ne peuvent plus lancer d’impression depuis ce matin.',
                'priority' => 'medium',
                'status' => 'pending',
                'client_key' => 'riadprint',
                'technician_key' => 'tech1',
                'created_at' => $now->copy()->subDay()->subHours(3),
                'updated_at' => $now->copy()->subDay()->subHour(),
                'resolved_at' => null,
                'closed_at' => null,
                'comments' => [
                    [
                        'author' => 'admin',
                        'comment' => 'Ticket planifié pour la tournée de Yassine en début d’après-midi.',
                        'created_at' => $now->copy()->subDay()->subHours(2),
                        'updated_at' => $now->copy()->subDay()->subHours(2),
                    ],
                ],
                'ai_summary' => [
                    'summary' => 'Incident d’impression sur une imprimante réseau avec file d’attente bloquée.',
                    'suggested_category' => AiSuggestedCategory::IMPRIMANTE->value,
                ],
            ],
            [
                'title' => 'PC de caisse bloqué au démarrage',
                'description' => 'Le poste de caisse reste bloqué sur un écran noir après l’allumage. Le personnel ne peut plus lancer le logiciel de facturation.',
                'priority' => 'high',
                'status' => 'in_progress',
                'client_key' => 'maison',
                'technician_key' => 'tech1',
                'created_at' => $now->copy()->subDays(3),
                'updated_at' => $now->copy()->subHours(5),
                'resolved_at' => null,
                'closed_at' => null,
                'comments' => [
                    [
                        'author' => 'admin',
                        'comment' => 'Le client confirme que le poste fonctionnait normalement à la fermeture hier soir.',
                        'created_at' => $now->copy()->subDays(3)->addMinutes(20),
                        'updated_at' => $now->copy()->subDays(3)->addMinutes(20),
                    ],
                    [
                        'author' => 'tech1',
                        'comment' => 'Diagnostic matériel lancé sur site. Vérification du disque et de l’alimentation en cours.',
                        'created_at' => $now->copy()->subHours(6),
                        'updated_at' => $now->copy()->subHours(6),
                    ],
                ],
                'ai_summary' => [
                    'summary' => 'Poste de caisse bloqué au démarrage avec écran noir, impact direct sur la facturation.',
                    'suggested_category' => AiSuggestedCategory::PC->value,
                ],
            ],
            [
                'title' => 'Caméra du parking hors ligne',
                'description' => 'La caméra couvrant l’entrée du parking n’apparaît plus dans l’interface de supervision. Les autres flux vidéo restent disponibles.',
                'priority' => 'high',
                'status' => 'in_progress',
                'client_key' => 'clinique',
                'technician_key' => 'tech2',
                'created_at' => $now->copy()->subDays(4),
                'updated_at' => $now->copy()->subHours(8),
                'resolved_at' => null,
                'closed_at' => null,
                'comments' => [
                    [
                        'author' => 'admin',
                        'comment' => 'Le responsable sécurité attend un point d’avancement avant la fin de journée.',
                        'created_at' => $now->copy()->subDays(4)->addMinutes(15),
                        'updated_at' => $now->copy()->subDays(4)->addMinutes(15),
                    ],
                    [
                        'author' => 'tech2',
                        'comment' => 'Connexion PoE vérifiée. Un redémarrage du switch caméra est prévu après validation du client.',
                        'created_at' => $now->copy()->subHours(9),
                        'updated_at' => $now->copy()->subHours(9),
                    ],
                ],
                'ai_summary' => [
                    'summary' => 'Caméra de surveillance indisponible dans l’interface, incident localisé sur un seul point vidéo.',
                    'suggested_category' => AiSuggestedCategory::CAMERA->value,
                ],
            ],
            [
                'title' => 'Lenteurs sur l’application RH',
                'description' => 'L’équipe RH constate des lenteurs importantes lors de l’ouverture des dossiers employés. Le reste du poste reste utilisable.',
                'priority' => 'medium',
                'status' => 'resolved',
                'client_key' => 'novacare',
                'technician_key' => 'tech1',
                'created_at' => $now->copy()->subDays(6),
                'updated_at' => $now->copy()->subDay(),
                'resolved_at' => $now->copy()->subDay(),
                'closed_at' => null,
                'comments' => [
                    [
                        'author' => 'tech1',
                        'comment' => 'Nettoyage du poste effectué et cache applicatif vidé. Les performances sont revenues à la normale.',
                        'created_at' => $now->copy()->subDay()->subHours(2),
                        'updated_at' => $now->copy()->subDay()->subHours(2),
                    ],
                ],
                'ai_summary' => [
                    'summary' => 'Lenteurs applicatives ciblées sur l’outil RH, résolues après maintenance locale.',
                    'suggested_category' => AiSuggestedCategory::AUTRE->value,
                ],
            ],
            [
                'title' => 'Connexion VPN instable pour l’agence Rabat',
                'description' => 'Les utilisateurs de l’agence Rabat perdent la connexion VPN de manière aléatoire, ce qui bloque l’accès au serveur de fichiers.',
                'priority' => 'urgent',
                'status' => 'resolved',
                'client_key' => 'horizon',
                'technician_key' => 'tech2',
                'created_at' => $now->copy()->subDays(5),
                'updated_at' => $now->copy()->subDay(),
                'resolved_at' => $now->copy()->subDay(),
                'closed_at' => null,
                'comments' => [
                    [
                        'author' => 'admin',
                        'comment' => 'Incident remonté comme critique par le client, priorité urgente maintenue.',
                        'created_at' => $now->copy()->subDays(5)->addMinutes(30),
                        'updated_at' => $now->copy()->subDays(5)->addMinutes(30),
                    ],
                    [
                        'author' => 'tech2',
                        'comment' => 'Le tunnel VPN a été relancé et la configuration du routeur a été corrigée. Surveillance recommandée pendant 24 heures.',
                        'created_at' => $now->copy()->subDay()->subHour(),
                        'updated_at' => $now->copy()->subDay()->subHour(),
                    ],
                ],
                'ai_summary' => [
                    'summary' => 'Incident VPN critique impactant les accès de l’agence Rabat au serveur de fichiers.',
                    'suggested_category' => AiSuggestedCategory::RESEAU->value,
                ],
            ],
            [
                'title' => 'Remplacement du clavier du poste accueil',
                'description' => 'Le clavier du poste accueil ne répondait plus sur plusieurs touches. Le matériel a été remplacé et le poste fonctionne à nouveau.',
                'priority' => 'low',
                'status' => 'closed',
                'client_key' => 'ecole',
                'technician_key' => 'tech1',
                'created_at' => $now->copy()->subDays(8),
                'updated_at' => $now->copy()->subDays(2),
                'resolved_at' => $now->copy()->subDays(3),
                'closed_at' => $now->copy()->subDays(2),
                'comments' => [
                    [
                        'author' => 'tech1',
                        'comment' => 'Clavier remplacé par un modèle équivalent. Tests de saisie validés avec l’accueil.',
                        'created_at' => $now->copy()->subDays(3)->subHours(2),
                        'updated_at' => $now->copy()->subDays(3)->subHours(2),
                    ],
                ],
                'ai_summary' => [
                    'summary' => 'Incident matériel mineur résolu par remplacement du clavier du poste accueil.',
                    'suggested_category' => AiSuggestedCategory::PC->value,
                ],
            ],
            [
                'title' => 'Messagerie Outlook indisponible au service achats',
                'description' => 'Les utilisateurs du service achats ne reçoivent plus les nouveaux messages sur Outlook depuis hier soir. Le problème a été résolu après resynchronisation.',
                'priority' => 'high',
                'status' => 'closed',
                'client_key' => 'opticom',
                'technician_key' => 'tech2',
                'created_at' => $now->copy()->subDays(7),
                'updated_at' => $now->copy()->subDays(3),
                'resolved_at' => $now->copy()->subDays(4),
                'closed_at' => $now->copy()->subDays(3),
                'comments' => [
                    [
                        'author' => 'admin',
                        'comment' => 'Le client a confirmé le bon fonctionnement avant clôture du ticket.',
                        'created_at' => $now->copy()->subDays(4)->addHours(2),
                        'updated_at' => $now->copy()->subDays(4)->addHours(2),
                    ],
                    [
                        'author' => 'tech2',
                        'comment' => 'Profil Outlook réparé et boîte resynchronisée. Aucun nouvel incident remonté depuis.',
                        'created_at' => $now->copy()->subDays(4),
                        'updated_at' => $now->copy()->subDays(4),
                    ],
                ],
                'ai_summary' => [
                    'summary' => 'Problème de messagerie Outlook résolu après réparation du profil et resynchronisation.',
                    'suggested_category' => AiSuggestedCategory::AUTRE->value,
                ],
            ],
            // -- Tickets supplémentaires pour pagination --
            [
                'title' => 'Écran scintillant sur poste secrétariat',
                'description' => "L'écran du poste secrétariat scintille de manière continue depuis lundi matin. Le câble vidéo et l'alimentation ont été vérifiés sans résultat.",
                'priority' => 'medium',
                'status' => 'pending',
                'client_key' => 'ecole',
                'technician_key' => 'tech2',
                'created_at' => $now->copy()->subDay()->subHours(5),
                'updated_at' => $now->copy()->subDay()->subHours(5),
                'resolved_at' => null,
                'closed_at' => null,
                'comments' => [],
                'ai_summary' => [
                    'summary' => "Scintillement continu de l'écran du poste secrétariat malgré vérification câblage.",
                    'suggested_category' => AiSuggestedCategory::PC->value,
                ],
            ],
            [
                'title' => 'Accès réseau impossible après déménagement de bureau',
                'description' => "Suite au déménagement du bureau 204, le poste ne se connecte plus au réseau filaire. Les prises réseau de la nouvelle salle n'ont peut-être pas été activées.",
                'priority' => 'high',
                'status' => 'in_progress',
                'client_key' => 'atlas',
                'technician_key' => 'tech1',
                'created_at' => $now->copy()->subDays(2)->subHours(4),
                'updated_at' => $now->copy()->subHours(3),
                'resolved_at' => null,
                'closed_at' => null,
                'comments' => [
                    [
                        'author' => 'tech1',
                        'comment' => 'Vérification en cours au local technique. Deux prises du bureau 204 ne sont pas brassées.',
                        'created_at' => $now->copy()->subHours(4),
                        'updated_at' => $now->copy()->subHours(4),
                    ],
                ],
                'ai_summary' => [
                    'summary' => 'Perte de connectivité réseau filaire après déménagement, prises murales probablement non brassées.',
                    'suggested_category' => AiSuggestedCategory::RESEAU->value,
                ],
            ],
            [
                'title' => 'Scanner à plat hors service',
                'description' => "Le scanner à plat du service courrier ne s'allume plus. Le voyant d'alimentation reste éteint même après changement de prise électrique.",
                'priority' => 'low',
                'status' => 'resolved',
                'client_key' => 'horizon',
                'technician_key' => 'tech1',
                'created_at' => $now->copy()->subDays(4)->subHours(2),
                'updated_at' => $now->copy()->subDays(2),
                'resolved_at' => $now->copy()->subDays(2),
                'closed_at' => null,
                'comments' => [
                    [
                        'author' => 'tech1',
                        'comment' => "Alimentation interne défaillante. Scanner remplacé par un modèle de prêt en attendant la commande.",
                        'created_at' => $now->copy()->subDays(2)->subHours(3),
                        'updated_at' => $now->copy()->subDays(2)->subHours(3),
                    ],
                ],
                'ai_summary' => [
                    'summary' => "Scanner à plat en panne matérielle, remplacé temporairement par un appareil de prêt.",
                    'suggested_category' => AiSuggestedCategory::IMPRIMANTE->value,
                ],
            ],
            [
                'title' => 'Installation du logiciel de comptabilité sur nouveau poste',
                'description' => "Un nouveau poste a été livré pour le service comptabilité. Le logiciel métier doit être installé et configuré avec les accès réseau.",
                'priority' => 'medium',
                'status' => 'closed',
                'client_key' => 'novacare',
                'technician_key' => 'tech2',
                'created_at' => $now->copy()->subDays(9),
                'updated_at' => $now->copy()->subDays(4),
                'resolved_at' => $now->copy()->subDays(5),
                'closed_at' => $now->copy()->subDays(4),
                'comments' => [
                    [
                        'author' => 'tech2',
                        'comment' => 'Logiciel installé, licence activée et accès réseau configurés. Poste opérationnel.',
                        'created_at' => $now->copy()->subDays(5)->subHour(),
                        'updated_at' => $now->copy()->subDays(5)->subHour(),
                    ],
                    [
                        'author' => 'admin',
                        'comment' => 'Validé avec le responsable comptabilité. Ticket clôturé.',
                        'created_at' => $now->copy()->subDays(4)->addHour(),
                        'updated_at' => $now->copy()->subDays(4)->addHour(),
                    ],
                ],
                'ai_summary' => [
                    'summary' => "Déploiement et configuration d'un nouveau poste comptabilité avec logiciel métier.",
                    'suggested_category' => AiSuggestedCategory::PC->value,
                ],
            ],
            [
                'title' => 'Caméra couloir principal image floue',
                'description' => "La caméra du couloir principal renvoie une image floue depuis la dernière coupure de courant. Le flux des autres caméras est normal.",
                'priority' => 'medium',
                'status' => 'pending',
                'client_key' => 'clinique',
                'technician_key' => null,
                'created_at' => $now->copy()->subHours(6),
                'updated_at' => $now->copy()->subHours(6),
                'resolved_at' => null,
                'closed_at' => null,
                'comments' => [
                    [
                        'author' => 'admin',
                        'comment' => "Le client demande une intervention rapide, la zone n'est plus correctement surveillée.",
                        'created_at' => $now->copy()->subHours(5),
                        'updated_at' => $now->copy()->subHours(5),
                    ],
                ],
                'ai_summary' => null,
            ],
        ];
    }
}
