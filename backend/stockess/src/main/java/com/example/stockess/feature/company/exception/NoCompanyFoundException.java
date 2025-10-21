package com.example.stockess.feature.company.exception;

import com.example.stockess.feature.util.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class NoCompanyFoundException extends ApiException {
    public NoCompanyFoundException() {
        super("No company found");
    }
}
