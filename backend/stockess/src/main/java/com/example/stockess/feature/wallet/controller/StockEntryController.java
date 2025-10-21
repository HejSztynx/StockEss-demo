package com.example.stockess.feature.wallet.controller;

import com.example.stockess.feature.util.response.SuccessResponse;
import com.example.stockess.feature.wallet.dto.request.AddStockEntryRequest;
import com.example.stockess.feature.wallet.dto.request.CloseStockEntryRequest;
import com.example.stockess.feature.wallet.dto.request.EditStockEntryRequest;
import com.example.stockess.feature.wallet.service.StockEntryService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/wallet/entry")
public class StockEntryController {

    private final StockEntryService stockEntryService;

    @GetMapping("/all")
    public ResponseEntity<?> getAll(@RequestParam("wallet_id") Long walletId) {
        return ResponseEntity.ok(stockEntryService.getAll(walletId));
    }

    @PutMapping("/add")
    public ResponseEntity<?> addEntry(@Valid @RequestBody AddStockEntryRequest addStockEntryRequest) {
        stockEntryService.addEntry(addStockEntryRequest);
        return ResponseEntity.ok(new SuccessResponse("Successfully added a stock entry!"));
    }

    @PostMapping("/edit")
    public ResponseEntity<?> editEntry(@Valid @RequestBody EditStockEntryRequest editStockEntryRequest) {
        stockEntryService.editEntry(editStockEntryRequest);
        return ResponseEntity.ok(new SuccessResponse("Successfully edited a stock entry!"));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteEntry(@RequestParam("id") Long stockEntryId) {
        stockEntryService.deleteEntry(stockEntryId);
        return ResponseEntity.ok(new SuccessResponse("Successfully deleted a stock entry!"));
    }

    @PostMapping("/close")
    public ResponseEntity<?> closePosition(@RequestBody CloseStockEntryRequest closeStockEntryRequest) {
        stockEntryService.closePosition(closeStockEntryRequest);
        return ResponseEntity.ok(new SuccessResponse("Successfully closed position!"));
    }
}
