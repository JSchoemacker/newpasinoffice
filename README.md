# PASINO Office App

Application mobile React Native avec Expo pour la gestion interne de PASINO.ch.

## Fonctionnalités

- **Authentification Firebase**: Connexion email/password et Google avec validation du domaine @pasino.ch
- **Navigation par onglets**: 4 sections principales (Events, Games, Supply, Options)
- **Interface moderne**: Design Material avec des icônes et animations fluides
- **Gestion d'état**: Contexte React pour l'authentification Firebase
- **Stockage local**: Persistance de la session utilisateur avec AsyncStorage

## Installation

### 1. Installation des dépendances

```bash
cd PasinoApp
npm install
```

### 2. Configuration Firebase

**Important** : Suivez le guide détaillé dans `FIREBASE_SETUP.md` pour configurer Firebase.

Résumé rapide :
1. Créez un projet sur [Firebase Console](https://console.firebase.google.com/)
2. Activez Authentication (Email/Password + Google)
3. Copiez la configuration dans `src/config/firebase.js`
4. Ajoutez les domaines autorisés

### 3. Configuration de l'authentification

Modifiez le fichier `src/config/firebase.js` avec vos vraies clés Firebase :

```javascript
const firebaseConfig = {
  apiKey: "votre-api-key",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet-id",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "votre-app-id"
};
```

## Lancement de l'application

### Développement

```bash
npx expo start
```

Puis scannez le QR code avec l'app Expo Go.

### Options de connexion disponibles :

1. **Email/Password** : Inscription et connexion avec email @pasino.ch
2. **Google Sign-In** : Disponible sur web, email/password recommandé sur mobile
3. **Mode Démo** : Pour tester sans configuration Firebase

## Structure du projet

```
src/
├── components/          # Composants réutilisables
├── config/             # Configuration Firebase
│   └── firebase.js         # Configuration Firebase
├── contexts/           # Contextes React (AuthContext)
├── navigation/         # Navigation et routage
├── screens/           # Écrans de l'application
│   ├── LoginScreen.js     # Écran de connexion complet
│   ├── HomeScreen.js      # Écran d'accueil
│   ├── EventScreen.js     # Gestion des événements
│   ├── GamesScreen.js     # Gestion des jeux
│   ├── SupplyScreen.js    # Gestion des fournitures
│   ├── OptionsScreen.js   # Paramètres et options
│   └── LoadingScreen.js   # Écran de chargement
└── styles/            # Styles et thème
    └── theme.js           # Couleurs et styles globaux
```

## Authentification et Sécurité

### Fonctionnalités d'authentification :
- **Inscription** avec email @pasino.ch obligatoire
- **Connexion** email/password
- **Connexion Google** (web principalement)
- **Validation du domaine** automatique
- **Déconnexion** sécurisée
- **Persistance** de session

### Sécurité :
- Vérification obligatoire du domaine @pasino.ch
- Gestion automatique des tokens Firebase
- Déconnexion automatique si email non autorisé
- Chiffrement des données stockées localement

## Développement

### Mode démo
Pour tester rapidement sans configuration Firebase :
```javascript
// Utilisez le bouton "Connexion Démo" dans l'app
```

### Variables d'environnement
Créez un fichier `.env` (optionnel) :
```env
FIREBASE_API_KEY=votre-api-key
FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
# ... autres variables
```

### Build pour production

```bash
# Android
npx expo build:android

# iOS  
npx expo build:ios

# Web
npx expo build:web
```

## Personnalisation

### Couleurs principales (theme.js)
- Bleu primaire : `#4285f4`
- Vert succès : `#34a853` 
- Orange attention : `#fbbc04`
- Rouge erreur : `#ea4335`

### Firebase Rules (si Firestore ajouté)
```javascript
// Autoriser uniquement les utilisateurs @pasino.ch
allow read, write: if request.auth != null 
  && request.auth.token.email.matches('.*@pasino.ch$');
```

## Troubleshooting

### Erreurs communes :
1. **Firebase not configured** : Vérifiez `src/config/firebase.js`
2. **Domain not authorized** : Ajoutez votre domaine dans Firebase Console
3. **Google Sign-In mobile** : Utilisez email/password sur mobile
4. **Email domain rejected** : Vérifiez que l'email contient @pasino.ch

### Debug :
```bash
# Logs détaillés
npx expo start --clear

# Logs Firebase dans la console navigateur
```

## Support et Documentation

- Guide Firebase : `FIREBASE_SETUP.md`
- Documentation Expo : [https://docs.expo.dev/](https://docs.expo.dev/)
- Documentation Firebase : [https://firebase.google.com/docs](https://firebase.google.com/docs)

## Licence

© 2025 PASINO.ch - Tous droits réservés.
