package com.fitgroup.backend.chat.repository;

import com.fitgroup.backend.chat.entity.ChatGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ChatGroupRepository extends JpaRepository<ChatGroup, Long> {
    // Find all groups where the user is a participant
    @Query("SELECT c FROM ChatGroup c JOIN c.participants u WHERE u.id = :userId")
    List<ChatGroup> findByUserId(@Param("userId") Long userId);
}