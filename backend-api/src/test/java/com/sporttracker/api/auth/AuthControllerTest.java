package com.sporttracker.api.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sporttracker.api.common.EmailAlreadyUsedException;
import com.sporttracker.api.common.InvalidCredentialsException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.sporttracker.api.common.GlobalExceptionHandler;
import com.sporttracker.api.config.SecurityConfig;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;

    @Test
    void register_withValidRequest_returns201AndToken() throws Exception {
        RegisterRequest request = new RegisterRequest("new@example.com", "password123", "New User");

        UserEntity user = new UserEntity();
        user.setEmail("new@example.com");
        user.setDisplayName("New User");

        when(authService.register(any())).thenReturn(new AuthResponse("jwt-token", user));

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").value("jwt-token"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.email").value("new@example.com"));
    }

    @Test
    void register_withDuplicateEmail_returns409ProblemDetail() throws Exception {
        RegisterRequest request = new RegisterRequest("taken@example.com", "password123", "User");

        when(authService.register(any())).thenThrow(new EmailAlreadyUsedException("taken@example.com"));

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.title").value("Email Already In Use"))
                .andExpect(jsonPath("$.status").value(409));
    }

    @Test
    void register_withInvalidEmail_returns400WithViolations() throws Exception {
        RegisterRequest request = new RegisterRequest("not-an-email", "password123", "User");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Validation Failed"))
                .andExpect(jsonPath("$.violations").isArray());
    }

    @Test
    void register_withShortPassword_returns400WithViolations() throws Exception {
        RegisterRequest request = new RegisterRequest("user@example.com", "short", "User");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.violations").isArray());
    }

    // ── Login tests ───────────────────────────────────────────────────────────

    @Test
    void login_withValidCredentials_returns200AndToken() throws Exception {
        LoginRequest request = new LoginRequest("user@example.com", "password123");

        UserEntity user = new UserEntity();
        user.setEmail("user@example.com");
        user.setDisplayName("Athlete One");

        when(authService.login(any())).thenReturn(new AuthResponse("jwt-token", user));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("jwt-token"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.email").value("user@example.com"));
    }

    @Test
    void login_withBadCredentials_returns401ProblemDetail() throws Exception {
        LoginRequest request = new LoginRequest("user@example.com", "wrong");

        when(authService.login(any())).thenThrow(new InvalidCredentialsException());

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.title").value("Invalid Credentials"))
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void login_withMissingFields_returns400WithViolations() throws Exception {
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.violations").isArray());
    }
}
