package com.fitgroup.backend.challenge.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ChallengeParticipantResponse {
    private Long userId;
    private String fullName;
    private LocalDateTime joinedAt;
    private int totalPoints;
    private int currentStreak;
}