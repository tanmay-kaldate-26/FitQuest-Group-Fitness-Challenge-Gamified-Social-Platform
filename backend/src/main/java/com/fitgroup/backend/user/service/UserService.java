package com.fitgroup.backend.user.service;

import com.fitgroup.backend.user.dto.RegisterRequest;
import com.fitgroup.backend.user.entity.User;
import com.fitgroup.backend.user.repository.UserRepository;
import com.fitgroup.backend.user.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public String registerUser(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "EMAIL_ALREADY_EXISTS";
        }

        var user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")

                // --- FIX: Initialize Stats to 0 ---
                .bestStreak(0)      // Now this will work!
                .currentStreak(0)
                .totalPoints(0)
                // ----------------------------------

                .build();

        userRepository.save(user);

        return "USER_REGISTERED_SUCCESSFULLY";
    }

    // Keep your existing login methods below...
    public String loginUserAndGenerateToken(String email, String rawPassword) {
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return "USER_NOT_FOUND";
        }

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            return "INVALID_PASSWORD";
        }

        return jwtUtil.generateToken(user.getEmail());
    }

    public Long getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}