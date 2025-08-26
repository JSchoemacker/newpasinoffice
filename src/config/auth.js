// Configuration pour l'authentification Google
// IMPORTANT: Remplacez ces valeurs par vos vraies clés d'API Google
export const AUTH_CONFIG = {
  // Vous devez créer un projet sur Google Cloud Console
  // et obtenir ces identifiants OAuth 2.0
  
  // ID client pour Android
  ANDROID_CLIENT_ID: 'VOTRE_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  
  // ID client pour iOS  
  IOS_CLIENT_ID: 'VOTRE_IOS_CLIENT_ID.apps.googleusercontent.com',
  
  // ID client pour Expo (pour le développement)
  EXPO_CLIENT_ID: 'VOTRE_EXPO_CLIENT_ID.apps.googleusercontent.com',
  
  // Domaine autorisé
  ALLOWED_DOMAIN: '@pasino.ch',
  
  // URL de redirection pour Expo
  REDIRECT_URI: 'https://auth.expo.io/@your-username/pasino-office-app',
};

// Fonction pour obtenir le bon client ID selon la plateforme
export const getClientId = () => {
  if (__DEV__) {
    // En développement, utilisez l'ID Expo
    return AUTH_CONFIG.EXPO_CLIENT_ID;
  }
  
  // En production, utilisez l'ID spécifique à la plateforme
  if (Platform.OS === 'ios') {
    return AUTH_CONFIG.IOS_CLIENT_ID;
  } else {
    return AUTH_CONFIG.ANDROID_CLIENT_ID;
  }
};

// Fonction pour décoder le id_token Azure AD
export function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

// SUPPRIMER le bloc global qui commence par :
// if (result?.params?.id_token) { ... }
// Il ne doit pas être en dehors d'une fonction !
