package com.example.stockess.feature.alert.controller;

import com.example.stockess.feature.alert.dto.response.NotificationDto;
import com.example.stockess.feature.alert.service.NotificationService;
import com.example.stockess.feature.util.response.SuccessResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/notification")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/all")
    public ResponseEntity<List<NotificationDto>> getAll() {
        List<NotificationDto> notifications = notificationService.getAll();

        return ResponseEntity.ok().body(notifications);
    }

    @PostMapping("/read")
    public ResponseEntity<?> readNotification(@RequestParam("notification_id") Long id) {
        notificationService.readNotification(id);

        return ResponseEntity.ok(new SuccessResponse("Successfully read a notification"));
    }

    @PostMapping("/read-all")
    public ResponseEntity<?> readAllNotifications(@RequestParam("alert_id") Long alertId) {
        notificationService.readAllNotifications(alertId);

        return ResponseEntity.ok(new SuccessResponse("Successfully read a notification"));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteNotification(@RequestParam("notification_id") Long id) {
        notificationService.deleteNotification(id);

        return ResponseEntity.ok(new SuccessResponse("Successfully deleted a notification"));
    }

    @DeleteMapping("/delete-all")
    public ResponseEntity<?> deleteAllNotifications(@RequestParam("alert_id") Long alertId) {
        notificationService.deleteAllNotifications(alertId);

        return ResponseEntity.ok(new SuccessResponse("Successfully deleted a notification"));
    }
}
