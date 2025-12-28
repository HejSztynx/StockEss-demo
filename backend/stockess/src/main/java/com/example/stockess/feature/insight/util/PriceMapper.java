package com.example.stockess.feature.insight.util;

import com.example.stockess.feature.company.model.Company;
import com.example.stockess.feature.insight.model.CompanyDateId;
import com.example.stockess.feature.insight.model.Price;
import com.example.stockess.feature.insight.model.dto.OHLCDataDto;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class PriceMapper {

    private final Company company;

    public Price fromOHLCDataDto(OHLCDataDto dto) {
        Price price = new Price();

        CompanyDateId id = new CompanyDateId();
        id.setCompany(company);
        id.setDate(dto.getDate());
        price.setId(id);

        price.setOpen(dto.getOpen());
        price.setHigh(dto.getHigh());
        price.setLow(dto.getLow());
        price.setClose(dto.getClose());

        return price;
    }

    public OHLCDataDto toOHLCDataDto(Price price) {
        OHLCDataDto ohlcDataDto = new OHLCDataDto();
        ohlcDataDto.setDate(price.getId().getDate());
        ohlcDataDto.setOpen(price.getOpen());
        ohlcDataDto.setHigh(price.getHigh());
        ohlcDataDto.setLow(price.getLow());
        ohlcDataDto.setClose(price.getClose());

        return ohlcDataDto;
    }
}
