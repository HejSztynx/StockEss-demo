package com.example.stockess.feature.alert.exception;

import com.example.stockess.feature.util.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class NoNotificationFoundException extends ApiException {
    public NoNotificationFoundException() {
        super("No notification found");
    }
}
