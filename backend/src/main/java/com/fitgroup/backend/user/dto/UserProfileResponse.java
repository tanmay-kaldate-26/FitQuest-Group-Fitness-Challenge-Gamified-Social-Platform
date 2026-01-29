package com.fitgroup.backend.user.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class UserProfileResponse {
    private Long id;
    private String fullName;
    private String email;
    private String bio;
    private LocalDateTime joinedAt;
    private int totalPoints;
    private int currentStreak;
    private int challengesCompleted;
    private int totalChallenges;
    private int daysActive;
}