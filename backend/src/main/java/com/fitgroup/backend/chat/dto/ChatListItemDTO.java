package com.fitgroup.backend.chat.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatListItemDTO {
    private Long id;
    private String name;
    private String type; // "CHALLENGE" or "GROUP"
    private String letter; // First letter for the avatar
}