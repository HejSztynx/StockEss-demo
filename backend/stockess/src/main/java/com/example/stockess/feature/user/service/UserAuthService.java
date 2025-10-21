package com.example.stockess.feature.user.service;

import com.example.stockess.feature.user.model.User;
import com.example.stockess.feature.user.model.UserAccessible;
import com.example.stockess.feature.util.exception.ForbiddenAccessException;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@AllArgsConstructor
@Service
@Transactional(readOnly = true)
public class UserAuthService {

    private final UserService userService;

    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userService.getUserByEmail(email);
    }

    public void authenticateUsersAccess(User user, UserAccessible accessible) {
        if (!accessible.getUser().equals(user)) {
            throw new ForbiddenAccessException(String.format("You don't have the access to this %s!", accessible.format()));
        }
    }
}
