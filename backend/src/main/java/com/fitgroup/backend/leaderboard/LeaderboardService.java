package com.fitgroup.backend.leaderboard;

import com.fitgroup.backend.user.entity.User;
import com.fitgroup.backend.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LeaderboardService {

    @Autowired
    private UserRepository userRepository;

    public List<LeaderboardEntry> getGlobalLeaderboard(String currentUserEmail) {
        // 1. Fetch all users sorted by Points (Highest first)
        List<User> users = userRepository.findAll(Sort.by(Sort.Direction.DESC, "totalPoints"));
        List<LeaderboardEntry> leaderboard = new ArrayList<>();

        // 2. Loop through and assign ranks
        for (int i = 0; i < users.size(); i++) {
            User u = users.get(i);
            int rank = i + 1;

            // Check if this row is the logged-in user
            boolean isMe = u.getEmail().equals(currentUserEmail);

            // Create Entry
            // Note: weeklyGain is mocked as 10% of total points for demo purposes
            leaderboard.add(new LeaderboardEntry(
                    u.getId(),
                    u.getFullName(),
                    rank,
                    u.getTotalPoints(),
                    u.getCurrentStreak(),
                    u.getTotalPoints() / 10,
                    isMe
            ));
        }

        return leaderboard;
    }
}