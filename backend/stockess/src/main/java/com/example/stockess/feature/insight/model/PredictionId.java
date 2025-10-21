package com.example.stockess.feature.insight.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

@Embeddable
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PredictionId implements Serializable {

    private String companyTicker;
    private LocalDate predictionDate;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PredictionId that)) return false;
        return Objects.equals(companyTicker, that.companyTicker) &&
                Objects.equals(predictionDate, that.predictionDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(companyTicker, predictionDate);
    }
}
