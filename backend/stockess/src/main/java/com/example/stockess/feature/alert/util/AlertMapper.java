package com.example.stockess.feature.alert.util;

import com.example.stockess.feature.alert.dto.request.AlertDtoRequest;
import com.example.stockess.feature.alert.dto.response.AlertDto;
import com.example.stockess.feature.alert.model.Alert;
import com.example.stockess.feature.alert.model.condition.BaseCondition;
import com.example.stockess.feature.company.model.Company;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@AllArgsConstructor
public class AlertMapper {

    private final NotificationMapper notificationMapper;

    public Alert toAlert(AlertDtoRequest request) {
        Alert alert = new Alert();
        alert.setName(request.getName());
        alert.setActive(true);
        alert.setCreatedAt(LocalDateTime.now());
        alert.setStartDate(request.getStartDate());
        alert.setOnce(request.getOnce());
        return alert;
    }

    public AlertDto toAlertDto(Alert alert) {
        AlertDto dto = new AlertDto();
        dto.setId(alert.getId());
        dto.setName(alert.getName());
        dto.setCreatedAt(alert.getCreatedAt());
        dto.setActive(alert.isActive());
        dto.setOnce(alert.isOnce());
        dto.setStartDate(alert.getStartDate());
        dto.setConditions(alert.getConditions().stream()
                .map(BaseCondition::toDto)
                .toList());
        dto.setCompanies(alert.getCompanies().stream()
                .map(Company::getId)
                .toList());
        dto.setNotifications(alert.getNotifications().stream()
                .map(notificationMapper::toNotificationDto)
                .toList());
        return dto;
    }

    public void updateAlert(Alert alert, AlertDtoRequest request) {
        alert.setActive(request.getActive());
        alert.setOnce(request.getOnce());
        alert.setName(request.getName());
        alert.setStartDate(request.getStartDate());
    }
}
