package com.example.stockess.feature.alert.repository;

import com.example.stockess.feature.alert.model.Notification;
import com.example.stockess.feature.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n WHERE n.alert.user = :user ORDER BY n.createdAt DESC")
    List<Notification> findAllByUserOrderByCreatedAtDesc(@Param("user") User user);

    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.alert.id = :alertId")
    void markAllAsReadByAlertId(@Param("alertId") Long alertId);

    @Modifying
    @Query("DELETE FROM Notification n WHERE n.alert.id = :alertId")
    void deleteAllByAlertId(@Param("alertId") Long alertId);
}
