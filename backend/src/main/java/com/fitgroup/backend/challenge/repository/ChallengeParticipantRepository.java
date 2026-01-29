package com.fitgroup.backend.challenge.repository;

import com.fitgroup.backend.challenge.entity.ChallengeParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional; // ✅ Import Optional

public interface ChallengeParticipantRepository extends JpaRepository<ChallengeParticipant, Long> {

    // ✅ NEW: Find specific participant record to update points
    Optional<ChallengeParticipant> findByChallengeIdAndUserId(Long challengeId, Long userId);

    int countByUserId(Long userId);
    boolean existsByChallengeIdAndUserId(Long challengeId, Long userId);
    int countByChallengeId(Long challengeId);
    List<ChallengeParticipant> findByUserId(Long userId);
    List<ChallengeParticipant> findByChallengeId(Long challengeId);
    List<ChallengeParticipant> findByChallengeIdOrderByTotalPointsDesc(Long challengeId);

    @Query("""
    SELECT cp, c
    FROM ChallengeParticipant cp
    JOIN Challenge c ON cp.challengeId = c.id
    WHERE cp.userId = :userId AND c.isDeleted = false
    """)
    List<Object[]> findAllByUserWithChallenges(@Param("userId") Long userId);

    @Query("""
    SELECT cp, u.fullName
    FROM ChallengeParticipant cp
    JOIN User u ON cp.userId = u.id
    WHERE cp.challengeId = :challengeId
    ORDER BY cp.totalPoints DESC, cp.maxStreak DESC, cp.joinedAt ASC
    """)
    List<Object[]> findLeaderboard(@Param("challengeId") Long challengeId);
}