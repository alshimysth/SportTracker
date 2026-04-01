package com.sporttracker.api.auth;

import java.util.UUID;

public record AuthResponse(
        String accessToken,
        String tokenType,
        UUID userId,
        String displayName,
        String email
) {
    public AuthResponse(String accessToken, UserEntity user) {
        this(accessToken, "Bearer", user.getId(), user.getDisplayName(), user.getEmail());
    }
}
