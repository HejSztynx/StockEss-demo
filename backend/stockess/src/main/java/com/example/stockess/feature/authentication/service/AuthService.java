package com.example.stockess.feature.authentication.service;

import com.example.stockess.configuration.security.JwtUtil;
import com.example.stockess.feature.authentication.dto.request.LoginRequest;
import com.example.stockess.feature.authentication.exception.EmailAlreadyExistsException;
import com.example.stockess.feature.user.model.User;
import com.example.stockess.feature.user.dto.response.UserDto;
import com.example.stockess.feature.user.repository.UserRepository;
import com.example.stockess.configuration.security.util.TokenCookieCreator;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@AllArgsConstructor
@Service
@Transactional
public class AuthService {

    private UserRepository userRepository;

    private PasswordEncoder passwordEncoder;

    private AuthenticationManager authenticationManager;

    private JwtUtil jwtUtil;

    private TokenCookieCreator tokenCookieCreator;

    public void createSession(LoginRequest request, HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtUtil.generateToken(request.getEmail());
        Cookie cookie = tokenCookieCreator.validCookie(token);

        response.addCookie(cookie);
    }

    public void invalidateSession(HttpServletResponse response) {
        Cookie cookie = tokenCookieCreator.invalidCookie();
        response.addCookie(cookie);
    }

    public void registerUser(UserDto userDto) {
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("The email is already registered!");
        }

        String encodedPassword = passwordEncoder.encode(userDto.getPassword());
        userDto.setPassword(encodedPassword);

        User user = UserDto.toUser(userDto);
        userRepository.save(user);
    }
}
