package com.fitgroup.backend.user.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String fullName;
    private String bio;
    // Add password/email fields if you want to support changing them
}