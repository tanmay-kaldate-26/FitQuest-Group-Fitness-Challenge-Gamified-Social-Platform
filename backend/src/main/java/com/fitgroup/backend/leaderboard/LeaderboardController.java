package com.fitgroup.backend.leaderboard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    @GetMapping
    public List<LeaderboardEntry> getLeaderboard() {
        // Get currently logged in user's email
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        return leaderboardService.getGlobalLeaderboard(email);
    }
}