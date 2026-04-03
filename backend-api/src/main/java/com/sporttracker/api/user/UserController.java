package com.sporttracker.api.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Tag(name = "User Profile")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Get the authenticated user's profile")
    @GetMapping("/me")
    public UserResponse getMyProfile(Authentication authentication) {
        return userService.getProfile(UUID.fromString(authentication.getName()));
    }

    @Operation(summary = "Update the authenticated user's profile")
    @PatchMapping("/me")
    public UserResponse updateMyProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        return userService.updateProfile(UUID.fromString(authentication.getName()), request);
    }
}
