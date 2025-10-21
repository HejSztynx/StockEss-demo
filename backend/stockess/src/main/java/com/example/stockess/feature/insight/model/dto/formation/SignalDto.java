package com.example.stockess.feature.insight.model.dto.formation;

import lombok.Data;

import java.time.LocalDate;

@Data
public class SignalDto {
    private LocalDate date;
    private SignalType signal;
}
