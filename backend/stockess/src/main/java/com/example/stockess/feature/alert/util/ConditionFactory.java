package com.example.stockess.feature.alert.util;

import com.example.stockess.feature.alert.dto.ConditionDto;
import com.example.stockess.feature.alert.model.condition.*;
import com.example.stockess.feature.alert.repository.ConditionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
public class ConditionFactory {

    private final ConditionRepository conditionRepository;

    public BaseCondition findOrCreate(ConditionDto dto) {
        BaseCondition newCondition = create(dto);

        Long period = null;
        if (newCondition instanceof RiseCondition rise) {
            period = rise.getPeriod();
        } else if (newCondition instanceof FallCondition fall) {
            period = fall.getPeriod();
        }

        return conditionRepository.findFirstMatching(
                newCondition.getClass(),
                newCondition.getValue(),
                newCondition.getValueType(),
                newCondition.getOhlcType(),
                period
        ).stream().findFirst().orElse(newCondition);
    }

    private BaseCondition create(ConditionDto dto) {
        BaseCondition baseCondition = switch (dto.getConditionType()) {
            case RISE -> new RiseCondition(dto.getPeriod());
            case FALL -> new FallCondition(dto.getPeriod());
            case MORE -> new MoreCondition();
            case LESS -> new LessCondition();
            case THRESHOLD -> new ThresholdCondition();
        };
        baseCondition.setValue(dto.getValue());
        baseCondition.setValueType(dto.getValueType());
        baseCondition.setOhlcType(dto.getOhlcType());

        return baseCondition;
    }
}
