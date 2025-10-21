package com.example.stockess.feature.alert.model.condition;

import com.example.stockess.feature.alert.dto.ConditionDto;
import com.example.stockess.feature.alert.model.util.ConditionEvaluationContext;
import com.example.stockess.feature.alert.model.util.CurrentPastPrices;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;

import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Entity
@DiscriminatorValue("THRESHOLD")
@NoArgsConstructor
@Setter
@Getter
public class ThresholdCondition extends BaseCondition {

    @Override
    public Optional<String> evaluate(ConditionEvaluationContext context) {
        CurrentPastPrices currentAndPastPrices = context.getCurrentAndStartDatePrices();
        if (currentAndPastPrices == null) return Optional.empty();

        Float currentPrice = currentAndPastPrices.currentPrice().getValueByType(ohlcType);
        Float pastPrice = currentAndPastPrices.pastPrice().getValueByType(ohlcType);

        CurrentPastPrices currentAndPreviousPrices = context.getCurrentAndPastPrices(1L);
        if (currentAndPreviousPrices == null) return Optional.empty();

        Float previousPrice = currentAndPreviousPrices.pastPrice().getValueByType(ohlcType);

        Optional<CurrPrevPrices> resultPrices= switch (valueType) {
            case PERCENTAGE -> {
                float currentPercent = (currentPrice / pastPrice) * 100;
                float previousPercent = (previousPrice / pastPrice) * 100;

                yield ((currentPercent >= value && previousPercent <= value) ||
                        (currentPercent <= value && previousPercent >= value)) ?
                        Optional.of(new CurrPrevPrices(previousPercent, currentPercent))
                        : Optional.empty();
            }
            case ABSOLUTE -> ((currentPrice >= value && previousPrice <= value) ||
                    (currentPrice <= value && previousPrice >= value)) ?
                    Optional.of(new CurrPrevPrices(previousPrice, currentPrice))
                    : Optional.empty();
            case null -> Optional.empty();
        };

        long daysBetween = ChronoUnit.DAYS.between(context.alertStartDate(), context.checkedDay());

        return resultPrices.map(prices ->
                String.format(
                        "Price crossed threshold of %.2f %s after %s days\n     (past: %.2f, previous: %.2f %s, current: %.2f %s)",
                        value,
                        valueType.format(),
                        daysBetween,
                        pastPrice,
                        prices.prev,
                        valueType.format(),
                        prices.curr,
                        valueType.format()
                )
        );
    }

    @Override
    protected void modifyDto(ConditionDto dto) {
        dto.setConditionType(ConditionType.THRESHOLD);
    }

    private record CurrPrevPrices(Float prev, Float curr) {}
}
