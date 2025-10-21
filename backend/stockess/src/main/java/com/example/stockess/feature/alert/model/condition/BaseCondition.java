package com.example.stockess.feature.alert.model.condition;

import com.example.stockess.feature.alert.dto.ConditionDto;
import com.example.stockess.feature.alert.model.Alert;
import com.example.stockess.feature.alert.model.util.ConditionEvaluationContext;
import com.example.stockess.feature.alert.model.util.OHLCType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "condition_type")
@Table(name = "conditions")
@NoArgsConstructor
@Setter
@Getter
public abstract class BaseCondition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    protected Float value;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    protected ConditionValueType valueType;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    protected OHLCType ohlcType;

    @ManyToMany(mappedBy = "conditions")
    private List<Alert> alerts = new ArrayList<>();

    public abstract Optional<String> evaluate(ConditionEvaluationContext context);

    protected abstract void modifyDto(ConditionDto dto);

    public ConditionDto toDto() {
        ConditionDto dto = new ConditionDto();
        dto.setId(id);
        dto.setValue(value);
        dto.setValueType(valueType);
        dto.setOhlcType(ohlcType);

        modifyDto(dto);

        return dto;
    }
}
