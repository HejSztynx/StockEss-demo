package com.example.stockess.init.update;

import com.example.stockess.external.stockapi.StockAPIClient;
import com.example.stockess.feature.company.model.Company;
import com.example.stockess.feature.company.repository.CompanyRepository;
import com.example.stockess.feature.insight.model.Price;
import com.example.stockess.feature.insight.model.dto.PriceHistoryDto;
import com.example.stockess.feature.insight.repository.PriceRepository;
import com.example.stockess.feature.insight.util.PriceMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@Service
@Transactional
public class PriceUpdateService {

    private final PriceRepository priceRepository;
    private final StockAPIClient stockAPIClient;
    private final CompanyRepository companyRepository;

    public void runUpdate(LocalDate lastKnownDate) {
        List<Company> companies = companyRepository.findAll();

        System.out.println("PRICE Last date: " + lastKnownDate);

        for (int i = 0; i < companies.size(); i++) {
            Company company = companies.get(i);
            updateCompanyPrices(company, lastKnownDate);
            System.out.printf("(%d/%d) Updated prices for ticker: %s%n",
                    i + 1, companies.size(), company.getId());
        }
    }

    private void updateCompanyPrices(Company company, LocalDate lastKnownDate) {
        PriceMapper priceMapper = new PriceMapper(company);

        PriceHistoryDto priceHistoryDto = stockAPIClient.fetchHistoricPricesData(company.getId(), lastKnownDate);
        List<Price> prices = priceHistoryDto.getOhlcHistory()
                .stream()
                .map(priceMapper::fromOHLCDataDto)
                .toList();

        priceRepository.saveAll(prices);
    }
}
