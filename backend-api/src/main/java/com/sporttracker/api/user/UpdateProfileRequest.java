package com.sporttracker.api.user;

import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @Size(min = 1, max = 100, message = "Display name must be between 1 and 100 characters")
        String displayName,

        @Size(max = 500, message = "Bio must be 500 characters or fewer")
        String bio,

        @Size(max = 512, message = "Profile picture URL must be 512 characters or fewer")
        String profilePicture
) {}
