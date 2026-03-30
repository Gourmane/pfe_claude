<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;

class TechnicianController extends Controller
{
    public function index()
    {
        $technicians = User::where('role', 'technicien')
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return response()->json([
            'message' => 'Liste des techniciens.',
            'data' => $technicians,
        ]);
    }
}
