package com.example.stockess.feature.insight.service;

import com.example.stockess.feature.company.model.Company;
import com.example.stockess.feature.company.repository.CompanyRepository;
import com.example.stockess.feature.company.service.CompanyService;
import com.example.stockess.feature.insight.exception.NoPredictionFoundException;
import com.example.stockess.feature.insight.model.Prediction;
import com.example.stockess.feature.insight.model.Price;
import com.example.stockess.feature.insight.model.dto.OHLCDataDto;
import com.example.stockess.feature.insight.model.dto.PriceHistoryDto;
import com.example.stockess.feature.insight.model.dto.SinglePredictionDto;
import com.example.stockess.feature.insight.model.dto.current.CurrentPricesDto;
import com.example.stockess.feature.insight.repository.PredictionRepository;
import com.example.stockess.feature.insight.repository.PriceRepository;
import com.example.stockess.feature.insight.util.PriceMapper;
import com.example.stockess.feature.insight.util.SinglePredictionCreator;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
@Transactional(readOnly = true)
public class StockPricesService {

    private final CompanyService companyService;
    private final PriceRepository priceRepository;
    private final PredictionRepository predictionRepository;
    private final CompanyRepository companyRepository;
    private final SinglePredictionCreator singlePredictionCreator;

    public SinglePredictionDto fetchStockPricesPrediction(String ticker, String period) {
        Company company = companyService.getById(ticker);

        Optional<Prediction> latestPredictionOpt = predictionRepository
                .findFirstById_CompanyOrderById_DateDesc(company);

        Prediction latestPrediction = latestPredictionOpt.orElseThrow(NoPredictionFoundException::new);
        return singlePredictionCreator.getSinglePredictionDto(period, latestPrediction);
    }

    public PriceHistoryDto getStockPricesData(String ticker) {
        Company company = companyService.getById(ticker);
        PriceMapper priceMapper = new PriceMapper(company);

        List<OHLCDataDto> pricesDto = priceRepository.findAllById_Company(company)
                .stream()
                .map(priceMapper::toOHLCDataDto)
                .toList();
        PriceHistoryDto priceHistoryDto = new PriceHistoryDto();
        priceHistoryDto.setOhlcHistory(pricesDto);

        return priceHistoryDto;
    }

    public CurrentPricesDto getCurrentStockPrices() {
        CurrentPricesDto currentPricesDto = new CurrentPricesDto();

        for (Company company : companyRepository.findAll()) {
            Optional<Price> latestPrice = priceRepository
                    .findFirstById_CompanyOrderById_DateDesc(company);

            latestPrice.ifPresent(price ->
                    currentPricesDto.addPattern(
                            company.getId(),
                            price.getClose()
                    )
            );
        }

        return currentPricesDto;
    }
}
