package com.example.stockess.feature.insight.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class PriceHistoryDto {

    @JsonProperty("ohlc_history")
    private List<OHLCDataDto> ohlcHistory;

    public int findIndexByDate(LocalDate date) {
        if (ohlcHistory == null || ohlcHistory.isEmpty()) {
            return -1;
        }

        for (int i = 0; i < ohlcHistory.size(); i++) {
            if (ohlcHistory.get(i).getDate().equals(date)) {
                return i;
            }
        }

        return -1;
    }

    public int findClosestIndexBeforeDate(LocalDate date) {
        if (ohlcHistory == null || ohlcHistory.isEmpty()) {
            return -1;
        }

        for (int i = 0; i < ohlcHistory.size(); i++) {
            LocalDate d = ohlcHistory.get(i).getDate();
            if (!d.isBefore(date)) {
                if (d.equals(date)) return i;
                return i - 1;
            }
        }

        return -1;
    }
}
