# Configuration Firebase pour PASINO Office App

## Étapes de configuration Firebase

### 1. Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Ajouter un projet"
3. Nommez votre projet (ex: "pasino-office-app")
4. Activez Google Analytics (optionnel)
5. Créez le projet

### 2. Configurer l'authentification

1. Dans votre projet Firebase, allez dans **Authentication**
2. Cliquez sur **Commencer**
3. Allez dans l'onglet **Sign-in method**
4. Activez les méthodes de connexion :
   - **Email/Password** : Activez
   - **Google** : Activez et configurez

### 3. Ajouter les applications

#### Pour l'application Web (Expo/React Native)

1. Cliquez sur l'icône Web `</>`
2. Nom de l'app : `PASINO Office Web`
3. Copiez la configuration et remplacez dans `src/config/firebase.js`

```javascript
const firebaseConfig = {
  apiKey: "votre-api-key-ici",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet-id",
  storageBucket: "votre-projet.appspot.com", 
  messagingSenderId: "123456789",
  appId: "votre-app-id"
};
```

#### Pour Android (optionnel)

1. Cliquez sur l'icône Android
2. Package name : `ch.pasino.office`
3. Téléchargez `google-services.json`
4. Placez le fichier à la racine du projet

#### Pour iOS (optionnel)

1. Cliquez sur l'icône iOS
2. Bundle ID : `ch.pasino.office`
3. Téléchargez `GoogleService-Info.plist`
4. Placez le fichier à la racine du projet

### 4. Configurer les domaines autorisés

1. Dans **Authentication > Settings**
2. Ajoutez vos domaines autorisés :
   - `localhost` (pour le développement)
   - `pasino.ch` (votre domaine)
   - Domaines Expo si nécessaire

### 5. Configurer Google Sign-In

1. Allez dans **Authentication > Sign-in method > Google**
2. Activez la méthode
3. Configurez l'email de support
4. Dans les paramètres avancés, ajoutez le domaine autorisé : `pasino.ch`

### 6. Règles de sécurité (optionnel)

Si vous ajoutez Firestore plus tard, configurez les règles :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permettre uniquement aux utilisateurs authentifiés avec @pasino.ch
    match /{document=**} {
      allow read, write: if request.auth != null 
        && request.auth.token.email.matches('.*@pasino.ch$');
    }
  }
}
```

## Variables d'environnement (optionnel)

Créez un fichier `.env` à la racine :

```env
FIREBASE_API_KEY=votre-api-key
FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
FIREBASE_PROJECT_ID=votre-projet-id
FIREBASE_STORAGE_BUCKET=votre-projet.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=votre-app-id
```

## Test de la configuration

1. Lancez l'app : `npx expo start`
2. Testez les différentes méthodes de connexion :
   - Inscription avec email @pasino.ch
   - Connexion avec email/password
   - Connexion Google (sur web)
   - Mode démo

## Sécurité

- Les emails doivent obligatoirement contenir `@pasino.ch`
- Les mots de passe suivent les règles Firebase par défaut
- Les tokens sont gérés automatiquement par Firebase
- Déconnexion automatique si domaine non autorisé

## Troubleshooting

### Erreurs communes :

1. **Configuration manquante** : Vérifiez le fichier `firebase.js`
2. **Domaine non autorisé** : Ajoutez votre domaine dans Firebase Auth
3. **Google Sign-In mobile** : Utilisez email/password ou mode démo
4. **Permissions** : Vérifiez les règles Firebase

### Logs utiles :

```bash
# Voir les logs Expo
npx expo start --clear

# Debug Firebase
# Activez le mode debug dans firebase.js
```

## Production

Pour la production :
1. Remplacez `devFirebaseConfig` par `firebaseConfig` 
2. Désactivez le mode démo
3. Configurez les builds Expo avec les certificats
4. Testez sur les vraies plateformes
