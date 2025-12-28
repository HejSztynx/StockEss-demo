package com.example.stockess.feature.alert.controller;

import com.example.stockess.feature.alert.dto.request.AlertDtoRequest;
import com.example.stockess.feature.alert.dto.response.AlertDto;
import com.example.stockess.feature.alert.service.AlertService;
import com.example.stockess.feature.util.response.SuccessResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/alert")
public class AlertController {

    private final AlertService alertService;

    @GetMapping("/all")
    public ResponseEntity<List<AlertDto>> getAll() {
        List<AlertDto> all = alertService.getAll();

        return ResponseEntity.ok().body(all);
    }

    @PutMapping("/create")
    public ResponseEntity<?> createAlert(@Valid @RequestBody AlertDtoRequest request) {
        alertService.createAlert(request);

        return ResponseEntity.ok(new SuccessResponse("Successfully created an alert"));
    }

    @PostMapping("/activate")
    public ResponseEntity<?> activateAlert(@RequestParam("alert_id") Long id) {
        alertService.activateAlert(id);

        return ResponseEntity.ok(new SuccessResponse("Successfully activated an alert"));
    }

    @PostMapping("/deactivate")
    public ResponseEntity<?> deactivateAlert(@RequestParam("alert_id") Long id) {
        alertService.deactivateAlert(id);

        return ResponseEntity.ok(new SuccessResponse("Successfully deactivated an alert"));
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateAlert(@Valid @RequestBody AlertDtoRequest request) {
        alertService.updateAlert(request);

        return ResponseEntity.ok(new SuccessResponse("Successfully updated an alert"));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteAlert(@RequestParam("alert_id") Long id) {
        alertService.deleteAlert(id);

        return ResponseEntity.ok(new SuccessResponse("Successfully deleted an alert"));
    }
}
