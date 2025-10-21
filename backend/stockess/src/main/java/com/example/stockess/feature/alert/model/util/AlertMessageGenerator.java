package com.example.stockess.feature.alert.model.util;

import com.example.stockess.feature.company.model.Company;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class AlertMessageGenerator {

    public String generate(Company company, LocalDate day, List<String> messages) {
        String header = String.format("%s — on %s", company.getFullName(), day);
        String body = String.join("\n", messages);
        return header + "\n" + body;
    }
}
