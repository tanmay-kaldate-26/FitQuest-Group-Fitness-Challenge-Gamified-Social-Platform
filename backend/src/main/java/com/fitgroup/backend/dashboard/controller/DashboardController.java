package com.fitgroup.backend.dashboard.controller;

import com.fitgroup.backend.dashboard.dto.DashboardStatsResponse;
import com.fitgroup.backend.dashboard.service.DashboardService;
import com.fitgroup.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getStats(Principal principal) {
        Long userId = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        return ResponseEntity.ok(dashboardService.getUserStats(userId));
    }
}