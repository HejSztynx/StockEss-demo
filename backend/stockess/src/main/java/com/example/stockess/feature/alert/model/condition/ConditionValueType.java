package com.example.stockess.feature.alert.model.condition;

public enum ConditionValueType {
    PERCENTAGE,
    ABSOLUTE;

    public String format() {
        return switch (this) {
            case PERCENTAGE -> "%";
            case ABSOLUTE -> "PLN";
        };
    }
}
