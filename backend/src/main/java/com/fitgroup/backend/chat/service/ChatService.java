package com.fitgroup.backend.chat.service;

import com.fitgroup.backend.chat.dto.ChatMessageResponse;
import com.fitgroup.backend.chat.entity.ChatMessage;
import com.fitgroup.backend.chat.repository.ChatMessageRepository;
import com.fitgroup.backend.challenge.entity.Challenge;
import com.fitgroup.backend.challenge.repository.ChallengeParticipantRepository;
import com.fitgroup.backend.challenge.repository.ChallengeRepository;
import com.fitgroup.backend.user.entity.User;
import com.fitgroup.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChallengeRepository challengeRepository;
    private final ChallengeParticipantRepository participantRepository;
    private final UserRepository userRepository; // ✅ Added to fetch names

    // -------------------------------------------------
    // SEND MESSAGE
    // -------------------------------------------------
    public void sendMessage(Long challengeId, Long userId, String messageText) {
        // ... (Same validation logic as before) ...
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));

        if (!participantRepository.existsByChallengeIdAndUserId(challengeId, userId)) {
            throw new RuntimeException("User is not part of this challenge");
        }

        ChatMessage message = ChatMessage.builder()
                .challengeId(challengeId)
                .userId(userId)
                .messageText(messageText)
                .createdAt(LocalDateTime.now())
                .build();

        chatMessageRepository.save(message);
    }

    // -------------------------------------------------
    // FETCH MESSAGES (Fixed to return Names)
    // -------------------------------------------------
    public List<ChatMessageResponse> getMessages(Long challengeId, Long userId) {
        // 1. Validation
        if (!participantRepository.existsByChallengeIdAndUserId(challengeId, userId)) {
            throw new RuntimeException("User is not part of this challenge");
        }

        // 2. Fetch Raw Messages
        List<ChatMessage> rawMessages = chatMessageRepository.findByChallengeIdOrderByCreatedAtAsc(challengeId);

        // 3. Convert to DTO with Names
        return rawMessages.stream().map(msg -> {
            String senderName = userRepository.findById(msg.getUserId())
                    .map(User::getFullName)
                    .orElse("Unknown User");

            return ChatMessageResponse.builder()
                    .messageId(msg.getId())
                    .userId(msg.getUserId())
                    .fullName(senderName) // ✅ The Fix: Real Name!
                    .message(msg.getMessageText())
                    .createdAt(msg.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());
    }
}