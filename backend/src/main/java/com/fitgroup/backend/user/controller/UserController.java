package com.fitgroup.backend.user.controller;

import com.fitgroup.backend.user.dto.ChangePasswordRequest;
import com.fitgroup.backend.user.dto.UpdateProfileRequest;
import com.fitgroup.backend.user.dto.UserProfileResponse;
import com.fitgroup.backend.user.entity.User; // Ensure this imports from .entity.User
import com.fitgroup.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private User getCurrentUser(Principal principal) {
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // 1. GET PROFILE
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getMyProfile(Principal principal) {
        User user = getCurrentUser(principal);

        return ResponseEntity.ok(UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .bio(user.getBio())
                .joinedAt(user.getJoinedAt())
                .totalPoints(user.getTotalPoints() != null ? user.getTotalPoints() : 0)
                .currentStreak(user.getCurrentStreak() != null ? user.getCurrentStreak() : 0)
                .build());
    }

    // 2. UPDATE PROFILE
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest request, Principal principal) {
        User user = getCurrentUser(principal);

        if (request.getFullName() != null && !request.getFullName().isEmpty()) {
            user.setFullName(request.getFullName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }

        userRepository.save(user);
        return ResponseEntity.ok("Profile updated successfully");
    }

    // 3. CHANGE PASSWORD
    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request, Principal principal) {
        User user = getCurrentUser(principal);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Incorrect current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("Password updated successfully");
    }

    // 4. GET ALL USERS (For Create Chat)
    @GetMapping
    public ResponseEntity<List<UserProfileResponse>> getAllUsers(Principal principal) {
        String myEmail = principal.getName();
        List<UserProfileResponse> users = userRepository.findAll().stream()
                .filter(u -> !u.getEmail().equals(myEmail))
                .map(u -> UserProfileResponse.builder()
                        .id(u.getId())
                        .fullName(u.getFullName())
                        .email(u.getEmail())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }
}