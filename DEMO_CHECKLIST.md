# Demo Checklist

## Comptes de démonstration

- Admin: `admin@pfe.test` / `password123`
- Technicien 1: `tech1@pfe.test` / `password123`
- Technicien 2: `tech2@pfe.test` / `password123`

## Parcours conseillé

1. Connexion admin.
2. Ouvrir le tableau de bord admin et montrer les indicateurs.
3. Aller dans `Clients`, rechercher un client, puis ouvrir `Nouveau client`.
4. Aller dans `Tickets`, filtrer par statut et priorité.
5. Créer un ticket pour un client existant.
6. Ouvrir un ticket non assigné comme `Wi-Fi instable au service comptabilité`.
7. Assigner le ticket à un technicien.
8. Ajouter un commentaire puis générer le résumé IA.
9. Se déconnecter.
10. Se connecter en technicien.
11. Ouvrir le tableau de bord technicien.
12. Aller dans `Mes tickets`, ouvrir un ticket assigné, changer le statut et ajouter un commentaire.

## Tickets utiles pour la démo

- `Wi-Fi instable au service comptabilité`
  Cas non assigné en attente.
- `Imprimante réseau bloquée au deuxième étage`
  Cas assigné en attente.
- `PC de caisse bloqué au démarrage`
  Cas en cours.
- `Lenteurs sur l’application RH`
  Cas résolu.
- `Messagerie Outlook indisponible au service achats`
  Cas clôturé.

## Vérification finale

- Les messages visibles sont en français.
- Les statuts et priorités s’affichent en français.
- Les rôles restent strictement séparés.
- Les tickets technicien ne montrent que les tickets assignés.
- Les actions asynchrones affichent bien un état de chargement.
- Les formulaires remontent les erreurs de validation en français.
