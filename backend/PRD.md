**AI IT Assistant Platform**

**PRD V3 FINAL**

Product Requirements Document

|   |   |
|---|---|
|**Version**|V3 FINAL|
|**Statut**|Approuvé|
|**Stack**|Laravel 12 + React + MySQL|
|**IA**|Groq API|
|**Délai**|1 semaine (MVP PFE)|

  

# 1. Nom du projet

AI IT Assistant Platform

# 2. Contexte

AI IT Assistant Platform est une application web interne de gestion du support technique informatique pour une petite structure ou un technicien IT.

### Domaines couverts

•       Réparation PC

•       Imprimantes

•       Caméras

•       Réseau

•       Maintenance informatique

### Besoins centraux

•       Centraliser les clients

•       Créer des tickets

•       Assigner les demandes

•       Suivre l'avancement

•       Garder un historique

•       Ajouter une aide IA simple

# 3. Problème

Dans le support technique quotidien, on rencontre souvent :

•       Oubli des demandes clients

•       Difficulté à suivre les interventions

•       Manque d'historique clair

•       Perte de temps dans l'organisation

•       Retard dans le traitement

# 4. Solution proposée

Créer une plateforme web interne qui permet de :

•       Gérer les utilisateurs internes

•       Gérer les clients

•       Créer et suivre des tickets

•       Assigner les tickets à un technicien

•       Suivre les statuts jusqu'à clôture

•       Afficher un dashboard

•       Générer un résumé IA et une catégorie suggérée

# 5. Vision du MVP

Construire un MVP faisable en 1 semaine, clair, démontrable et réaliste pour un PFE.

### Le MVP privilégie

•       Logique métier claire

•       Développement rapide

•       Architecture simple

•       Interface sobre

•       IA légère mais visible

# 6. Objectifs

### Objectif principal

Livrer une application capable de gérer le cycle complet d'un ticket :

**demande client → création → assignation → traitement → résolution → clôture → historique**

### Objectifs secondaires

•       Améliorer l'organisation

•       Réduire les oublis

•       Accélérer le traitement

•       Montrer une intégration IA simple dans un projet métier

# 7. Acteurs

## 7.1 Admin

•       Se connecter

•       Gérer les clients

•       Créer les tickets

•       Consulter tous les tickets

•       Assigner un ticket

•       Modifier un ticket avant clôture

•       Clôturer un ticket résolu

•       Consulter le dashboard

•       Générer un résumé IA

## 7.2 Technicien

•       Se connecter

•       Consulter les tickets qui lui sont assignés

•       Changer le statut selon les règles métier

•       Ajouter des notes

•       Générer un résumé IA

## 7.3 Client

**⚠️  Dans la V1, le client n'a pas de compte et ne se connecte pas au système.**

•       Il a un problème

•       Il contacte l'entreprise par téléphone, WhatsApp ou en direct

•       Il donne ses informations

•       Il attend la résolution

# 8. Scope du MVP

|   |   |
|---|---|
|**✅ In Scope**|**❌ Out of Scope**|
|Authentification interne|Login client|
|Rôles|Portail client|
|CRUD Clients|Notifications avancées|
|CRUD Tickets|Paiement|
|Assignation|Chat temps réel|
|Gestion des statuts|Application mobile|
|Notes de suivi|Analytics complexes|
|Dashboard simple|Déploiement production|
|Résumé IA||

# 9. Règles métier principales

1.     Un ticket appartient à un seul client.

2.     Un ticket peut être créé sans technicien assigné.

3.     Un ticket peut être assigné à un seul technicien.

4.     Seul l'admin peut assigner un ticket.

5.     Seul le technicien assigné peut faire progresser un ticket de pending à in_progress, puis à resolved.

6.     Seul l'admin peut passer un ticket de resolved à closed.

7.     Le client ne modifie jamais le système dans la V1.

8.     Les notes technicien sont stockées dans ticket_comments.

9.     Le résumé IA peut être généré par l'admin ou le technicien.

10.  Un ticket clôturé reste dans l'historique.

11.  Un client ayant déjà des tickets ne peut pas être supprimé dans le MVP.

# 10. Workflow fonctionnel final

  

|   |   |
|---|---|
|**Étape 1**|**Réception de la demande**<br><br>Le client contacte l'entreprise avec son problème (PC, imprimante, réseau, caméra…).|

|   |   |
|---|---|
|**Étape 2**|**Recherche ou création du client**<br><br>L'admin recherche le client dans la base, ou crée sa fiche si elle n'existe pas.|

|   |   |
|---|---|
|**Étape 3**|**Création du ticket**<br><br>L'admin crée le ticket : titre, description, priorité, client. Statut initial : pending.|

|   |   |
|---|---|
|**Étape 4**|**Assignation**<br><br>L'admin assigne le ticket à un technicien.|

|   |   |
|---|---|
|**Étape 5**|**Prise en charge**<br><br>Le technicien consulte, lit les infos client, commence le traitement. Statut → in_progress.|

|   |   |
|---|---|
|**Étape 6**|**Intervention**<br><br>Le technicien appelle, intervient à distance ou se déplace. Il ajoute des notes.|

|   |   |
|---|---|
|**Étape 7**|**Résolution**<br><br>Le technicien corrige le problème. Statut → resolved.|

|   |   |
|---|---|
|**Étape 8**|**Clôture**<br><br>L'admin vérifie et ferme le ticket. Statut → closed.|

|   |   |
|---|---|
|**Étape 9**|**Historique**<br><br>Le ticket reste consultable dans le système.|

# 11. Gestion des statuts

### Valeurs autorisées

•       pending

•       in_progress

•       resolved

•       closed

### Transitions

|   |   |   |
|---|---|---|
|**Transition**|**Qui**|**Autorisée ?**|
|pending → in_progress|Technicien assigné|✅ OUI|
|in_progress → resolved|Technicien assigné|✅ OUI|
|resolved → closed|Admin|✅ OUI|
|pending → closed|—|❌ NON|
|resolved → in_progress|—|❌ NON|
|closed → autre|—|❌ NON|

# 12. Gestion des priorités

|   |   |   |   |
|---|---|---|---|
|**LOW**|**MEDIUM**|**HIGH**|**URGENT**|

La priorité est choisie par l'admin à la création du ticket.

# 13. Fonctionnalités détaillées

  

## F1 — Authentification et rôles

•       Un utilisateur a un seul rôle

•       Rôles autorisés : admin, technicien

### Critères d'acceptation

•       Login / logout fonctionnels

•       Admin et technicien voient uniquement leurs écrans autorisés

## F2 — Gestion des clients

### Champs client

•       nom

•       téléphone

•       adresse

•       email (nullable)

•       entreprise (nullable)

### Recherche MVP

•       Par nom

•       Par téléphone

### Règle de suppression

Si un client a des tickets, suppression interdite avec message : "Suppression impossible : ce client possède déjà des tickets."

## F3 — Gestion des tickets

### Champs ticket

•       titre

•       description

•       statut

•       priorité

•       client

•       technicien assigné (nullable)

•       créé par (FK → users.id)

•       dates système

### Règles de modification

•       Admin : peut modifier les champs métier avant clôture

•       Technicien : peut seulement changer le statut et ajouter des notes

## F4 — Assignation

•       Un ticket peut exister sans assignation

•       L'assignation met à jour technician_id

•       Le technicien voit les tickets qui lui sont assignés

## F5 — Notes de suivi

•       En base : table ticket_comments

•       En interface : affiché comme "Notes"

•       Auteur et date visibles

## F6 — Dashboard

### Indicateurs MVP

•       Nombre total de clients

•       Nombre total de tickets

•       Nombre de tickets par statut

•       5 tickets les plus récents (triés par created_at DESC)

## F7 — Assistant IA

|   |   |
|---|---|
|**Fournisseur**|Groq API|

|   |   |
|---|---|
|**Déclenchement**|Bouton manuel : "Générer un résumé"|

|   |   |
|---|---|
|**Qui peut générer**|Admin et Technicien|

|   |   |
|---|---|
|**Entrée**|ticket.description|

|   |   |
|---|---|
|**Sortie**|Résumé court + Catégorie suggérée|

### Catégories autorisées

|   |   |   |   |   |
|---|---|---|---|---|
|**PC**|**Imprimante**|**Réseau**|**Caméra**|**Autre**|

|   |   |
|---|---|
|**Régénération**|Autorisée — remplace l'ancien résumé (updateOrCreate)|

# 14. User Stories finales

  

|   |   |   |
|---|---|---|
|**#**|**Rôle**|**User Story**|
|US-01|Admin|Je veux me connecter afin d'accéder au système.|
|US-02|Admin|Je veux gérer les clients afin de centraliser leurs informations.|
|US-03|Admin|Je veux créer un ticket pour un client afin d'enregistrer sa demande.|
|US-04|Admin|Je veux assigner un ticket à un technicien afin d'organiser le traitement.|
|US-05|Technicien|Je veux voir mes tickets assignés afin de savoir quoi traiter.|
|US-06|Technicien|Je veux changer le statut d'un ticket afin de suivre l'avancement.|
|US-07|Technicien|Je veux ajouter des notes afin de garder une trace du traitement.|
|US-08|Admin|Je veux consulter un dashboard afin de suivre l'activité.|
|US-09|Admin / Technicien|Je veux générer un résumé IA afin de comprendre rapidement le problème.|

# 15. Architecture fonctionnelle

|   |   |
|---|---|
|**Module**|**Module**|
|Auth|Notes|
|Users / Roles|Dashboard|
|Clients|AI Suggestions|
|Tickets||

# 16. Architecture technique

|   |   |
|---|---|
|**Composant**|**Technologie**|
|**Backend**|Laravel 12|
|**Frontend**|React|
|**Base de données**|MySQL|
|**ORM**|Eloquent|
|**Auth**|Sanctum|
|**UI**|Tailwind CSS|
|**IA**|Groq API|

# 17. Modèle de données final

  

### Table : users

|   |   |
|---|---|
|**Champ**|**Type / Contrainte**|
|**id**|Primary Key, Auto Increment|
|**name**|VARCHAR, NOT NULL|
|**email**|VARCHAR, UNIQUE, NOT NULL|
|**password**|VARCHAR, NOT NULL|
|**role**|ENUM(admin, technicien), NOT NULL|
|**created_at**|TIMESTAMP|
|**updated_at**|TIMESTAMP|

### Table : clients

|   |   |
|---|---|
|**Champ**|**Type / Contrainte**|
|**id**|Primary Key, Auto Increment|
|**nom**|VARCHAR, NOT NULL|
|**email**|VARCHAR, NULLABLE|
|**telephone**|VARCHAR, NOT NULL|
|**adresse**|VARCHAR, NULLABLE|
|**entreprise**|VARCHAR, NULLABLE|
|**created_at**|TIMESTAMP|
|**updated_at**|TIMESTAMP|

### Table : tickets

|   |   |
|---|---|
|**Champ**|**Type / Contrainte**|
|**id**|Primary Key, Auto Increment|
|**title**|VARCHAR, NOT NULL|
|**description**|TEXT, NOT NULL|
|**status**|ENUM(pending, in_progress, resolved, closed), DEFAULT pending|
|**priority**|ENUM(low, medium, high, urgent), NOT NULL|
|**client_id**|FK → clients.id, NOT NULL|
|**technician_id**|FK → users.id, NULLABLE|
|**created_by**|FK → users.id, NOT NULL|
|**resolved_at**|TIMESTAMP, NULLABLE|
|**closed_at**|TIMESTAMP, NULLABLE|
|**created_at**|TIMESTAMP|
|**updated_at**|TIMESTAMP|

### Table : ticket_comments

|   |   |
|---|---|
|**Champ**|**Type / Contrainte**|
|**id**|Primary Key, Auto Increment|
|**ticket_id**|FK → tickets.id, CASCADE DELETE|
|**user_id**|FK → users.id, NOT NULL|
|**comment**|TEXT, NOT NULL|
|**created_at**|TIMESTAMP|
|**updated_at**|TIMESTAMP|

### Table : ai_summaries

|   |   |
|---|---|
|**Champ**|**Type / Contrainte**|
|**id**|Primary Key, Auto Increment|
|**ticket_id**|FK → tickets.id, UNIQUE (1 résumé par ticket)|
|**summary**|TEXT, NOT NULL|
|**suggested_category**|ENUM(PC, Imprimante, Réseau, Caméra, Autre)|
|**created_at**|TIMESTAMP|
|**updated_at**|TIMESTAMP|

# 18. Relations principales

•       Un client a plusieurs tickets

•       Un ticket appartient à un client

•       Un ticket peut appartenir à un technicien (nullable)

•       Un technicien peut recevoir plusieurs tickets

•       Un ticket a plusieurs commentaires

•       Un commentaire appartient à un ticket

•       Un commentaire appartient à un utilisateur

•       Un ticket a zéro ou un résumé IA (unique)

•       Un ticket est créé par un utilisateur interne via created_by

# 19. Contraintes du projet

•       Délai court (1 semaine)

•       MVP d'abord

•       Éviter les features complexes

•       Interface simple mais propre

•       Architecture claire

# 20. Risques et mitigation

|   |   |
|---|---|
|**⚠️ Risque**|**✅ Mitigation**|
|Perte de temps dans le design|Développer feature par feature|
|Bugs de relations entre tables|Ne pas dépasser le scope MVP|
|Complexité excessive de l'IA|Garder l'IA à une seule fonctionnalité|
|Mauvaise gestion du temps|Tester chaque module avant de continuer|

# 21. Définition de réussite

Le projet est réussi si toutes les conditions suivantes sont remplies :

|   |   |
|---|---|
|✅|Auth fonctionne|
|✅|CRUD Clients fonctionne|
|✅|CRUD Tickets fonctionne|
|✅|Assignation fonctionne|
|✅|Statuts respectent le workflow|
|✅|Notes fonctionnent|
|✅|Dashboard affiche les bons chiffres|
|✅|Résumé IA fonctionne|
|✅|Démo claire et fluide|

# 22. Livrables attendus

•       Code source (Laravel + React)

•       Base de données (migrations + seeders)

•       PRD V3 final (ce document)

•       Diagramme de cas d'utilisation

•       Diagramme de classes simplifié

•       Présentation

•       Démonstration fonctionnelle

⚠️  Note : Les diagrammes doivent être préparés en parallèle du développement, pas à la toute fin.

# 23. Conclusion

AI IT Assistant Platform V3 est une plateforme interne de gestion du support IT, avec un workflow simple et crédible :

•       Le client signale un problème hors système

•       L'admin organise

•       Le technicien traite

•       Le système garde l'historique

•       Groq ajoute une aide IA rapide pour résumer et classifier

### Corrections intégrées dans cette version

•       created_by est défini comme FK → users.id

•       La génération IA est autorisée pour admin et technicien

•       La suppression d'un client avec tickets est interdite

•       updateOrCreate explicitement mentionné pour ai_summaries