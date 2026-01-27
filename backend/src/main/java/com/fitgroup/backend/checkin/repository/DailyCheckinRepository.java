package com.fitgroup.backend.checkin.repository;

import com.fitgroup.backend.checkin.entity.DailyCheckin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyCheckinRepository extends JpaRepository<DailyCheckin, Long> {

    // 1. Core Finders
    Optional<DailyCheckin> findByChallengeIdAndUserIdAndCheckinDate(
            Long challengeId, Long userId, LocalDate checkinDate
    );

    Optional<DailyCheckin> findByUserIdAndCheckinDate(Long userId, LocalDate checkinDate);

    long countByUserId(Long userId);

    // ----------------------------------------------------------------
    // SECTION 1: METHODS FOR DASHBOARD (Restored!)
    // ----------------------------------------------------------------

    // Used by DashboardService to show Total Points
    @Query("SELECT COALESCE(SUM(d.pointsEarned), 0) FROM DailyCheckin d WHERE d.userId = :userId")
    Integer calculateTotalPoints(@Param("userId") Long userId);

    // Used by DashboardService to calculate Streak
    @Query("SELECT DISTINCT d.checkinDate FROM DailyCheckin d WHERE d.userId = :userId ORDER BY d.checkinDate DESC")
    List<LocalDate> findCheckinDates(@Param("userId") Long userId);

    // ----------------------------------------------------------------
    // SECTION 2: METHODS FOR CHECK-IN & CHALLENGES
    // ----------------------------------------------------------------

    // Used by ChallengeService
    @Query("""
    SELECT 
        d.checkinDate,
        COALESCE(SUM(d.distance), 0), 
        SUM(d.pointsEarned)
    FROM DailyCheckin d
    WHERE d.challengeId = :challengeId
    AND d.userId = :userId
    GROUP BY d.checkinDate
    ORDER BY d.checkinDate
    """)
    List<Object[]> getDailyProgress(@Param("challengeId") Long challengeId, @Param("userId") Long userId);

    // Used by DailyCheckinService for Calendar
    @Query("""
    SELECT
        d.checkinDate AS checkinDate,
        SUM(d.pointsEarned) AS totalPoints,
        0 AS totalValue 
    FROM DailyCheckin d
    WHERE d.userId = :userId
    AND d.checkinDate >= :startDate
    GROUP BY d.checkinDate
    """)
    List<DailyCheckinAggregate> findCalendarData(@Param("userId") Long userId, @Param("startDate") LocalDate startDate);

    List<DailyCheckin> findTop10ByUserIdOrderByCheckinDateDesc(Long userId);
}