package com.example.stockess.feature.alert.dto.request;

import com.example.stockess.feature.alert.dto.ConditionDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class AlertDtoRequest {
    private Long id;

    @NotNull(message = "Field 'startDate' is required")
    private LocalDate startDate;

    @NotNull(message = "Field 'companies' is required")
    private List<String> companies;

    @NotNull(message = "Field 'once' is required")
    private Boolean once;

    @NotNull(message = "Field 'name' is required")
    @NotBlank(message = "Field 'name' cannot be blank")
    private String name;

    @NotNull(message = "Field 'conditions' is required")
    @Valid
    private List<ConditionDto> conditions;

    @NotNull(message = "Field 'active' is required")
    private Boolean active;
}
