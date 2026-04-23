// ============================================================
// FILE: src/main/java/com/quickserve/controller/ProviderController.java
// ============================================================

package com.quickserve.controller;

import com.quickserve.dto.request.ProfileUpdateRequest;
import com.quickserve.dto.response.EarningsResponse;
import com.quickserve.dto.response.ProviderResponse;
import com.quickserve.service.EarningsService;
import com.quickserve.service.ProviderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/providers")

public class ProviderController {

    private final ProviderService providerService;
    private final EarningsService earningsService;

    public ProviderController(ProviderService providerService, EarningsService earningsService) {
		super();
		this.providerService = providerService;
		this.earningsService = earningsService;
	}

	@GetMapping("/recommend")
    public ResponseEntity<List<ProviderResponse>> recommend(
            @RequestParam String city,
            @RequestParam String service) {
        return ResponseEntity.ok(providerService.getRecommendedProviders(city, service));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProviderResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(providerService.getProviderById(id));
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<ProviderResponse> updateProfile(@PathVariable Long id,
                                                           @RequestBody ProfileUpdateRequest req) {
        return ResponseEntity.ok(providerService.updateProfile(id, req));
    }

    @GetMapping("/{id}/earnings")
    public ResponseEntity<EarningsResponse> getEarnings(@PathVariable Long id) {
        return ResponseEntity.ok(earningsService.getEarnings(id));
    }
}