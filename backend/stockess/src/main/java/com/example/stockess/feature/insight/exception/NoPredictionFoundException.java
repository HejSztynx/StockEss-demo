package com.example.stockess.feature.insight.exception;

import com.example.stockess.feature.util.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class NoPredictionFoundException extends ApiException {
    public NoPredictionFoundException() {
        super("No prediction found");
    }
}
