package com.example.stockess.feature.insight.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class SinglePredictionDto {
    @JsonProperty("predicted_price")
    private Float predictedPrice;
}
