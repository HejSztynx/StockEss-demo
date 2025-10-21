package com.example.stockess.feature.insight.controller;

import com.example.stockess.feature.insight.model.dto.PriceHistoryDto;
import com.example.stockess.feature.insight.model.dto.SinglePredictionDto;
import com.example.stockess.feature.insight.model.dto.current.CurrentPricesDto;
import com.example.stockess.feature.insight.service.StockPricesService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@AllArgsConstructor
@RestController
@RequestMapping("/stock-prices")
public class StockPricesController {

    private final StockPricesService stockPricesService;

    @GetMapping("/predict")
    public ResponseEntity<SinglePredictionDto> getStockPricesPrediction(@RequestParam("ticker") String ticker, @RequestParam("period") String period) {
        SinglePredictionDto prediction = stockPricesService.fetchStockPricesPrediction(ticker, period);
        return ResponseEntity.ok(prediction);
    }

    @GetMapping()
    public ResponseEntity<PriceHistoryDto> getStockPricesData(@RequestParam("ticker") String ticker) {
        PriceHistoryDto priceHistoryDto = stockPricesService.fetchStockPricesData(ticker);
        return ResponseEntity.ok(priceHistoryDto);
    }

    @GetMapping("/current")
    public ResponseEntity<CurrentPricesDto> getCurrentPrices() {
        CurrentPricesDto currentPricesDto = stockPricesService.fetchCurrentStockPrices();
        return ResponseEntity.ok(currentPricesDto);
    }
}
