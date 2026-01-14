# Forms Management Frontend - Angular 16

Application Angular 16 pour la gestion de formulaires dynamiques avec génération de fichiers Excel.

## 🚀 Fonctionnalités

### Authentification JWT
- Connexion / Inscription
- Protection des routes avec guards
- Gestion des rôles (ADMIN / USER)
- Intercepteur HTTP pour l'authentification automatique

### Gestion des Formulaires Dynamiques
- **Créer** des formulaires avec des champs personnalisés
- **Modifier** la structure des formulaires existants
- **Soumettre** des données via les formulaires
- Types de champs supportés:
  - Texte court (input)
  - Texte long (textarea)
  - Champs requis/optionnels
  - Réorganisation des champs (drag & drop)

### Génération de Fichiers Excel
- Génération automatique après soumission
- Versioning des fichiers Excel
- Téléchargement des fichiers générés
- Gestion de l'historique des exports

### Administration (ADMIN uniquement)
- Gestion des utilisateurs
- Création de comptes
- Modification des rôles
- Suppression d'utilisateurs

## 📋 Prérequis

- Node.js 16+ et npm
- Angular CLI 16
- Backend API en cours d'exécution

## 🛠️ Installation

```bash
# Installer les dépendances
npm install

# Installer Angular CLI globalement (si nécessaire)
npm install -g @angular/cli@16
```

## ⚙️ Configuration

Modifiez les fichiers d'environnement selon votre configuration:

### Development (`src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001/api'
};
```

### Production (`src/environments/environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-url.vercel.app/api'
};
```

## 🚀 Démarrage

### Mode développement
```bash
npm start
# ou
ng serve
```

L'application sera accessible sur `http://localhost:4200`

### Build de production
```bash
npm run build
# ou
ng build --configuration production
```

Les fichiers de build seront dans le dossier `dist/forms-management`

## 📁 Structure du Projet

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/                    # Services, guards, interceptors
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── admin.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts
│   │   │   └── services/
│   │   │       ├── auth.service.ts
│   │   │       ├── form.service.ts
│   │   │       ├── excel.service.ts
│   │   │       └── user.service.ts
│   │   ├── features/                # Modules fonctionnels
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── dashboard/
│   │   │   ├── forms/
│   │   │   │   ├── form-list/
│   │   │   │   ├── form-create/
│   │   │   │   ├── form-edit/
│   │   │   │   └── form-submit/
│   │   │   ├── excel/
│   │   │   │   └── excel-list/
│   │   │   └── admin/
│   │   │       └── user-management/
│   │   ├── shared/                  # Composants partagés
│   │   │   └── components/
│   │   │       └── navbar/
│   │   ├── app-routing.module.ts
│   │   ├── app.module.ts
│   │   └── app.component.ts
│   ├── environments/
│   ├── assets/
│   ├── styles.scss
│   └── index.html
├── angular.json
├── package.json
└── tsconfig.json
```

## 🎨 Technologies Utilisées

- **Angular 16** - Framework principal
- **Angular Material** - Composants UI
- **RxJS** - Programmation réactive
- **TypeScript** - Langage de programmation
- **SCSS** - Styles

## 🔐 Authentification

L'application utilise JWT (JSON Web Tokens) pour l'authentification:

1. Le token est stocké dans `localStorage`
2. L'intercepteur HTTP ajoute automatiquement le token aux requêtes
3. Les guards protègent les routes nécessitant une authentification
4. Le token est vérifié à chaque requête côté backend

## 📱 Routes Disponibles

| Route | Description | Protection |
|-------|-------------|------------|
| `/login` | Page de connexion | Public |
| `/register` | Page d'inscription | Public |
| `/dashboard` | Tableau de bord | Auth |
| `/forms` | Liste des formulaires | Auth |
| `/forms/create` | Créer un formulaire | Auth |
| `/forms/:id/edit` | Modifier un formulaire | Auth |
| `/forms/:id/submit` | Remplir un formulaire | Auth |
| `/excel` | Liste des fichiers Excel | Auth |
| `/admin/users` | Gestion des utilisateurs | Admin |

## 🔧 Scripts Disponibles

```bash
# Démarrer le serveur de développement
npm start

# Build de production
npm run build

# Build avec watch mode
npm run watch

# Lancer les tests
npm test
```

## 🌐 Déploiement

### Vercel (Recommandé)

1. Installer Vercel CLI:
```bash
npm install -g vercel
```

2. Déployer:
```bash
vercel
```

3. Configurer les variables d'environnement dans le dashboard Vercel

### Autres plateformes

Le dossier `dist/forms-management` contient les fichiers statiques à déployer sur:
- Netlify
- Firebase Hosting
- AWS S3 + CloudFront
- GitHub Pages

## 🐛 Dépannage

### Erreur CORS
Vérifiez que le backend autorise l'origine du frontend dans sa configuration CORS.

### Token expiré
Le token JWT expire après 7 jours. L'utilisateur sera automatiquement déconnecté.

### Erreur de connexion API
Vérifiez que l'URL de l'API dans `environment.ts` est correcte et que le backend est accessible.

## 📝 Notes Importantes

- Les mots de passe doivent contenir au moins 6 caractères
- Les fichiers Excel sont générés à la demande (pas de stockage permanent sur Vercel)
- Les administrateurs ne peuvent pas supprimer leur propre compte
- Les formulaires ne peuvent être modifiés que par leur créateur

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.
