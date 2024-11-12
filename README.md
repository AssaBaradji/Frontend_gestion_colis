
# Mise en place d'une application de suivi des expeditions de colis

## Aperçu

Ce projet est le frontend d'une mise en place d'une application web de suivi des expeditions de colis pour les agences de transfert de colis. Il permet aux utilisateurs de gérer efficacement les utilisateurs, les expéditions, les paiements, les colis, les livraisons, les méthodes de paiement, et les types de colis.

## Fonctionnalités

### Gestion des utilisateurs

- **Ajouter un utilisateur** : Créez des profils utilisateurs avec les informations nécessaires.
- **Modifier un utilisateur** : Mettez à jour les informations, y compris le statut actif/bloqué.
- **Supprimer un utilisateur** : Supprimez des utilisateurs en fonction des droits d'accès.
- **Lister les utilisateurs** : Affichez tous les utilisateurs avec leur rôle et statut.

### Gestion des expéditions

- **Ajouter une expédition** : Enregistrez une nouvelle expédition pour des colis enregistrés.
- **Modifier une expédition** : Modifiez les détails d’une expédition existante.
- **Supprimer une expédition** : Supprimez une expédition non pertinente ou annulée.
- **Consulter un suivi** : Consultez les détails d’une expédition, y compris la destination, la date et les colis associés.

### Gestion des paiements

- **Ajouter un paiement** : Enregistrez un paiement pour les dépôts ou les réceptions de colis.
- **Modifier un paiement** : Ajustez les informations d’un paiement si nécessaire.
- **Supprimer un paiement** : Annulez un paiement effectué par erreur.
- **Consulter un paiement** : Affichez les détails d’un paiement, comme le montant, la date, et le colis associé.

### Gestion des colis

- **Ajouter un colis** : Enregistrez les informations pour chaque colis.
- **Modifier le colis** : Mettez à jour les informations d’un colis en fonction de sa progression.
- **Supprimer un colis** : Effacez les informations d’un colis si nécessaire.
- **Consulter les colis** : Affichez la liste des colis enregistrés avec leurs informations détaillées.

### Gestion des livraisons

- **Ajouter une livraison** : Enregistrez les détails d’une nouvelle livraison.
- **Modifier une livraison** : Changez les informations d’une livraison programmée.
- **Supprimer une livraison** : Annulez une livraison inutile.
- **Lister les livraisons** : Consultez la liste des livraisons programmées.

### Gestion des méthodes de paiement

- **Ajouter une méthode de paiement** : Enregistrez une nouvelle méthode de paiement.
- **Modifier une méthode de paiement** : Mettez à jour les informations d’une méthode existante.
- **Supprimer une méthode de paiement** : Supprimez une méthode non utilisée.
- **Lister les méthodes de paiement** : Affichez la liste des méthodes de paiement disponibles.

### Gestion des types de colis

- **Ajouter un type de colis** : Ajoutez un nouveau type de colis (Standard, Express, Fragile).
- **Modifier un type de colis** : Mettez à jour les informations d’un type de colis.
- **Supprimer un type de colis** : Supprimez un type de colis non disponible.
- **Lister les types de colis** : Affichez la liste des types de colis disponibles.

## Installation

1. Clonez le dépôt.

```bash
    git clone https://github.com/AssaBaradji/Gestion_des_expeditions_colis.git
    cd projet-frontend
```

2.Installez les dépendances.

```bash
    npm install
```

## Configuration

Créez un fichier `.env` à la racine du projet et configurez la variable suivante pour l'URL de l'API backend :

```plaintext
VUE_APP_API_BASE_URL=http://localhost:3000
```

## Utilisation

Lancez le serveur de développement :

```bash
npm run dev
```

Accédez au frontend à `http://localhost:1573`.

## Structure du projet

- **components** : Composants Vue réutilisables (ex. pour les formulaires d’ajout et de modification).
- **views** : Pages principales de l'application (expéditions, paiements, utilisateurs, etc.).
- **store** : Gestion de l'état (Pinia).
- **router** : Définit les routes de navigation.
