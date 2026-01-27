package com.fitgroup.backend.challenge.controller;

import com.fitgroup.backend.challenge.dto.ChallengeParticipantResponse; // ✅ Import DTO
import com.fitgroup.backend.challenge.dto.CreateChallengeRequest;
import com.fitgroup.backend.challenge.dto.MyChallengeResponse;
import com.fitgroup.backend.challenge.entity.Challenge;
import com.fitgroup.backend.challenge.service.ChallengeService;
import com.fitgroup.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/challenges")
@RequiredArgsConstructor
public class ChallengeController {

    private final ChallengeService challengeService;
    private final UserRepository userRepository;

    private Long getUserId(Principal principal) {
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    @PostMapping("/create")
    public ResponseEntity<?> createChallenge(@RequestBody CreateChallengeRequest request, Principal principal) {
        Long userId = getUserId(principal);
        if (request.visibility == null) {
            challengeService.createPersonalChallenge(request, userId);
        } else {
            challengeService.createGroupChallenge(request, userId);
        }
        return ResponseEntity.ok("Challenge created successfully");
    }

    @GetMapping("/my")
    public ResponseEntity<List<MyChallengeResponse>> getMyChallenges(Principal principal) {
        Long userId = getUserId(principal);
        return ResponseEntity.ok(challengeService.getMyChallenges(userId));
    }

    @GetMapping("/public")
    public ResponseEntity<List<Challenge>> getPublicChallenges() {
        return ResponseEntity.ok(challengeService.getPublicChallenges());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Challenge> getChallengeDetails(@PathVariable Long id) {
        return ResponseEntity.ok(challengeService.getChallengeDetails(id));
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<?> joinChallenge(@PathVariable Long id, Principal principal) {
        Long userId = getUserId(principal);
        challengeService.joinChallenge(id, userId);
        return ResponseEntity.ok("Joined challenge successfully");
    }

    // ✅✅ ADD THIS: ENDPOINT FOR PARTICIPANTS LIST
    @GetMapping("/{id}/participants")
    public ResponseEntity<List<ChallengeParticipantResponse>> getParticipants(@PathVariable Long id) {
        return ResponseEntity.ok(challengeService.getChallengeParticipants(id));
    }
}