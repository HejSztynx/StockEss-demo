package com.example.stockess.feature.insight.model.dto;

import com.example.stockess.feature.insight.model.Prediction;
import com.example.stockess.feature.insight.model.CompanyDateId;

import java.time.LocalDate;

public record PredictionDto(
        LocalDate date,
        Double pastPrice,
        Double prediction1m,
        Double prediction3m,
        Double prediction6m,
        Double prediction1y,
        Double realPrice1m,
        Double realPrice3m,
        Double realPrice6m,
        Double realPrice1y,
        Double surprise1m,
        Double surprise3m,
        Double surprise6m,
        Double surprise1y
) {
    public static PredictionDto from(Prediction prediction) {
        CompanyDateId id = prediction.getId();
        return new PredictionDto(
                id.getDate(),
                round(prediction.getPastPrice(), 2),
                round(prediction.getPrediction1m(), 2),
                round(prediction.getPrediction3m(), 2),
                round(prediction.getPrediction6m(), 2),
                round(prediction.getPrediction1y(), 2),
                round(prediction.getRealPrice1m(), 2),
                round(prediction.getRealPrice3m(), 2),
                round(prediction.getRealPrice6m(), 2),
                round(prediction.getRealPrice1y(), 2),
                round(prediction.getSurprise1m(), 2),
                round(prediction.getSurprise3m(), 2),
                round(prediction.getSurprise6m(), 2),
                round(prediction.getSurprise1y(), 2)
        );
    }

    private static Double round(Double value, int places) {
        if (value == null) return null;
        double scale = Math.pow(10, places);
        return Math.round(value * scale) / scale;
    }

}
