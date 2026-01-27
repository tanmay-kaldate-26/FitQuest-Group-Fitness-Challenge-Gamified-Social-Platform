package com.fitgroup.backend.checkin.service;

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
    private final UserRepository userRepo; // Inject User Repo

    public DailyCheckin checkIn(Long userId, DailyCheckinRequest req) {
        LocalDate today = LocalDate.now();

        // 1. General Check-in Logic (No Challenge ID)
        if (req.getChallengeId() == null) {
            return performGeneralCheckin(userId, req, today);
        }

        // ... (Keep your existing Challenge logic here if you want) ...
        throw new RuntimeException("Challenge specific check-in not implemented in this snippet");
    }

    private DailyCheckin performGeneralCheckin(Long userId, DailyCheckinRequest req, LocalDate today) {
        // A. Prevent Duplicates
        // You might need to adjust your repository to find by UserId and Date (ignoring challengeId)
        // checkinRepo.findByUserIdAndCheckinDate(...)

        // B. Calculate Points (General Rule: 10 base + 2 per km)
        int points = 10;
        if (req.getDistance() != null) {
            points += (int) (req.getDistance() * 2);
        }

        // C. Save Check-in
        DailyCheckin checkin = DailyCheckin.builder()
                .userId(userId)
                .checkinDate(today)
                .distance(req.getDistance())
                .timeMinutes(req.getTime())
                .notes(req.getNotes())
                .pointsEarned(points)
                .createdAt(LocalDateTime.now())
                .build();

        DailyCheckin saved = checkinRepo.save(checkin);

        // D. Update User Stats Directly
        User user = userRepo.findById(userId).orElseThrow();

        // Simple Streak Logic
        int currentStreak = (user.getCurrentStreak() == null ? 0 : user.getCurrentStreak());
        // (Add your complex date logic here later)
        user.setCurrentStreak(currentStreak + 1);

        int totalPoints = (user.getTotalPoints() == null ? 0 : user.getTotalPoints());
        user.setTotalPoints(totalPoints + points);

        userRepo.save(user);

        return saved;
    }

    // Keep your getCalendar method exactly as is, it's fine.
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
                        .totalPoints(a.getTotalPoints()).totalValue(0).build());
            } else {
                result.add(CheckinCalendarDayResponse.builder()
                        .date(date).checkedIn(false).totalPoints(0).totalValue(0).build());
            }
        }
        return result;
    }

    public List<DailyCheckin> getRecentCheckins(Long userId) {
        return checkinRepo.findTop10ByUserIdOrderByCheckinDateDesc(userId);
    }
}