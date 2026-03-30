<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        $clients = Client::query()
            ->when($search, function ($query) use ($search) {
                $query->where('nom', 'like', "%{$search}%")
                      ->orWhere('telephone', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10);

        return response()->json([
            'message' => 'Liste des clients.',
            'data' => $clients,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'telephone' => ['required', 'string', 'max:50'],
            'adresse' => ['nullable', 'string'],
            'entreprise' => ['nullable', 'string'],
        ]);

        $client = Client::create($data);

        return response()->json([
            'message' => 'Client créé avec succès',
            'data' => $client,
        ], 201);
    }

    public function show(Client $client)
    {
        return response()->json([
            'message' => 'Détails du client.',
            'data' => $client,
        ]);
    }

    public function update(Request $request, Client $client)
    {
        $data = $request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'telephone' => ['required', 'string'],
            'adresse' => ['nullable', 'string'],
            'entreprise' => ['nullable', 'string'],
        ]);

        $client->update($data);

        return response()->json([
            'message' => 'Client modifié',
            'data' => $client,
        ]);
    }

    public function destroy(Client $client)
{
    if (auth()->user()->role !== 'admin') {
        return response()->json([
            'message' => 'Accès refusé'
        ], 403);
    }

    if ($client->tickets()->exists()) {
        return response()->json([
            'message' => 'Suppression impossible : ce client possède déjà des tickets.'
        ], 422);
    }

    $client->delete();

    return response()->json([
        'message' => 'Client supprimé'
    ]);
}
}