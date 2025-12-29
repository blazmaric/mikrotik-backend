export const COLORS = {
  background: {
    primary: '#0a1929',
    secondary: '#1a2332',
    card: 'rgba(26, 35, 50, 0.8)',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
  },
  primary: {
    main: '#00bcd4',
    light: '#4dd0e1',
    dark: '#0097a7',
  },
  secondary: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2',
  },
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.5)',
  },
  status: {
    running: '#4caf50',
    disabled: '#757575',
    down: '#f44336',
    established: '#4caf50',
    timeWait: '#ff9800',
    unreplied: '#f44336',
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
} as const;

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;
