package com.example.stockess.feature.insight.model.dto.current;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class CurrentPricesDto {
    @JsonProperty("current_prices")
    private Map<String, Float> currentPrices = new HashMap<>();

    @JsonAnySetter
    public void addPattern(String ticker, Float price) {
        currentPrices.put(ticker, price);
    }
}
