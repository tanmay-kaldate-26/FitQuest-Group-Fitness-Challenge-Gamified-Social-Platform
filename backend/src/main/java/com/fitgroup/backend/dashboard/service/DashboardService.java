package com.fitgroup.backend.dashboard.service;

import com.fitgroup.backend.badges.entity.Badge;
import com.fitgroup.backend.badges.repository.BadgeRepository;
import com.fitgroup.backend.badges.repository.UserBadgeRepository;
import com.fitgroup.backend.challenge.entity.Challenge;
import com.fitgroup.backend.challenge.repository.ChallengeParticipantRepository;
import com.fitgroup.backend.challenge.repository.ChallengeRepository;
import com.fitgroup.backend.dashboard.dto.DashboardStatsResponse;
import com.fitgroup.backend.dashboard.dto.DashboardStatsResponse.DashboardChallengeDto;
import com.fitgroup.backend.user.entity.User;
import com.fitgroup.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final ChallengeParticipantRepository participantRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final BadgeRepository badgeRepository;
    private final ChallengeRepository challengeRepository;

    public DashboardStatsResponse getUserStats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Calculate Rank
        long rank = userRepository.countByTotalPointsGreaterThan(user.getTotalPoints()) + 1;

        // 2. Get Badges
        List<String> badgeCodes = userBadgeRepository.findByUserId(userId).stream()
                .map(ub -> badgeRepository.findById(ub.getBadgeId())
                        .map(Badge::getCode)
                        .orElse("UNKNOWN"))
                .collect(Collectors.toList());

        // 3. Get Active & Completed Challenges
        List<DashboardChallengeDto> activeList = new ArrayList<>();
        List<DashboardChallengeDto> completedList = new ArrayList<>();

        participantRepository.findByUserId(userId).forEach(p -> {
            Long challengeId = p.getChallengeId();
            Optional<Challenge> challengeOpt = challengeRepository.findById(challengeId);

            if (challengeOpt.isPresent()) {
                Challenge c = challengeOpt.get();

                // Calculate Days Left
                long daysBetween = ChronoUnit.DAYS.between(LocalDate.now(), c.getEndDate());
                int daysLeft = (int) Math.max(0, daysBetween);

                // ✅ NEW LOGIC: Calculate Progress based on User Points vs Target Points
                // (Target = ~50 points per day for the challenge duration)
                long duration = ChronoUnit.DAYS.between(c.getStartDate(), c.getEndDate());
                if (duration < 1) duration = 1;

                long targetPoints = duration * 50;
                int userPoints = p.getTotalPoints(); // Get points from the participant record

                // Calculate % (Max 100%)
                int progressPercent = (int) Math.min(100, (userPoints * 100.0) / targetPoints);

                // Map to DTO
                DashboardChallengeDto dto = DashboardChallengeDto.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .participants(participantRepository.countByChallengeId(c.getId()))
                        .daysLeft(daysLeft)
                        .progress(progressPercent) // ✅ SEND CORRECT %
                        .build();

                if (c.getEndDate().isAfter(LocalDate.now()) && c.getIsActive()) {
                    activeList.add(dto);
                } else {
                    completedList.add(dto);
                }
            }
        });

        return DashboardStatsResponse.builder()
                .totalPoints(user.getTotalPoints())
                .streak(user.getCurrentStreak() != null ? user.getCurrentStreak() : 0)
                .globalRank(rank)
                .activeChallengesCount(activeList.size())
                .badges(badgeCodes)
                .activeChallenges(activeList)
                .completedChallenges(completedList)
                .build();
    }
}