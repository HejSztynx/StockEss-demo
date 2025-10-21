package com.example.stockess.feature.wallet.controller;

import com.example.stockess.feature.util.response.SuccessResponse;
import com.example.stockess.feature.wallet.dto.request.AddWalletRequest;
import com.example.stockess.feature.wallet.service.WalletService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/wallet")
public class WalletController {

    private final WalletService walletService;

    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(walletService.getAll());
    }

    @PutMapping("/add")
    public ResponseEntity<?> addWallet(@Valid @RequestBody AddWalletRequest addWalletRequest) {
        walletService.addWallet(addWalletRequest);
        return ResponseEntity.ok(new SuccessResponse("Successfully added a wallet!"));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteWallet(@RequestParam("wallet_id") Long walletId) {
        walletService.deleteWallet(walletId);
        return ResponseEntity.ok(new SuccessResponse("Successfully deleted a wallet!"));
    }
}
