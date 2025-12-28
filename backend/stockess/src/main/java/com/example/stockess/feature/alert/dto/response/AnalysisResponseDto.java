package com.example.stockess.feature.alert.dto.response;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class AnalysisResponseDto {

    private List<OccurrenceDto> occurrences = new ArrayList<>();
}
