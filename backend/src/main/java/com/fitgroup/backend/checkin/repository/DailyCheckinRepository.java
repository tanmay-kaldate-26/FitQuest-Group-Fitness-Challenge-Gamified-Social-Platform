package com.fitgroup.backend.checkin.repository;

import com.fitgroup.backend.checkin.entity.DailyCheckin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyCheckinRepository extends JpaRepository<DailyCheckin, Long> {

    Optional<DailyCheckin> findByChallengeIdAndUserIdAndCheckinDate(
            Long challengeId, Long userId, LocalDate checkinDate
    );

    Optional<DailyCheckin> findByUserIdAndCheckinDate(Long userId, LocalDate checkinDate);

    long countByUserId(Long userId);

    @Query("SELECT COALESCE(SUM(d.pointsEarned), 0) FROM DailyCheckin d WHERE d.userId = :userId")
    Integer calculateTotalPoints(@Param("userId") Long userId);

    @Query("SELECT DISTINCT d.checkinDate FROM DailyCheckin d WHERE d.userId = :userId ORDER BY d.checkinDate DESC")
    List<LocalDate> findCheckinDates(@Param("userId") Long userId);

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

    @Query("SELECT c.checkinDate as checkinDate, SUM(c.pointsEarned) as totalPoints " +
            "FROM DailyCheckin c " +
            "WHERE c.userId = :userId AND c.checkinDate >= :startDate " +
            "GROUP BY c.checkinDate")
    List<DailyCheckinAggregate> findCalendarData(@Param("userId") Long userId,
                                                 @Param("startDate") LocalDate startDate);

    // ✅ Used to calculate Total Distance for Profile
    @Query("SELECT COALESCE(SUM(d.distance), 0) FROM DailyCheckin d WHERE d.userId = :userId")
    Double getTotalDistance(@Param("userId") Long userId);

    List<DailyCheckin> findTop10ByUserIdOrderByCheckinDateDesc(Long userId);
}