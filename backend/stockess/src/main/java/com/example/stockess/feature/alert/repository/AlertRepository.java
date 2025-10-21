package com.example.stockess.feature.alert.repository;

import com.example.stockess.feature.alert.model.Alert;
import com.example.stockess.feature.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findAllByUserOrderByCreatedAtDesc(User user);

    List<Alert> findAllByIsActiveIsTrue();
}
