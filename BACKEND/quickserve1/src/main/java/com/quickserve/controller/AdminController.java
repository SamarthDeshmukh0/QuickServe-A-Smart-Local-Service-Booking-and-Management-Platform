// ============================================================
// FILE: src/main/java/com/quickserve/controller/AdminController.java
// ============================================================

package com.quickserve.controller;

import com.quickserve.dto.response.AnalyticsResponse;
import com.quickserve.dto.response.BookingResponse;
import com.quickserve.dto.response.ProviderResponse;
import com.quickserve.model.ProviderBadge;
import com.quickserve.service.AdminService;
import com.quickserve.service.BadgeService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final BadgeService badgeService;

    public AdminController(AdminService adminService,
    						BadgeService badgeService) {
		super();
		this.adminService = adminService;
		this.badgeService=badgeService;
	}

	@GetMapping("/providers")
    public ResponseEntity<List<ProviderResponse>> getAllProviders() {
        return ResponseEntity.ok(adminService.getAllProviders());
    }

    @PutMapping("/providers/{id}/approve")
    public ResponseEntity<ProviderResponse> approve(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approveProvider(id));
    }

    @PutMapping("/providers/{id}/reject")
    public ResponseEntity<ProviderResponse> reject(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.rejectProvider(id));
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(adminService.getAllBookings());
    }

    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsResponse> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }

    @GetMapping("/customers")
    public ResponseEntity<?> getAllCustomers() {
        return ResponseEntity.ok(adminService.getAllBookings()); // returns booking context
    }
    
 
}