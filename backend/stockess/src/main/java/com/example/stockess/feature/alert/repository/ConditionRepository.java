package com.example.stockess.feature.alert.repository;

import com.example.stockess.feature.alert.model.condition.BaseCondition;
import com.example.stockess.feature.alert.model.condition.ConditionValueType;
import com.example.stockess.feature.alert.model.util.OHLCType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConditionRepository extends JpaRepository<BaseCondition, Long> {

    @Query("""
        SELECT c FROM BaseCondition c
        WHERE TYPE(c) = :clazz
          AND c.value = :value
          AND c.valueType = :valueType
          AND c.ohlcType = :ohlcType
          AND (:period IS NULL OR (c.period IS NOT NULL AND c.period = :period))
    """)
    List<BaseCondition> findFirstMatching(
            @Param("clazz") Class<? extends BaseCondition> clazz,
            @Param("value") Float value,
            @Param("valueType") ConditionValueType valueType,
            @Param("ohlcType") OHLCType ohlcType,
            @Param("period") Long period
    );
}
