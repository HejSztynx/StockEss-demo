package com.example.stockess.feature.insight.service;

import com.example.stockess.feature.company.service.CompanyService;
import com.example.stockess.feature.insight.model.dto.PredictionDto;
import com.example.stockess.feature.insight.repository.PredictionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@AllArgsConstructor
@Service
@Transactional(readOnly = true)
public class PredictionHistoryService {

    private final PredictionRepository predictionRepository;
    private final CompanyService companyService;

    public List<PredictionDto> getPredictionHistory(String ticker) {
        companyService.getById(ticker);
        return predictionRepository.findAllById_CompanyTickerOrderById_PredictionDateDesc(ticker).stream()
                .map(PredictionDto::from)
                .toList();
    }
}
