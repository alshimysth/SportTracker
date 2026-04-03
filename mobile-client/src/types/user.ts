/** Mirrors UserResponse Java record */
export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  bio: string | null;
  profilePicture: string | null;
  createdAt: string;
}

/** Mirrors UpdateProfileRequest Java record — all fields optional (PATCH semantics) */
export interface UpdateProfileRequest {
  displayName?: string;
  bio?: string;
  profilePicture?: string;
}
