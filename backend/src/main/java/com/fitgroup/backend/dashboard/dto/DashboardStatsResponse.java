package com.fitgroup.backend.dashboard.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class DashboardStatsResponse {
    private int totalPoints;
    private int streak;
    private int activeChallengesCount;
    private long globalRank;

    // List of Badge CODES (e.g., "FIRST_CHECKIN") not names
    private List<String> badges;

    private List<DashboardChallengeDto> activeChallenges;
    private List<DashboardChallengeDto> completedChallenges;

    @Data
    @Builder
    public static class DashboardChallengeDto {
        private Long id;
        private String name; // Changed from title to name
        private int daysLeft;
        private int participants;
        private int progress; // 0-100
    }
}