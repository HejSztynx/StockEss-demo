package com.example.stockess.feature.insight.model;

import com.example.stockess.feature.insight.model.dto.OHLCDataDto;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "prices")
@NoArgsConstructor
@Setter
@Getter
public class Price {

    @EmbeddedId
    private CompanyDateId id;

    @Column(nullable = false)
    private Float open;

    @Column(nullable = false)
    private Float high;

    @Column(nullable = false)
    private Float low;

    @Column(nullable = false)
    private Float close;
}
