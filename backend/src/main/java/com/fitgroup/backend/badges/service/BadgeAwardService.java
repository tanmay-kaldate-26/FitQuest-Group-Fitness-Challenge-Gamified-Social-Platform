package com.fitgroup.backend.badges.service;

import com.fitgroup.backend.badges.dto.UserBadgeResponse;
import com.fitgroup.backend.badges.entity.Badge;
import com.fitgroup.backend.badges.entity.UserBadge;
import com.fitgroup.backend.badges.repository.BadgeRepository;
import com.fitgroup.backend.badges.repository.UserBadgeRepository;
import com.fitgroup.backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BadgeAwardService {

    private final BadgeRepository badgeRepo;
    private final UserBadgeRepository userBadgeRepo;

    // ✅ NEW METHOD: Checks conditions and calls awardBadge if met
    // ✅ 1. AUTOMATIC BADGES (Checked every time a user Checks In)
    public void evaluateBadges(User user) {
        // --- A. First Check-in ---
        if (user.getTotalPoints() > 0) {
            awardBadge(user.getId(), "FIRST_CHECKIN", null);
        }

        // --- B. Streak Badges ---
        int streak = user.getCurrentStreak() != null ? user.getCurrentStreak() : 0;

        if (streak >= 3) {
            awardBadge(user.getId(), "STREAK_3_DAYS", null);
        }
        if (streak >= 7) {
            awardBadge(user.getId(), "STREAK_7_DAYS", null);
        }
        if (streak >= 30) {
            awardBadge(user.getId(), "STREAK_30_DAYS", null);
        }

        // --- C. Early Bird (Checked in before 8 AM) ---
        // Since this method runs right after check-in, we check the current time
        LocalTime now = LocalTime.now();
        if (now.isBefore(LocalTime.of(8, 0))) {
            awardBadge(user.getId(), "EARLY_BIRD", null);
        }
    }

    // ✅ 2. MANUAL BADGES (Call these from other Services)

    // Call this in ChallengeService.createChallenge()
    public void awardCreatorBadge(Long userId) {
        awardBadge(userId, "CHALLENGE_CREATOR", null);
    }

    // Call this in ChallengeService when a user completes a goal
    public void awardFinisherBadge(Long userId, Long challengeId) {
        awardBadge(userId, "CHALLENGE_FINISHER", challengeId);
    }

    // Call this in LeaderboardService/ChallengeService when a challenge ends
    public void awardTopPerformerBadge(Long userId, Long challengeId) {
        awardBadge(userId, "TOP_PERFORMER", challengeId);
    }

    // Existing method: Award badge safely (no duplicates)
    public void awardBadge(Long userId, String badgeCode, Long sourceChallengeId) {
        // Find badge definition
        Badge badge = badgeRepo.findByCode(badgeCode)
                .orElse(null); // Return null if badge code doesn't exist in DB yet

        if (badge == null) return; // Skip if badge not found in DB

        // Check if user already has it
        boolean alreadyEarned = userBadgeRepo.existsByUserIdAndBadgeId(userId, badge.getId());
        if (alreadyEarned) return;

        // Give Badge
        UserBadge userBadge = UserBadge.builder()
                .userId(userId)
                .badgeId(badge.getId())
                .sourceChallengeId(sourceChallengeId)
                .awardedAt(LocalDateTime.now())
                .build();

        userBadgeRepo.save(userBadge);
    }

    public List<UserBadgeResponse> getUserBadgeDetails(Long userId) {
        return userBadgeRepo.findByUserId(userId).stream().map(ub -> {
            Badge badge = badgeRepo.findById(ub.getBadgeId())
                    .orElseThrow(() -> new RuntimeException("Badge not found"));

            return UserBadgeResponse.builder()
                    .badgeId(badge.getId())
                    .name(badge.getName())
                    .code(badge.getCode())
                    .description(badge.getDescription())
                    .iconUrl(badge.getIconUrl())
                    .badgeType(badge.getBadgeType() != null ? badge.getBadgeType().name() : "ACHIEVEMENT")
                    .awardedAt(ub.getAwardedAt())
                    .sourceChallengeId(ub.getSourceChallengeId())
                    .build();
        }).toList();
    }

    public List<UserBadge> getUserBadges(Long userId) {
        return userBadgeRepo.findByUserId(userId);
    }

    public List<Badge> getAllBadges() {
        return badgeRepo.findAll();
    }
}