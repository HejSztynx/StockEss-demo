package com.example.stockess.feature.alert.dto.request;

import com.example.stockess.feature.alert.dto.ConditionDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class AnalysisDtoRequest {
    @NotNull(message = "Field 'alertId' is required")
    private Long alertId;

    @NotNull(message = "Field 'ticker' is required")
    private String ticker;
}
