package com.example.stockess.feature.alert.dto;

import com.example.stockess.feature.alert.model.condition.ConditionType;
import com.example.stockess.feature.alert.model.condition.ConditionValueType;
import com.example.stockess.feature.alert.model.util.OHLCType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ConditionDto {
    private Long id;

    @NotNull(message = "Field 'conditionType' is required")
    private ConditionType conditionType;

    private Long period;

    @NotNull(message = "Field 'value' is required")
    private Float value;

    @NotNull(message = "Field 'valueType' is required")
    private ConditionValueType valueType;

    @NotNull(message = "Field 'ohlcType' is required")
    private OHLCType ohlcType;
}
