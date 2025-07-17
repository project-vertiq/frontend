export interface SignupRequest {
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  password: string;
  gender: "male" | "female" | "other";
  date_of_birth: string;
}

export interface LoginRequest {
  email?: string;
  phone?: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  status: number;
}

export interface UserLogoutResponse {
  message: string;
}

export interface OidcGoogleRequest {
  idToken: string;
}

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  roles?: string[];
  // Add more fields as needed for your app
}