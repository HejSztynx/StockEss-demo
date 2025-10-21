package com.example.stockess.feature.insight.model.dto.update;

import java.time.LocalDate;

public record OldUpdateDto(
        LocalDate oldDate1m,
        LocalDate oldDate3m,
        LocalDate oldDate6m,
        LocalDate oldDate1y,
        Double realPrice
) {
}
