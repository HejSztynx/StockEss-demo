package com.example.stockess.feature.insight.controller;

import com.example.stockess.feature.insight.model.dto.formation.CandlestickPatternsDto;
import com.example.stockess.feature.insight.service.CandlestickFormationsService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/candlestick-formations")
public class CandlestickFormationsController {

    private final CandlestickFormationsService candlestickFormationsService;

    @GetMapping()
    public ResponseEntity<CandlestickPatternsDto> getCandlestickFormations(@RequestParam("ticker") String ticker) {
        CandlestickPatternsDto candlestickPatternsDto = candlestickFormationsService.fetchCandlestickFormations(ticker);
        return ResponseEntity.ok(candlestickPatternsDto);
    }
}
