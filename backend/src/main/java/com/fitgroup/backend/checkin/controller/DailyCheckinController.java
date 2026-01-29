package com.fitgroup.backend.checkin.controller;

import com.fitgroup.backend.checkin.dto.CheckinCalendarDayResponse;
import com.fitgroup.backend.checkin.dto.DailyCheckinRequest;
import com.fitgroup.backend.checkin.service.DailyCheckinService;
import com.fitgroup.backend.checkin.entity.DailyCheckin;
import com.fitgroup.backend.user.entity.User;
import com.fitgroup.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.fitgroup.backend.checkin.entity.DailyCheckin;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/daily-checkins")
@RequiredArgsConstructor
public class DailyCheckinController {

    private final DailyCheckinService checkinService;
    private final UserRepository userRepository;

    // ✅ 1. THE MISSING ENDPOINT (Restored!)
    // This handles clicking "Submit Check-In"
    @PostMapping
    public ResponseEntity<?> checkIn(@RequestBody DailyCheckinRequest req, Authentication authentication) {
        String email = authentication.getName();

        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        DailyCheckin saved = checkinService.checkIn(userId, req);

        return ResponseEntity.ok(saved);
    }

    // ✅ 2. THE HISTORY ENDPOINT
    // This loads the table at the bottom
    @GetMapping("/history")
    public ResponseEntity<List<DailyCheckin>> getCheckinHistory(Authentication authentication) {
        String email = authentication.getName();

        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        return ResponseEntity.ok(checkinService.getRecentCheckins(userId));
    }

    @GetMapping("/calendar")
    public ResponseEntity<List<CheckinCalendarDayResponse>> getCalendar(
            @RequestParam(defaultValue = "365") int days,
            Principal principal
    ) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        return ResponseEntity.ok(checkinService.getCalendar(user.getId(), days));
    }


}