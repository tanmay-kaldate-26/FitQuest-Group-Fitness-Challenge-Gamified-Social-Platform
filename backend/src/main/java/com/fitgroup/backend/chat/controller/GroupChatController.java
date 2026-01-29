package com.fitgroup.backend.chat.controller;

import com.fitgroup.backend.challenge.dto.MyChallengeResponse;
import com.fitgroup.backend.challenge.service.ChallengeService; // ✅ Use Service
import com.fitgroup.backend.chat.dto.ChatListItemDTO;
import com.fitgroup.backend.chat.entity.ChatGroup;
import com.fitgroup.backend.chat.repository.ChatGroupRepository;
import com.fitgroup.backend.user.entity.User;
import com.fitgroup.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class GroupChatController {

    private final ChatGroupRepository chatGroupRepository;
    private final UserRepository userRepository;
    private final ChallengeService challengeService; // ✅ Inject ChallengeService

    // 1. CREATE GROUP
    @PostMapping("/group")
    public ResponseEntity<?> createGroupChat(@RequestBody CreateGroupRequest request, Principal principal) {
        User creator = userRepository.findByEmail(principal.getName()).orElseThrow();

        ChatGroup group = new ChatGroup();
        group.setName(request.name);
        Set<User> participants = new HashSet<>();
        participants.add(creator);
        group.setParticipants(participants);

        chatGroupRepository.save(group);
        return ResponseEntity.ok("Chat Group Created!");
    }

    // 2. GET ALL CHATS (Unified List)
    @GetMapping("/groups")
    public ResponseEntity<List<ChatListItemDTO>> getMyGroups(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        List<ChatListItemDTO> chatList = new ArrayList<>();

        // A. Add CHALLENGES (Using Service ensures we get them all)
        List<MyChallengeResponse> myChallenges = challengeService.getMyChallenges(user.getId());
        for (MyChallengeResponse c : myChallenges) {
            chatList.add(ChatListItemDTO.builder()
                    .id(c.getChallengeId())
                    .name(c.getName())
                    .type("CHALLENGE") // ✅ Mark as Challenge
                    .letter(c.getName().substring(0, 1).toUpperCase())
                    .build());
        }

        // B. Add CUSTOM GROUPS
        List<ChatGroup> myGroups = chatGroupRepository.findByUserId(user.getId());
        for (ChatGroup g : myGroups) {
            chatList.add(ChatListItemDTO.builder()
                    .id(g.getId())
                    .name(g.getName())
                    .type("GROUP") // ✅ Mark as Group
                    .letter(g.getName().substring(0, 1).toUpperCase())
                    .build());
        }

        return ResponseEntity.ok(chatList);
    }

    @DeleteMapping("/group/{groupId}")
    public ResponseEntity<?> deleteGroup(@PathVariable Long groupId) {
        // In a real app, check if the user is the owner first.
        // For now, simple delete:
        chatGroupRepository.deleteById(groupId);
        return ResponseEntity.ok("Group deleted successfully");
    }

    @lombok.Data
    static class CreateGroupRequest {
        private String name;
        private List<Long> participantIds;
    }
}