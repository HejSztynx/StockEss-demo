package com.example.stockess.feature.insight.model.dto.update;

import java.time.LocalDate;

public record NewUpdateDto(
        LocalDate date,
        Double price,
        Double prediction1m,
        Double prediction3m,
        Double prediction6m,
        Double prediction1y
) {
}
