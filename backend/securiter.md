# Tests de sécurité API

Ce fichier liste les cas de test de sécurité à exécuter sur les routes sensibles du projet.

## Préconditions

- Avoir au moins un compte `admin`
- Avoir au moins deux comptes `technicien` pour tester le cas du technicien non assigné
- Avoir au moins un ticket existant, par exemple `ticket_id = 1`
- Avoir les tokens d'authentification des comptes utilisés

## CAS SÉCURITÉ 1 — Un technicien essaie d'assigner un ticket

**Méthode**

```http
POST /api/tickets/1/assign
```

**Header**

```text
Authorization: Bearer <token_technicien>
Content-Type: application/json
```

**Body**

```json
{
  "technician_id": 2
}
```

**Résultat attendu**

- HTTP `403`
- Message : "Accès interdit."

---

## CAS SÉCURITÉ 2 — Un technicien non assigné essaie d'ajouter une note

**Méthode**

```http
POST /api/tickets/1/comments
```

**Header**

```text
Authorization: Bearer <token_autre_technicien>
Content-Type: application/json
```

**Body**

```json
{
  "comment": "Tentative de note par un technicien non assigné"
}
```

**Résultat attendu**

- HTTP `403`
- Message : "Vous ne pouvez ajouter des notes que sur vos tickets assignés."

> **Note :** Un admin peut ajouter des commentaires sur n'importe quel ticket. Seul un technicien non assigné est bloqué.

---

## CAS SÉCURITÉ 3 — Technicien non assigné essaie de changer le statut

Si vous avez un autre technicien dans la base, connectez-vous avec lui et testez :

**Méthode**

```http
PATCH /api/tickets/1/status
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

**Résultat attendu**

- HTTP `403`
- Message : "Ce ticket n'est pas assigné à ce technicien."

---

## CAS SÉCURITÉ 4 — Transition de statut interdite

Tester avec un token technicien sur un ticket encore en statut `pending`.

**Méthode**

```http
PATCH /api/tickets/1/status
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

**Résultat attendu**

- HTTP `422`
- Message : "Transition de statut interdite."

---

## CAS SÉCURITÉ 5 — Un technicien essaie de créer un ticket

**Méthode**

```http
POST /api/tickets
```

**Header**

```text
Authorization: Bearer <token_technicien>
Content-Type: application/json
```

**Body**

```json
{
  "title": "Test ticket",
  "description": "Description test",
  "priority": "medium",
  "client_id": 1
}
```

**Résultat attendu**

- HTTP `403`
- Message : "Accès interdit."

---

## CAS SÉCURITÉ 6 — Un technicien essaie d'accéder aux clients

**Méthode**

```http
GET /api/clients
```

**Header**

```text
Authorization: Bearer <token_technicien>
```

**Résultat attendu**

- HTTP `403`
- Message : "Accès interdit."
