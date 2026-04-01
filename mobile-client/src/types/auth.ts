/**
 * Auth types — must stay in sync with Java records in com.sporttracker.api.auth
 * camelCase mirrors the JSON serialization of the backend POJOs.
 */

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  userId: string;
  displayName: string;
  email: string;
}

/** RFC 7807 Problem Details — mirrors GlobalExceptionHandler responses */
export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail: string;
  violations?: string[];
}
