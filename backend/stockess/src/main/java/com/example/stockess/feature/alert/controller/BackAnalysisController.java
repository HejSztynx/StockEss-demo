package com.example.stockess.feature.alert.controller;

import com.example.stockess.feature.alert.dto.request.AnalysisDtoRequest;
import com.example.stockess.feature.alert.dto.response.AnalysisResponseDto;
import com.example.stockess.feature.alert.service.AnalysisService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/analysis")
public class BackAnalysisController {

    private final AnalysisService analysisService;

    @PostMapping("perform")
    public ResponseEntity<AnalysisResponseDto> backAnalysis(@Valid @RequestBody AnalysisDtoRequest dtoRequest) {
        AnalysisResponseDto responseDto = analysisService.performAnalysis(dtoRequest.getAlertId(), dtoRequest.getTicker());

        return ResponseEntity.ok(responseDto);
    }
}
