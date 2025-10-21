package com.example.stockess.feature.alert.model.util;

import com.example.stockess.feature.insight.model.dto.OHLCDataDto;
import com.example.stockess.feature.insight.model.dto.PriceHistoryDto;

import java.time.LocalDate;

public record ConditionEvaluationContext(
        PriceHistoryDto history,
        LocalDate checkedDay,
        LocalDate alertStartDate) {

    public CurrentPastPrices getCurrentAndPastPrices(Long period) {
        int currentIndex = history.findIndexByDate(checkedDay);
        int pastIndex = currentIndex - period.intValue();
        if (currentIndex < 0 || pastIndex < 0) {
            return null;
        }

        OHLCDataDto currentPrice = history.getOhlcHistory().get(currentIndex);
        OHLCDataDto pastPrice = history.getOhlcHistory().get(pastIndex);

        return new CurrentPastPrices(currentPrice, pastPrice);
    }

    public CurrentPastPrices getCurrentAndStartDatePrices() {
        int currentIndex = history.findIndexByDate(checkedDay);
        int startDateIndex = history.findClosestIndexBeforeDate(alertStartDate);
        if (currentIndex < 0 || startDateIndex < 0) {
            return null;
        }

        OHLCDataDto currentPrice = history.getOhlcHistory().get(currentIndex);
        OHLCDataDto startDatePrice = history.getOhlcHistory().get(startDateIndex);

        return new CurrentPastPrices(currentPrice, startDatePrice);
    }
}
