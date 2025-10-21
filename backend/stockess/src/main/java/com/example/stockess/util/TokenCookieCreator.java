package com.example.stockess.util;

import jakarta.servlet.http.Cookie;
import org.springframework.stereotype.Component;

@Component
public class TokenCookieCreator {

    public Cookie validCookie(String token) {
        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60); // 24 h
//        cookie.setMaxAge(10); // 10 s

        return cookie;
    }

    public Cookie invalidCookie() {
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);

        return cookie;
    }
}
