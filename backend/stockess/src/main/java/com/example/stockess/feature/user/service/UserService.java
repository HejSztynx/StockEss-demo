package com.example.stockess.feature.user.service;

import com.example.stockess.feature.user.repository.UserRepository;
import com.example.stockess.feature.user.exception.NoUserFoundException;
import com.example.stockess.feature.user.model.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@AllArgsConstructor
@Service
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(NoUserFoundException::new);
    }
}
