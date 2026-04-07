package com.sporttracker.api.user;

import com.sporttracker.api.auth.UserEntity;
import com.sporttracker.api.auth.UserRepository;
import com.sporttracker.api.common.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private UUID userId;
    private UserEntity user;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        user = new UserEntity();
        user.setEmail("athlete@example.com");
        user.setDisplayName("Athlete One");
        user.setBio("Climber & runner");
    }

    @Test
    void getProfile_withValidId_returnsUserResponse() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        UserResponse response = userService.getProfile(userId);

        assertThat(response.email()).isEqualTo("athlete@example.com");
        assertThat(response.displayName()).isEqualTo("Athlete One");
        assertThat(response.bio()).isEqualTo("Climber & runner");
    }

    @Test
    void getProfile_withUnknownId_throwsResourceNotFoundException() {
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getProfile(userId))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void updateProfile_updatesOnlyProvidedFields() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        UpdateProfileRequest request = new UpdateProfileRequest("New Name", null, null);
        UserResponse response = userService.updateProfile(userId, request);

        assertThat(response.displayName()).isEqualTo("New Name");
        assertThat(response.bio()).isEqualTo("Climber & runner"); // unchanged
    }

    @Test
    void updateProfile_updatesAllFields() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        UpdateProfileRequest request = new UpdateProfileRequest("New Name", "New bio", "https://example.com/pic.jpg");
        UserResponse response = userService.updateProfile(userId, request);

        assertThat(response.displayName()).isEqualTo("New Name");
        assertThat(response.bio()).isEqualTo("New bio");
        assertThat(response.profilePicture()).isEqualTo("https://example.com/pic.jpg");
    }

    @Test
    void updateProfile_withUnknownId_throwsResourceNotFoundException() {
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.updateProfile(userId, new UpdateProfileRequest("X", null, null)))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(userRepository, never()).save(any());
    }

    // ── deleteAccount tests ───────────────────────────────────────────────────

    @Test
    void deleteAccount_withValidId_deletesUser() {
        when(userRepository.existsById(userId)).thenReturn(true);

        userService.deleteAccount(userId);

        verify(userRepository).deleteById(userId);
    }

    @Test
    void deleteAccount_withUnknownId_throwsResourceNotFoundException() {
        when(userRepository.existsById(userId)).thenReturn(false);

        assertThatThrownBy(() -> userService.deleteAccount(userId))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(userRepository, never()).deleteById(any());
    }
}
