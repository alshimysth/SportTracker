package com.sporttracker.api.auth;

import com.sporttracker.api.common.EmailAlreadyUsedException;
import com.sporttracker.api.common.InvalidCredentialsException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest validRequest;

    @BeforeEach
    void setUp() {
        validRequest = new RegisterRequest("user@example.com", "password123", "Athlete One");
    }

    @Test
    void register_withNewEmail_returnsAuthResponse() {
        // Arrange
        when(userRepository.existsByEmail(validRequest.email())).thenReturn(false);

        UserEntity saved = new UserEntity();
        saved.setEmail(validRequest.email());
        saved.setDisplayName(validRequest.displayName());

        when(passwordEncoder.encode(validRequest.password())).thenReturn("hashed");
        when(userRepository.save(any(UserEntity.class))).thenReturn(saved);
        when(jwtService.generateToken(saved)).thenReturn("jwt-token");

        // Act
        AuthResponse response = authService.register(validRequest);

        // Assert
        assertThat(response.accessToken()).isEqualTo("jwt-token");
        assertThat(response.tokenType()).isEqualTo("Bearer");
        assertThat(response.email()).isEqualTo(validRequest.email());
        verify(userRepository).save(any(UserEntity.class));
    }

    @Test
    void register_withExistingEmail_throwsEmailAlreadyUsedException() {
        // Arrange
        when(userRepository.existsByEmail(validRequest.email())).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> authService.register(validRequest))
                .isInstanceOf(EmailAlreadyUsedException.class)
                .hasMessageContaining(validRequest.email());

        verify(userRepository, never()).save(any());
    }

    @Test
    void register_encodesPasswordBeforeSaving() {
        // Arrange
        when(userRepository.existsByEmail(any())).thenReturn(false);

        UserEntity saved = new UserEntity();
        saved.setEmail(validRequest.email());
        saved.setDisplayName(validRequest.displayName());

        when(passwordEncoder.encode(validRequest.password())).thenReturn("bcrypt-hash");
        when(userRepository.save(any(UserEntity.class))).thenAnswer(inv -> {
            UserEntity u = inv.getArgument(0);
            assertThat(u.getPasswordHash()).isEqualTo("bcrypt-hash");
            return saved;
        });
        when(jwtService.generateToken(any())).thenReturn("token");

        // Act
        authService.register(validRequest);

        // Assert — verify raw password was never stored
        verify(passwordEncoder).encode(validRequest.password());
    }

    // ── Login tests ───────────────────────────────────────────────────────────

    @Test
    void login_withValidCredentials_returnsAuthResponse() {
        // Arrange
        LoginRequest request = new LoginRequest("user@example.com", "password123");

        UserEntity user = new UserEntity();
        user.setEmail("user@example.com");
        user.setDisplayName("Athlete One");
        user.setEnabled(true);
        user.setPasswordHash("hashed");

        when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(request.password(), "hashed")).thenReturn(true);
        when(jwtService.generateToken(user)).thenReturn("jwt-token");

        // Act
        AuthResponse response = authService.login(request);

        // Assert
        assertThat(response.accessToken()).isEqualTo("jwt-token");
        assertThat(response.tokenType()).isEqualTo("Bearer");
        assertThat(response.email()).isEqualTo("user@example.com");
    }

    @Test
    void login_withUnknownEmail_throwsInvalidCredentialsException() {
        // Arrange
        LoginRequest request = new LoginRequest("ghost@example.com", "password123");
        when(userRepository.findByEmail(request.email())).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(InvalidCredentialsException.class);
        verify(passwordEncoder, never()).matches(any(), any());
    }

    @Test
    void login_withWrongPassword_throwsInvalidCredentialsException() {
        // Arrange
        LoginRequest request = new LoginRequest("user@example.com", "wrong");

        UserEntity user = new UserEntity();
        user.setEmail("user@example.com");
        user.setEnabled(true);
        user.setPasswordHash("hashed");

        when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(request.password(), "hashed")).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(InvalidCredentialsException.class);
        verify(jwtService, never()).generateToken(any());
    }

    @Test
    void login_withDisabledAccount_throwsInvalidCredentialsException() {
        // Arrange
        LoginRequest request = new LoginRequest("disabled@example.com", "password123");

        UserEntity user = new UserEntity();
        user.setEmail("disabled@example.com");
        user.setEnabled(false);
        user.setPasswordHash("hashed");

        when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(user));

        // Act & Assert
        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(InvalidCredentialsException.class);
        verify(passwordEncoder, never()).matches(any(), any());
    }
}
