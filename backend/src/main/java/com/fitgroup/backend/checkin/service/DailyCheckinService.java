package com.fitgroup.backend.checkin.service;

import com.fitgroup.backend.badges.service.BadgeAwardService;
import com.fitgroup.backend.challenge.entity.ChallengeParticipant;
import com.fitgroup.backend.challenge.repository.ChallengeParticipantRepository;
import com.fitgroup.backend.checkin.dto.CheckinCalendarDayResponse;
import com.fitgroup.backend.checkin.dto.DailyCheckinRequest;
import com.fitgroup.backend.checkin.entity.DailyCheckin;
import com.fitgroup.backend.checkin.repository.DailyCheckinAggregate;
import com.fitgroup.backend.checkin.repository.DailyCheckinRepository;
import com.fitgroup.backend.user.entity.User;
import com.fitgroup.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DailyCheckinService {

    private final DailyCheckinRepository checkinRepo;
    private final UserRepository userRepo;
    private final BadgeAwardService badgeAwardService;
    private final ChallengeParticipantRepository challengeParticipantRepository; // ✅ Inject Repo

    public DailyCheckin checkIn(Long userId, DailyCheckinRequest req) {
        LocalDate today = LocalDate.now();

        // ✅ HANDLE CHALLENGE CHECK-IN
        if (req.getChallengeId() != null) {
            return performChallengeCheckin(userId, req, today);
        }

        return performGeneralCheckin(userId, req, today);
    }

    private DailyCheckin performGeneralCheckin(Long userId, DailyCheckinRequest req, LocalDate today) {
        User user = userRepo.findById(userId).orElseThrow();
        updateStreak(user, today);
        user.setLastCheckInDate(today);

        int points = 10;
        if (req.getDistance() != null) points += (int) (req.getDistance() * 2);

        DailyCheckin checkin = createCheckinEntity(userId, null, req, today, points);
        DailyCheckin saved = checkinRepo.save(checkin);

        user.setTotalPoints(user.getTotalPoints() + points);
        userRepo.save(user);
        badgeAwardService.evaluateBadges(user);

        return saved;
    }

    private DailyCheckin performChallengeCheckin(Long userId, DailyCheckinRequest req, LocalDate today) {
        // 1. Verify User is in this Challenge
        ChallengeParticipant participant = challengeParticipantRepository
                .findByChallengeIdAndUserId(req.getChallengeId(), userId)
                .orElseThrow(() -> new RuntimeException("User is not a participant of this challenge"));

        // 2. Calculate Points
        int points = 20;
        if (req.getDistance() != null) points += (int) (req.getDistance() * 5);

        // 3. Save Check-in
        DailyCheckin checkin = createCheckinEntity(userId, req.getChallengeId(), req, today, points);
        DailyCheckin saved = checkinRepo.save(checkin);

        // 4. Update Participant Stats (Fixes 0% progress)
        participant.setTotalPoints(participant.getTotalPoints() + points);
        participant.setCurrentStreak(participant.getCurrentStreak() + 1);
        challengeParticipantRepository.save(participant);

        // 5. Also update Global User Stats
        User user = userRepo.findById(userId).orElseThrow();
        updateStreak(user, today);
        user.setLastCheckInDate(today);
        user.setTotalPoints(user.getTotalPoints() + points);
        userRepo.save(user);

        badgeAwardService.evaluateBadges(user);

        return saved;
    }

    // Helper to create entity
    private DailyCheckin createCheckinEntity(Long userId, Long challengeId, DailyCheckinRequest req, LocalDate today, int points) {
        return DailyCheckin.builder()
                .userId(userId)
                .challengeId(challengeId)
                .checkinDate(today)
                .distance(req.getDistance() != null ? req.getDistance() : 0.0)
                .timeMinutes(req.getTime())
                .notes(req.getNotes())
                .pointsEarned(points)
                .createdAt(LocalDateTime.now())
                .build();
    }

    private void updateStreak(User user, LocalDate today) {
        LocalDate lastDate = user.getLastCheckInDate();
        if (lastDate != null) {
            if (!lastDate.equals(today)) {
                if (lastDate.equals(today.minusDays(1))) {
                    user.setCurrentStreak((user.getCurrentStreak() == null ? 0 : user.getCurrentStreak()) + 1);
                } else {
                    user.setCurrentStreak(1);
                }
            }
        } else {
            user.setCurrentStreak(1);
        }
    }

    public List<CheckinCalendarDayResponse> getCalendar(Long userId, int days) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(days - 1);
        List<DailyCheckinAggregate> aggregates = checkinRepo.findCalendarData(userId, startDate);
        Map<LocalDate, DailyCheckinAggregate> map = aggregates.stream()
                .collect(Collectors.toMap(DailyCheckinAggregate::getCheckinDate, a -> a));
        List<CheckinCalendarDayResponse> result = new ArrayList<>();
        for (int i = 0; i < days; i++) {
            LocalDate date = startDate.plusDays(i);
            if (map.containsKey(date)) {
                DailyCheckinAggregate a = map.get(date);
                result.add(CheckinCalendarDayResponse.builder()
                        .date(date).checkedIn(true)
                        .totalPoints(a.getTotalPoints()).build());
            } else {
                result.add(CheckinCalendarDayResponse.builder()
                        .date(date).checkedIn(false).totalPoints(0).build());
            }
        }
        return result;
    }

    public List<DailyCheckin> getRecentCheckins(Long userId) {
        return checkinRepo.findTop10ByUserIdOrderByCheckinDateDesc(userId);
    }
}