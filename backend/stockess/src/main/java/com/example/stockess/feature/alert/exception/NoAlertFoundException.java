package com.example.stockess.feature.alert.exception;

import com.example.stockess.feature.util.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class NoAlertFoundException extends ApiException {
    public NoAlertFoundException() {
        super("No alert found");
    }
}
