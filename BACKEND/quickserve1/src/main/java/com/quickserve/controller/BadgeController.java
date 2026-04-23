// ============================================================
// FILE: src/main/java/com/quickserve/controller/BadgeController.java
// ============================================================

package com.quickserve.controller;

import com.quickserve.dto.request.BadgeAssignRequest;
import com.quickserve.dto.response.BadgeResponse;
import com.quickserve.service.BadgeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class BadgeController {

    private final BadgeService badgeService;

    public BadgeController(BadgeService badgeService) {
		super();
		this.badgeService = badgeService;
	}
    

	public BadgeService getBadgeService() {
		return badgeService;
	}


	// ── Public: get all badges for a provider (shown on cards) ──
    @GetMapping("/api/providers/{providerId}/badges")
    public ResponseEntity<List<BadgeResponse>> getBadges(@PathVariable Long providerId) {
        return ResponseEntity.ok(badgeService.getBadgesForProvider(providerId));
    }

    // ── Admin: assign a badge ───────────────────────────────
    @PostMapping("/api/admin/providers/{providerId}/badges")
    public ResponseEntity<BadgeResponse> assignBadge(
            @PathVariable Long providerId,
            @Valid @RequestBody BadgeAssignRequest req) {
        return ResponseEntity.ok(badgeService.assignBadge(providerId, req.getBadgeType()));
    }

    // ── Admin: revoke a badge ────────────────────────────────
    @DeleteMapping("/api/admin/providers/{providerId}/badges/{badgeType}")
    public ResponseEntity<Void> revokeBadge(
            @PathVariable Long providerId,
            @PathVariable String badgeType) {
        badgeService.revokeBadge(providerId,
                com.quickserve.model.ProviderBadge.BadgeType.valueOf(badgeType));
        return ResponseEntity.noContent().build();
    }
}