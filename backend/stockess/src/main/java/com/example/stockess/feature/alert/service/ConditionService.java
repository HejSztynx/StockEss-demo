package com.example.stockess.feature.alert.service;

import com.example.stockess.feature.alert.model.Alert;
import com.example.stockess.feature.alert.model.condition.BaseCondition;
import com.example.stockess.feature.alert.model.util.ConditionEvaluationContext;
import com.example.stockess.feature.insight.model.dto.PriceHistoryDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ConditionService {

    public Optional<List<String>> evaluateConditionsInPresent(Alert alert, PriceHistoryDto history, LocalDate checkedDay) {
        ConditionEvaluationContext context = new ConditionEvaluationContext(
                history,
                checkedDay,
                alert.getStartDate()
        );

        return evaluateConditions(alert, context);
    }

    public Optional<List<String>> evaluateConditionsInPast(Alert alert, PriceHistoryDto history, LocalDate checkedDay) {
        ConditionEvaluationContext context = new ConditionEvaluationContext(
                history,
                checkedDay,
                history.getOhlcHistory().getFirst().getDate()
        );

        return evaluateConditions(alert, context);
    }

    private static Optional<List<String>> evaluateConditions(Alert alert, ConditionEvaluationContext context) {
        List<String> messages = new ArrayList<>();
        for (BaseCondition condition : alert.getConditions()) {
            Optional<String> evaluated = condition.evaluate(context);
            if (evaluated.isEmpty()) {
                return Optional.empty();
            }
            messages.add(evaluated.get());
        }
        return Optional.of(messages);
    }
}
