// ============================================================
// FILE: src/main/java/com/quickserve/controller/SlotController.java
// ============================================================

package com.quickserve.controller;

import com.quickserve.dto.request.SlotRequest;
import com.quickserve.dto.response.SlotResponse;
import com.quickserve.service.SlotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
public class SlotController {

    private final SlotService slotService;
    

    public SlotController(SlotService slotService) {
		super();
		this.slotService = slotService;
	}

	@GetMapping("/available")
    public ResponseEntity<List<SlotResponse>> getAvailable(
            @RequestParam Long providerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(slotService.getAvailableSlots(providerId, date));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<SlotResponse>> getProviderSlots(@PathVariable Long providerId) {
        return ResponseEntity.ok(slotService.getProviderSlots(providerId));
    }

    @PostMapping
    public ResponseEntity<List<SlotResponse>> create(@Valid @RequestBody SlotRequest req) {
        return ResponseEntity.ok(slotService.createSlots(req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        slotService.deleteSlot(id);
        return ResponseEntity.noContent().build();
    }
}