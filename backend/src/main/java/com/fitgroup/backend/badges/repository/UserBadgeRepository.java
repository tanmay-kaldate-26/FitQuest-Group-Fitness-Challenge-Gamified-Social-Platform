package com.fitgroup.backend.badges.repository;

import com.fitgroup.backend.badges.entity.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserBadgeRepository extends JpaRepository<UserBadge, Long> {

    boolean existsByUserIdAndBadgeId(Long userId, Long badgeId);

    List<UserBadge> findByUserId(Long userId);

    // Fetch the names of badges this user has earned
    @Query("SELECT b.name FROM UserBadge ub JOIN Badge b ON ub.badgeId = b.id WHERE ub.userId = :userId")
    List<String> findBadgeNamesByUserId(Long userId);
}