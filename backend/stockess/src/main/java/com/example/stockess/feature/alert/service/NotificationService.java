package com.example.stockess.feature.alert.service;

import com.example.stockess.feature.alert.dto.response.NotificationDto;
import com.example.stockess.feature.alert.exception.NoAlertFoundException;
import com.example.stockess.feature.alert.exception.NoNotificationFoundException;
import com.example.stockess.feature.alert.model.Alert;
import com.example.stockess.feature.alert.model.Notification;
import com.example.stockess.feature.alert.repository.AlertRepository;
import com.example.stockess.feature.alert.repository.NotificationRepository;
import com.example.stockess.feature.alert.util.NotificationMapper;
import com.example.stockess.feature.user.model.User;
import com.example.stockess.feature.user.service.UserAuthService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@Service
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final AlertRepository alertRepository;
    private final UserAuthService userAuthService;
    private final NotificationMapper notificationMapper;

    public List<NotificationDto> getAll() {
        User user = userAuthService.getAuthenticatedUser();
        List<Notification> notifications = notificationRepository.findAllByUserOrderByCreatedAtDesc(user);
        return notifications.stream()
                .map(notificationMapper::toNotificationDto)
                .toList();
    }

    public void readNotification(Long id) {
        User user = userAuthService.getAuthenticatedUser();
        Notification notification = notificationRepository.findById(id).orElseThrow(NoNotificationFoundException::new);
        userAuthService.authenticateUsersAccess(user, notification);

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void readAllNotifications(Long alertId) {
        User user = userAuthService.getAuthenticatedUser();
        Alert alert = alertRepository.findById(alertId).orElseThrow(NoAlertFoundException::new);
        userAuthService.authenticateUsersAccess(user, alert);

        notificationRepository.markAllAsReadByAlertId(alertId);
    }

    public void deleteNotification(Long id) {
        User user = userAuthService.getAuthenticatedUser();
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(NoNotificationFoundException::new);
        userAuthService.authenticateUsersAccess(user, notification);

        Alert alert = notification.getAlert();
        alert.removeNotification(notification);

        notificationRepository.delete(notification);
    }

    public void deleteAllNotifications(Long alertId) {
        User user = userAuthService.getAuthenticatedUser();
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(NoAlertFoundException::new);
        userAuthService.authenticateUsersAccess(user, alert);

        notificationRepository.deleteAllByAlertId(alertId);
    }

    public void createNotification(Alert alert, String message) {
        Notification notification = new Notification();
        notification.setCreatedAt(LocalDateTime.now());
        notification.setMessage(message);

        alert.addNotification(notification);
        notificationRepository.save(notification);
    }
}
