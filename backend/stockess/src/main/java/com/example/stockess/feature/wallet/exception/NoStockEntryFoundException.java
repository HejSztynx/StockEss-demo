package com.example.stockess.feature.wallet.exception;

import com.example.stockess.feature.util.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class NoStockEntryFoundException extends ApiException {
    public NoStockEntryFoundException() {
        super("No stock entry found");
    }
}
