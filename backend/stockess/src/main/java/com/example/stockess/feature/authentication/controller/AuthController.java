package com.example.stockess.feature.authentication.controller;

import com.example.stockess.feature.authentication.dto.request.LoginRequest;
import com.example.stockess.feature.authentication.service.AuthService;
import com.example.stockess.feature.util.response.SuccessResponse;
import com.example.stockess.feature.user.dto.response.UserDto;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/auth")
@Validated
public class AuthController {

    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody @Valid UserDto userDto) {
        authService.registerUser(userDto);
        SuccessResponse body = new SuccessResponse("Successfully registered!");
        return ResponseEntity.ok(body);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        authService.createSession(request, response);

        SuccessResponse body = new SuccessResponse("Successfully logged in!");
        return ResponseEntity.ok(body);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        authService.invalidateSession(response);

        return ResponseEntity.ok(new SuccessResponse("Successfully logged out"));
    }
}

