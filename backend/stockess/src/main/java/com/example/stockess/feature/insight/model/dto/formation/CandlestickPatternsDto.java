package com.example.stockess.feature.insight.model.dto.formation;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import lombok.Data;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class CandlestickPatternsDto {
    private Map<String, List<SignalDto>> patterns = new HashMap<>();

    @JsonAnySetter
    public void addPattern(String patternName, List<SignalDto> signals) {
        patterns.put(patternName, signals);
    }
}
