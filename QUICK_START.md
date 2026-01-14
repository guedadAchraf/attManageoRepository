# ⚡ Quick Start - Frontend Angular 16

## Installation Rapide

```bash
# 1. Naviguer vers le dossier frontend
cd frontend

# 2. Installer les dépendances
npm install

# 3. Démarrer l'application
npm start
```

L'application sera accessible sur: **http://localhost:4200**

## Configuration Minimale

### 1. Configurer l'URL du Backend

Éditez `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001/api'  // Changez si nécessaire
};
```

### 2. S'assurer que le Backend est démarré

```bash
# Dans un autre terminal
cd backend
npm start
```

## Premiers Pas

### 1. Créer un compte Admin (Backend)

```bash
cd backend
node reset-admin-password.js
```

Utilisez les identifiants:
- Email: `admin@example.com`
- Mot de passe: `admin123`

### 2. Se connecter

1. Ouvrez http://localhost:4200
2. Cliquez sur "Se connecter"
3. Entrez les identifiants admin
4. Vous êtes redirigé vers le tableau de bord

### 3. Créer votre premier formulaire

1. Cliquez sur "Formulaires" dans la barre de navigation
2. Cliquez sur "Créer un formulaire"
3. Donnez un nom à votre formulaire
4. Ajoutez des champs (texte court, texte long)
5. Cliquez sur "Créer le formulaire"

### 4. Remplir le formulaire

1. Dans la liste des formulaires, cliquez sur l'icône "Remplir" (crayon)
2. Remplissez les champs
3. Cliquez sur "Soumettre"
4. Choisissez de générer un fichier Excel

### 5. Télécharger le fichier Excel

1. Cliquez sur "Fichiers Excel" dans la barre de navigation
2. Cliquez sur l'icône "Télécharger" pour votre fichier
3. Le fichier Excel est téléchargé avec vos données

## Commandes Utiles

```bash
# Démarrer en mode développement
npm start

# Build de production
npm run build:prod

# Lancer les tests
npm test

# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

## Ports par Défaut

- **Frontend**: http://localhost:4200
- **Backend**: http://localhost:3001

## Problèmes Courants

### Port 4200 déjà utilisé
```bash
ng serve --port 4300
```

### Erreur CORS
Vérifiez que le backend autorise `http://localhost:4200` dans sa configuration CORS.

### Token invalide
Déconnectez-vous et reconnectez-vous.

## Structure des Routes

| Route | Description |
|-------|-------------|
| `/login` | Connexion |
| `/register` | Inscription |
| `/dashboard` | Tableau de bord |
| `/forms` | Liste des formulaires |
| `/forms/create` | Créer un formulaire |
| `/forms/:id/edit` | Modifier un formulaire |
| `/forms/:id/submit` | Remplir un formulaire |
| `/excel` | Fichiers Excel |
| `/admin/users` | Gestion des utilisateurs (Admin) |

## Technologies

- Angular 16
- Angular Material
- RxJS
- TypeScript
- SCSS

## Support

Consultez `FRONTEND_SETUP.md` pour une documentation complète.

---

**Prêt à démarrer!** 🚀
