package com.example.stockess.feature.authentication.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LoginRequest {

    @NotNull(message = "Field 'email' is required")
    private String email;

    @NotNull(message = "Field 'password' is required")
    private String password;
}
