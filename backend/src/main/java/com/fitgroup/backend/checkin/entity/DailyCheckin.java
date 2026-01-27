package com.fitgroup.backend.checkin.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_checkins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyCheckin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long challengeId; // Optional (nullable)
    private Long userId;
    private LocalDate checkinDate;

    // ✅ NEW FIELDS (Replaces 'value')
    private Double distance;
    private Integer timeMinutes;
    private String notes;

    private Integer pointsEarned;
    private LocalDateTime createdAt;
}