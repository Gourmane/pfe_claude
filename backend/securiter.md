# Tests de securite API

Ce fichier liste les cas de test de securite a executer sur les routes sensibles du projet.

## Preconditions

- Avoir au moins un compte `admin`
- Avoir au moins deux comptes `technicien` pour tester le cas du technicien non assigne
- Avoir au moins un ticket existant, par exemple `ticket_id = 1`
- Avoir les tokens d'authentification des comptes utilises

## CAS SECURITE 1 - Un technicien essaie d'assigner un ticket

**Methode**

```http
POST /api/tickets/1/assign
```

**Header**

```text
Authorization: Bearer <token_technicien>
Content-Type: application/json
```

**Resultat attendu**

- HTTP `403`
- Acces interdit

## CAS SECURITE 2 - Un admin essaie d'ajouter une note

**Methode**

```http
POST /api/tickets/1/comments
```

**Header**

```text
Authorization: Bearer <token_admin>
Content-Type: application/json
```

**Body**

```json
{
  "comment": "Tentative de note par admin"
}
```

**Resultat attendu**

```json
{
  "message": "Seul un technicien peut ajouter des notes."
}
```

## CAS SECURITE 3 - Technicien non assigne essaie de changer le statut

Si vous avez un autre technicien dans la base, connectez-vous avec lui et testez :

**Methode**

```http
POST /api/tickets/1/status
```

**Header**

```text
Authorization: Bearer <token_autre_technicien>
Content-Type: application/json
```

**Body**

```json
{
  "status": "in_progress"
}
```

**Resultat attendu fonctionnel**

- Refus de la transition

**Resultat actuel de l'API**

```json
{
  "message": "Ce ticket n est pas assigne a ce technicien."
}
```

## CAS SECURITE 4 - Transition interdite

Tester avec un token technicien sur un ticket encore en statut `pending`.

**Methode**

```http
POST /api/tickets/1/status
```

**Header**

```text
Authorization: Bearer <token_technicien>
Content-Type: application/json
```

**Body**

```json
{
  "status": "closed"
}
```

**Resultat attendu fonctionnel**

- Refus avec message de transition interdite

**Resultat actuel de l'API**

```json
{
  "message": "Transition de statut non autorisee."
}
```
