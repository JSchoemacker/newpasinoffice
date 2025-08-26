# Guide d'authentification Azure AD pour PASINO Office

## Problème avec les comptes Azure AD

Si vous avez une adresse email `@pasino.ch` gérée par **Azure Active Directory** (Microsoft), vous pourriez rencontrer des difficultés à vous connecter directement avec Firebase.

## Solutions disponibles

### 1. 🔧 **Création d'un compte Firebase local (Recommandé)**

**Étapes :**
1. Dans l'app, cliquez sur **"Pas de compte ? S'inscrire"**
2. Entrez votre email Azure AD `@pasino.ch`
3. Créez un mot de passe pour Firebase
4. Entrez votre nom complet
5. Cliquez sur **"Créer le compte"**

**Avantages :**
- ✅ Fonctionne sur mobile et web
- ✅ Accès complet à toutes les fonctionnalités
- ✅ Synchronisation entre appareils

### 2. 🌐 **Connexion Google (Web uniquement)**

**Étapes :**
1. Ouvrez l'app dans un navigateur web
2. Cliquez sur **"Continuer avec Google"**
3. Sélectionnez votre compte Azure AD `@pasino.ch`

**Limitations :**
- ⚠️ Fonctionne uniquement sur navigateur web
- ⚠️ Pas disponible dans l'app mobile Expo

### 3. 🧪 **Mode Démo (Test uniquement)**

**Pour tester l'interface :**
1. Cliquez sur **"Connexion Démo (Test)"**
2. Explorez toutes les fonctionnalités
3. Pas de synchronisation des données

## Résolution des erreurs courantes

### ❌ "Aucun compte trouvé avec cette adresse email"
**Solution :** Créez un compte avec la méthode 1 ci-dessus

### ❌ "Mot de passe incorrect"
**Solutions :**
- Utilisez le bouton **"Mot de passe oublié ?"** pour réinitialiser
- Ou créez un nouveau compte Firebase

### ❌ "Connexion Google non disponible"
**Solution :** Utilisez la méthode 1 (création de compte Firebase)

## Pourquoi ce problème existe-t-il ?

1. **Azure AD vs Firebase :** Ce sont deux systèmes d'authentification différents
2. **Gestion des domaines :** Votre email `@pasino.ch` peut être géré par Microsoft Azure
3. **Authentification mobile :** Firebase sur mobile ne peut pas accéder directement à Azure AD

## Configuration technique (pour les administrateurs)

### Option A : Intégration Azure AD avec Firebase
```javascript
// Configuration avancée - nécessite une configuration côté serveur
// Contactez l'équipe technique pour l'implémentation
```

### Option B : Federation d'identité
```javascript
// Permet l'authentification Azure AD via SAML/OAuth
// Nécessite configuration Azure Enterprise
```

## FAQ

**Q: Mes données Azure AD seront-elles synchronisées ?**
R: Non, Firebase et Azure AD sont séparés. Vous devrez recréer votre profil.

**Q: Puis-je utiliser le même mot de passe ?**
R: Vous pouvez, mais ce n'est pas obligatoire. Firebase est indépendant.

**Q: L'app fonctionne-t-elle sans internet ?**
R: Certaines fonctionnalités fonctionnent hors ligne, mais l'authentification nécessite internet.

**Q: Mes collègues ont-ils le même problème ?**
R: Oui, tous les utilisateurs avec des comptes Azure AD doivent créer un compte Firebase.

## Support

Pour toute assistance :
1. Utilisez d'abord le **mode démo** pour tester
2. Créez un compte Firebase avec votre email `@pasino.ch`
3. Contactez l'équipe technique si les problèmes persistent

---
*Dernière mise à jour : 20 août 2025*
