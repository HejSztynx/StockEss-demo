package com.example.stockess.feature.alert.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class OccurrenceDto {

    private LocalDate date;
    private String message;
}
