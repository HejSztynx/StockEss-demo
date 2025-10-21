package com.example.stockess.feature.alert.model.util;

import com.example.stockess.feature.insight.model.dto.OHLCDataDto;

public record CurrentPastPrices(OHLCDataDto currentPrice, OHLCDataDto pastPrice) {}