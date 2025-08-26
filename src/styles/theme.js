// Styles globaux et thème de l'application PASINO Office
export const colors = {
  primary: '#4285f4',
  success: '#34a853',
  warning: '#fbbc04',
  error: '#ea4335',
  
  // Couleurs de texte
  textPrimary: '#333',
  textSecondary: '#666',
  textMuted: '#999',
  
  // Couleurs de background
  background: '#f5f5f5',
  surface: '#fff',
  
  // Couleurs des bordures
  border: '#e0e0e0',
  borderLight: '#f0f0f0',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  body: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  bodySmall: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    color: colors.textMuted,
  },
};

export const shadows = {
  small: {
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  medium: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  large: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
};

export const borderRadius = {
  small: 6,
  medium: 8,
  large: 12,
  xlarge: 16,
  round: 24,
};
