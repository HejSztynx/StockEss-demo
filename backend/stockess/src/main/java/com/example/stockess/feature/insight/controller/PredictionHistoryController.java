package com.example.stockess.feature.insight.controller;

import com.example.stockess.feature.insight.service.PredictionHistoryService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/prediction-history")
public class PredictionHistoryController {

    private final PredictionHistoryService predictionHistoryService;

    @GetMapping()
    public ResponseEntity<?> getStockPricesData(@RequestParam("ticker") String ticker) {
        return ResponseEntity.ok().body(predictionHistoryService.getPredictionHistory(ticker));
    }
}
