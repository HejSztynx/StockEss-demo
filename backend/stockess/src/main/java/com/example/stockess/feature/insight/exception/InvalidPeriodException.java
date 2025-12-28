package com.example.stockess.feature.insight.exception;

import com.example.stockess.feature.util.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidPeriodException extends ApiException {
    public InvalidPeriodException() {
        super("Provided invalid period");
    }
}
