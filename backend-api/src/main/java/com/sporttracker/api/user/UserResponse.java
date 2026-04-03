package com.sporttracker.api.user;

import com.sporttracker.api.auth.UserEntity;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID userId,
        String email,
        String displayName,
        String bio,
        String profilePicture,
        Instant createdAt
) {
    public UserResponse(UserEntity user) {
        this(
                user.getId(),
                user.getEmail(),
                user.getDisplayName(),
                user.getBio(),
                user.getProfilePicture(),
                user.getCreatedAt()
        );
    }
}
