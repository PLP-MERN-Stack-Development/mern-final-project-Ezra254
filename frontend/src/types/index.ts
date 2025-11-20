export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  preferences?: {
    weeklyGoal: number;
    measurementSystem: 'metric' | 'imperial';
    reminders: boolean;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

