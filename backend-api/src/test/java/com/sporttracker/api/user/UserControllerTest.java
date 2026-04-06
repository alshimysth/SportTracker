package com.sporttracker.api.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sporttracker.api.common.GlobalExceptionHandler;
import com.sporttracker.api.common.ResourceNotFoundException;
import com.sporttracker.api.config.JwtAuthFilter;
import com.sporttracker.api.config.SecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@Import({SecurityConfig.class, JwtAuthFilter.class, GlobalExceptionHandler.class})
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserService userService;

    // JwtAuthFilter is imported (real bean) — mock only JwtService so it can be constructed
    @MockitoBean
    private com.sporttracker.api.auth.JwtService jwtService;

    private final UUID userId = UUID.randomUUID();

    private UserResponse sampleResponse() {
        return new UserResponse(userId, "athlete@example.com", "Athlete One",
                "Climber & runner", null, Instant.now());
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    void getMyProfile_authenticated_returns200() throws Exception {
        UUID authId = UUID.fromString("00000000-0000-0000-0000-000000000001");
        when(userService.getProfile(authId)).thenReturn(sampleResponse());

        mockMvc.perform(get("/api/v1/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("athlete@example.com"))
                .andExpect(jsonPath("$.displayName").value("Athlete One"));
    }

    @Test
    void getMyProfile_unauthenticated_returns403() throws Exception {
        mockMvc.perform(get("/api/v1/users/me"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    void updateMyProfile_validRequest_returns200() throws Exception {
        UUID authId = UUID.fromString("00000000-0000-0000-0000-000000000001");
        UpdateProfileRequest request = new UpdateProfileRequest("New Name", "New bio", null);

        when(userService.updateProfile(eq(authId), any())).thenReturn(
                new UserResponse(authId, "athlete@example.com", "New Name", "New bio", null, Instant.now()));

        mockMvc.perform(patch("/api/v1/users/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.displayName").value("New Name"))
                .andExpect(jsonPath("$.bio").value("New bio"));
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    void updateMyProfile_blankDisplayName_returns400() throws Exception {
        UpdateProfileRequest request = new UpdateProfileRequest("", null, null);

        mockMvc.perform(patch("/api/v1/users/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.violations").isArray());
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    void getMyProfile_serviceThrows404_returns404ProblemDetail() throws Exception {
        UUID authId = UUID.fromString("00000000-0000-0000-0000-000000000001");
        when(userService.getProfile(authId)).thenThrow(new ResourceNotFoundException("User not found"));

        mockMvc.perform(get("/api/v1/users/me"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.title").value("Not Found"));
    }

    // ── Delete account tests ──────────────────────────────────────────────────

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    void deleteMyAccount_authenticated_returns204() throws Exception {
        mockMvc.perform(delete("/api/v1/users/me"))
                .andExpect(status().isNoContent());

        verify(userService).deleteAccount(UUID.fromString("00000000-0000-0000-0000-000000000001"));
    }

    @Test
    void deleteMyAccount_unauthenticated_returns403() throws Exception {
        mockMvc.perform(delete("/api/v1/users/me"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "00000000-0000-0000-0000-000000000001")
    void deleteMyAccount_unknownUser_returns404ProblemDetail() throws Exception {
        UUID authId = UUID.fromString("00000000-0000-0000-0000-000000000001");
        doThrow(new ResourceNotFoundException("User not found"))
                .when(userService).deleteAccount(authId);

        mockMvc.perform(delete("/api/v1/users/me"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.title").value("Not Found"));
    }
}
