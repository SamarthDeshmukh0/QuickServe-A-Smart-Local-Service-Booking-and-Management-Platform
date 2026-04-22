// ============================================================
// FILE: src/main/java/com/quickserve/controller/RatingController.java
// ============================================================

package com.quickserve.controller;

import com.quickserve.dto.request.RatingRequest;
import com.quickserve.dto.response.RatingResponse;
import com.quickserve.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;
    

    public RatingController(RatingService ratingService) {
		super();
		this.ratingService = ratingService;
	}

	@PostMapping
    public ResponseEntity<RatingResponse> submitRating(@Valid @RequestBody RatingRequest req) {
        return ResponseEntity.ok(ratingService.submitRating(req));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<RatingResponse>> getProviderRatings(@PathVariable Long providerId) {
        return ResponseEntity.ok(ratingService.getProviderRatings(providerId));
    }
}