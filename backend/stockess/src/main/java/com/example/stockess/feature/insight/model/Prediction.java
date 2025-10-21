package com.example.stockess.feature.insight.model;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "predictions")
@NoArgsConstructor
@Setter
@Getter
public class Prediction {

    @EmbeddedId
    private PredictionId id;

    @Column(nullable = false)
    private Double pastPrice;

    @Column(nullable = false)
    private Double prediction1m;

    @Column(nullable = false)
    private Double prediction3m;

    @Column(nullable = false)
    private Double prediction6m;

    @Column(nullable = false)
    private Double prediction1y;

    private Double realPrice1m;

    private Double realPrice3m;

    private Double realPrice6m;

    private Double realPrice1y;

    private Double surprise1m;

    private Double surprise3m;

    private Double surprise6m;

    private Double surprise1y;
}
