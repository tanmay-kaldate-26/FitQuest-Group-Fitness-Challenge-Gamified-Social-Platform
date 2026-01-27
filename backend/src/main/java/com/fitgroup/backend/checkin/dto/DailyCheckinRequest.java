package com.fitgroup.backend.checkin.dto;

import lombok.Data;

@Data
public class DailyCheckinRequest {
    private Long challengeId; // Optional
    private Double distance;
    private Integer time;
    private String notes;
}