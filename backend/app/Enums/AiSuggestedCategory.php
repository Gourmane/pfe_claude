<?php

namespace App\Enums;

enum AiSuggestedCategory: string
{
    case PC = 'PC';
    case IMPRIMANTE = 'Imprimante';
    case RESEAU = 'Réseau';
    case CAMERA = 'Caméra';
    case AUTRE = 'Autre';

    public static function values(): array
    {
        return array_map(
            static fn (self $category) => $category->value,
            self::cases()
        );
    }

    public static function fromInput(mixed $value): ?self
    {
        if (! is_string($value)) {
            return null;
        }

        return match (trim($value)) {
            'PC' => self::PC,
            'Imprimante' => self::IMPRIMANTE,
            'Reseau', 'Réseau' => self::RESEAU,
            'Camera', 'Caméra' => self::CAMERA,
            'Autre' => self::AUTRE,
            default => null,
        };
    }
}
