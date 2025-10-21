package com.example.stockess.feature.user.dto.response;

import com.example.stockess.feature.user.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserDto {

    @NotNull(message = "Field 'email' is required")
    @NotBlank(message = "Enter a valid email address")
    @Email(message = "Enter a valid email address")
    private String email;

    @NotNull(message = "Field 'password' is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    public static User toUser(UserDto userDto) {
        User user = new User();
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());
        return user;
    }
}