package com.fitgroup.backend.user.service;

import com.fitgroup.backend.challenge.entity.ChallengeParticipant;
import com.fitgroup.backend.challenge.repository.ChallengeParticipantRepository;
import com.fitgroup.backend.checkin.repository.DailyCheckinRepository;
import com.fitgroup.backend.user.dto.RegisterRequest;
import com.fitgroup.backend.user.dto.UserProfileResponse;
import com.fitgroup.backend.user.entity.User;
import com.fitgroup.backend.user.repository.UserRepository;
import com.fitgroup.backend.user.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final ChallengeParticipantRepository participantRepository;
    private final DailyCheckinRepository checkinRepository;

    public String registerUser(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "EMAIL_ALREADY_EXISTS";
        }

        var user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .bestStreak(0)
                .currentStreak(0)
                .totalPoints(0)
                .build();

        userRepository.save(user);

        return "USER_REGISTERED_SUCCESSFULLY";
    }

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

    public UserProfileResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));


        List<ChallengeParticipant> joinedChallenges = participantRepository.findByUserId(userId);
        int totalChallenges = joinedChallenges.size();

        return UserProfileResponse.builder()
                .fullName(user.getFullName())
                .email(user.getEmail())
                .totalPoints(user.getTotalPoints())
                .currentStreak(user.getCurrentStreak() != null ? user.getCurrentStreak() : 0)
                .totalChallenges(totalChallenges) // Sends the count (e.g., 2)
                .daysActive(user.getDaysActive())
                .bio(user.getBio())
                .joinedAt(user.getJoinedAt())
                .build();
    }
}