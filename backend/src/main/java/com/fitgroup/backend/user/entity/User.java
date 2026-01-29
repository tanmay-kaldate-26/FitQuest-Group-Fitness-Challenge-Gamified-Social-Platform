package com.fitgroup.backend.user.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name")
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    // ✅ FIX 1: Rename field to 'password' so Controller finds getPassword()
    // ✅ FIX 2: Map it to the existing DB column 'password_hash'
    @Column(name = "password_hash", nullable = false)
    private String password;

    private String role;

    private Integer age;
    private Double weightKg;

    @Column(name = "best_streak")
    private Integer bestStreak;

    @Column(name = "current_streak")
    private Integer currentStreak;

    @Column(name = "total_points")
    private Integer totalPoints;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(updatable = false)
    private LocalDateTime joinedAt;

    private int daysActive = 1;

    private LocalDate lastCheckInDate;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.joinedAt = LocalDateTime.now();
    }
}