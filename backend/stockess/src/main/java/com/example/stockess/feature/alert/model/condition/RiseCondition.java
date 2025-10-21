package com.example.stockess.feature.alert.model.condition;

import com.example.stockess.feature.alert.dto.ConditionDto;
import com.example.stockess.feature.alert.model.util.ConditionEvaluationContext;
import com.example.stockess.feature.alert.model.util.CurrentPastPrices;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;

import java.util.Optional;

@Entity
@DiscriminatorValue("RISE")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class RiseCondition extends BaseCondition {

    private Long period;

    @Override
    public Optional<String> evaluate(ConditionEvaluationContext context) {
        CurrentPastPrices currentAndStartPrices = context.getCurrentAndStartDatePrices();
        CurrentPastPrices currentAndPastPrices = context.getCurrentAndPastPrices(period);
        if (currentAndPastPrices == null || currentAndStartPrices == null) return Optional.empty();

        Float currentPrice = currentAndPastPrices.currentPrice().getValueByType(ohlcType);
        Float pastPrice = currentAndPastPrices.pastPrice().getValueByType(ohlcType);

        float change = currentPrice - pastPrice;

        Optional<Float> resultChange = switch (valueType) {
            case PERCENTAGE -> {
                float percentChange = (change / pastPrice) * 100;
                yield percentChange >= value ? Optional.of(percentChange) : Optional.empty();
            }
            case ABSOLUTE -> change >= value ? Optional.of(change) : Optional.empty();
            case null -> Optional.empty();
        };

        return resultChange.map(actualChange ->
                String.format(
                        "Price increased by %.2f %s in %s days\n     (past: %.2f, current: %.2f, threshold: %.2f %s)",
                        actualChange,
                        valueType.format(),
                        period,
                        pastPrice,
                        currentPrice,
                        value,
                        valueType.format()
                )
        );
    }

    @Override
    protected void modifyDto(ConditionDto dto) {
        dto.setPeriod(period);
        dto.setConditionType(ConditionType.RISE);
    }
}
