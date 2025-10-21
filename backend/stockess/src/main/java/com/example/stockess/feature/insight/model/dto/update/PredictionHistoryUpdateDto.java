package com.example.stockess.feature.insight.model.dto.update;

import java.util.List;

public record PredictionHistoryUpdateDto(
        List<NewUpdateDto> newUpdates,
        List<OldUpdateDto> oldUpdates
) {
}
