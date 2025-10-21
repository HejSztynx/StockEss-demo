package com.example.stockess.feature.alert.util;

import com.example.stockess.feature.alert.dto.ConditionDto;
import com.example.stockess.feature.alert.model.condition.BaseCondition;
import org.springframework.stereotype.Component;

@Component
public class ConditionMapper {

    public ConditionDto toConditionDto(BaseCondition condition) {
        return condition.toDto();
    }
}
