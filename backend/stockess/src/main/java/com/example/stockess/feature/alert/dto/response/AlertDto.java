package com.example.stockess.feature.alert.dto.response;

import com.example.stockess.feature.alert.dto.ConditionDto;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AlertDto {
    private Long id;
    private LocalDateTime createdAt;
    private LocalDate startDate;
    private String name;
    private boolean isActive;
    private boolean isOnce;
    private List<String> companies;
    private List<ConditionDto> conditions;
    private List<NotificationDto> notifications;
}
