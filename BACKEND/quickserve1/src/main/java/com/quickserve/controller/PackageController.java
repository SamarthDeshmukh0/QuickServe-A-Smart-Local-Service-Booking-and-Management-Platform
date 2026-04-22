// ============================================================
// FILE: src/main/java/com/quickserve/controller/PackageController.java
// NEW FILE — REST endpoints for package bookings
// ============================================================

package com.quickserve.controller;

import com.quickserve.dto.request.PackageBookingRequest;
import com.quickserve.dto.response.GroupBookingResponse;
import com.quickserve.dto.response.PackageResponse;
import com.quickserve.service.PackageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/packages")
public class PackageController {

    private final PackageService packageService;

    public PackageController(PackageService packageService) {
        this.packageService = packageService;
    }

    // ── GET /api/packages — list all active packages ──────────
    @GetMapping
    public ResponseEntity<List<PackageResponse>> getAllPackages() {
        return ResponseEntity.ok(packageService.getAllPackages());
    }

    // ── GET /api/packages/{id} — single package details ───────
    @GetMapping("/{id}")
    public ResponseEntity<PackageResponse> getPackage(@PathVariable Long id) {
        return ResponseEntity.ok(packageService.getPackageById(id));
    }

    // ── POST /api/packages/book — create a group booking ──────
    @PostMapping("/book")
    public ResponseEntity<GroupBookingResponse> bookPackage(
            @Valid @RequestBody PackageBookingRequest req) {
        return ResponseEntity.ok(packageService.createGroupBooking(req));
    }

    // ── GET /api/packages/group/{groupId} — tracking page ─────
    @GetMapping("/group/{groupId}")
    public ResponseEntity<GroupBookingResponse> getGroupBooking(
            @PathVariable String groupId) {
        return ResponseEntity.ok(packageService.getGroupBooking(groupId));
    }

    // ── GET /api/packages/customer/{customerId} — history ─────
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<GroupBookingResponse>> getCustomerGroupBookings(
            @PathVariable Long customerId) {
        return ResponseEntity.ok(packageService.getCustomerGroupBookings(customerId));
    }

    // ── POST /api/packages/seed — seed default packages ───────
    // Call this ONCE after deployment to populate the packages table
    @PostMapping("/seed")
    public ResponseEntity<String> seed() {
        packageService.seedPackages();
        return ResponseEntity.ok("Packages seeded successfully");
    }
}