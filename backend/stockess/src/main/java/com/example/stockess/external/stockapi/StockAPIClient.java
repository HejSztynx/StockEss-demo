package com.example.stockess.external.stockapi;

import com.example.stockess.configuration.properties.ExternalApiProperties;
import com.example.stockess.feature.insight.model.dto.SinglePredictionDto;
import com.example.stockess.feature.insight.model.dto.current.CurrentPricesDto;
import com.example.stockess.feature.insight.model.dto.formation.CandlestickPatternsDto;
import com.example.stockess.feature.insight.model.dto.report.FinancialReportDto;
import com.example.stockess.feature.insight.model.dto.update.PredictionHistoryUpdateDto;
import com.example.stockess.feature.insight.model.dto.PriceHistoryDto;
import com.example.stockess.feature.util.response.ErrorResponse;
import lombok.AllArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@AllArgsConstructor
@Component
public class StockAPIClient {

    private final RestTemplate restTemplate;
    private final ExternalApiProperties apiProperties;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public boolean ping() {
        String url = apiProperties.getRootUrl() + "/ping";
        System.out.println("Probuje pingowac: " + url);
        return getResponseEntity(url).getStatusCode().value() == 200;
    }

    public PriceHistoryDto fetchHistoricPricesData(String ticker, LocalDate lastKnownDate) {
        String formatted = lastKnownDate.format(formatter);
        String url = apiProperties.getRootUrl() + "/getHistoricData?ticker=" + ticker + "&last_known_date=" + formatted;
        ResponseEntity<PriceHistoryDto> response = getMappedResponse(url, new ParameterizedTypeReference<>() {});
        return response.getBody();
    }

    public List<String> fetchTickers() {
        String url = apiProperties.getRootUrl() + "/tickers";
        ResponseEntity<List<String>> response = getMappedResponse(url, new ParameterizedTypeReference<>() {});
        return response.getBody();
    }

    public PredictionHistoryUpdateDto fetchUpdate(String ticker, LocalDate lastKnownDate) {
        String formatted = lastKnownDate.format(formatter);
        String url = apiProperties.getRootUrl() + "/newData?ticker=" + ticker + "&last_known_date=" + formatted;
        ResponseEntity<PredictionHistoryUpdateDto> response = getMappedResponse(url, new ParameterizedTypeReference<>() {});
        return response.getBody();
    }

    public CandlestickPatternsDto fetchCandlestickFormations(String ticker) {
        String url = apiProperties.getRootUrl() + "/getFormations?ticker=" + ticker;
        ResponseEntity<CandlestickPatternsDto> response = getMappedResponse(url, new ParameterizedTypeReference<>() {});
        return response.getBody();
    }

    public FinancialReportDto fetchReports(String ticker) {
        String url = apiProperties.getRootUrl() + "/reports" + "?ticker=" + ticker;
        ResponseEntity<FinancialReportDto> response = getMappedResponse(url, new ParameterizedTypeReference<>() {});
        return response.getBody();
    }

    private ResponseEntity<?> getResponseEntity(String url) {
        try {
            return restTemplate.getForEntity(url, String.class);

        } catch (HttpStatusCodeException e) {
            return ResponseEntity
                    .status(e.getStatusCode())
                    .body(e.getResponseBodyAsString());

        } catch (RestClientException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    private <T> ResponseEntity<T> getMappedResponse(String url, ParameterizedTypeReference<T> typeReference) {
        return restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                typeReference
        );
    }
}
