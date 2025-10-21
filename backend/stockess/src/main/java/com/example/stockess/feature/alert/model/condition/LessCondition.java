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
@DiscriminatorValue("LESS")
@NoArgsConstructor
@Setter
@Getter
public class LessCondition extends BaseCondition {

    @Override
    public Optional<String> evaluate(ConditionEvaluationContext context) {
        CurrentPastPrices currentAndPastPrices = context.getCurrentAndStartDatePrices();
        if (currentAndPastPrices == null) return Optional.empty();

        Float currentPrice = currentAndPastPrices.currentPrice().getValueByType(ohlcType);
        Float pastPrice = currentAndPastPrices.pastPrice().getValueByType(ohlcType);

        Optional<Float> resultChange = switch (valueType) {
            case PERCENTAGE -> {
                float pricePercent = (currentPrice / pastPrice) * 100;
                yield pricePercent < value ? Optional.of(pricePercent) : Optional.empty();
            }
            case ABSOLUTE -> currentPrice < value ? Optional.of(currentPrice) : Optional.empty();
            case null -> Optional.empty();
        };

        long daysBetween = ChronoUnit.DAYS.between(context.alertStartDate(), context.checkedDay());

        return resultChange.map(actualChange ->
                String.format(
                        "Price fell below %.2f %s after %d days\n     (past: %.2f, current: %.2f)",
                        actualChange,
                        valueType.format(),
                        daysBetween,
                        pastPrice,
                        currentPrice
                )
        );
    }

    @Override
    protected void modifyDto(ConditionDto dto) {
        dto.setConditionType(ConditionType.LESS);
    }
}
