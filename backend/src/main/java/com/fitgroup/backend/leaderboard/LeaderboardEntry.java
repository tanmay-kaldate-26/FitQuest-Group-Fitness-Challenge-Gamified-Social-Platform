package com.fitgroup.backend.leaderboard;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LeaderboardEntry {
    private Long id;
    private String name;
    private int rank;
    private int points;
    private int streak;
    private int weeklyGain; // We can mock this or calculate it if you have history
    private boolean isCurrentUser;
}