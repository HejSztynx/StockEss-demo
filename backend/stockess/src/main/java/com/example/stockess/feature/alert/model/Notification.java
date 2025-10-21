package com.example.stockess.feature.alert.model;

import com.example.stockess.feature.user.model.User;
import com.example.stockess.feature.user.model.UserAccessible;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification implements UserAccessible {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "alert_id")
    private Alert alert;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false, name = "read")
    private boolean read = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Override
    public User getUser() {
        return alert.getUser();
    }
}
