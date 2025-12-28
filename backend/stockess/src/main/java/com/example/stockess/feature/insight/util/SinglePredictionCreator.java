package com.example.stockess.feature.insight.util;

import com.example.stockess.feature.insight.exception.InvalidPeriodException;
import com.example.stockess.feature.insight.model.Prediction;
import com.example.stockess.feature.insight.model.dto.SinglePredictionDto;
import org.springframework.stereotype.Component;

@Component
public class SinglePredictionCreator {

    public SinglePredictionDto getSinglePredictionDto(String period, Prediction latestPrediction) {
        SinglePredictionDto dto = new SinglePredictionDto();

        switch (period.toLowerCase()) {
            case "1m" -> dto.setPredictedPrice(latestPrediction.getPrediction1m().floatValue());
            case "3m" -> dto.setPredictedPrice(latestPrediction.getPrediction3m().floatValue());
            case "6m" -> dto.setPredictedPrice(latestPrediction.getPrediction6m().floatValue());
            case "1y" -> dto.setPredictedPrice(latestPrediction.getPrediction1y().floatValue());
            default -> throw new InvalidPeriodException();
        }

        return dto;
    }
}
