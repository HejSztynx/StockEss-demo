package com.example.stockess.feature.insight.model.dto;

import com.example.stockess.feature.alert.model.util.OHLCType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class OHLCDataDto {

    private LocalDate date;
    private Float open;
    private Float high;
    private Float low;
    private Float close;

    public Float getValueByType(OHLCType ohlcType) {
        return switch (ohlcType) {
            case OPEN -> open;
            case HIGH -> high;
            case LOW -> low;
            case CLOSE -> close;
        };
    }
}
