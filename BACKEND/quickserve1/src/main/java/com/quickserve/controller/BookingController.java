// ============================================================
// FILE: src/main/java/com/quickserve/controller/BookingController.java
// ============================================================

/*
package com.quickserve.controller;

import com.quickserve.dto.request.BookingRequest;
import com.quickserve.dto.request.CompleteBookingRequest;
import com.quickserve.dto.request.UrgentBookingRequest;
import com.quickserve.dto.response.BookingResponse;
import com.quickserve.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
//@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    

    public BookingController(BookingService bookingService) {
		super();
		this.bookingService = bookingService;
	}

    //normal-booking..
	@PostMapping
    public ResponseEntity<BookingResponse> create(@Valid @RequestBody BookingRequest req) {
        return ResponseEntity.ok(bookingService.createBooking(req));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<BookingResponse>> getCustomerBookings(@PathVariable Long customerId) {
        return ResponseEntity.ok(bookingService.getCustomerBookings(customerId));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<BookingResponse>> getProviderBookings(@PathVariable Long providerId) {
        return ResponseEntity.ok(bookingService.getProviderBookings(providerId));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<BookingResponse> accept(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.acceptBooking(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<BookingResponse> reject(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.rejectBooking(id));
    }

    @PutMapping("/{id}/start")
    public ResponseEntity<BookingResponse> start(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.startBooking(id));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<BookingResponse> complete(@PathVariable Long id,
    		@Valid @RequestBody CompleteBookingRequest req) {
    	return ResponseEntity.ok(bookingService.completeBooking(id, req));
    
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }
    
    // Urgent booking endpoints ─────────────────────────

    // Customer creates urgent booking — no slot, no specific provider
    @PostMapping("/urgent")
    public ResponseEntity<BookingResponse> createUrgent(
            @Valid @RequestBody UrgentBookingRequest req) {
        return ResponseEntity.ok(bookingService.createUrgentBooking(req));
    }

    // Provider accepts an urgent booking — first-accept-wins
    // Authentication object gives us the logged-in provider's ID
//    @PutMapping("/{id}/urgent-accept")
//    public ResponseEntity<BookingResponse> acceptUrgent(
//            @PathVariable Long id,
//            Authentication auth) {
//        // Provider ID is stored in auth.getDetails() by JwtAuthFilter
//        Long providerId = (Long) auth.getDetails();
//        return ResponseEntity.ok(bookingService.acceptUrgentBooking(id, providerId));
//    }
    
    @PutMapping("/{id}/urgent-accept")
    public ResponseEntity<BookingResponse> acceptUrgent(
            @PathVariable Long id,
            @RequestParam Long providerId) {
        return ResponseEntity.ok(bookingService.acceptUrgentBooking(id, providerId));
    }

    // Provider fetches all open urgent bookings (their city + any service)
    @GetMapping("/urgent/open")
    public ResponseEntity<List<BookingResponse>> getOpenUrgent() {
        return ResponseEntity.ok(bookingService.getOpenUrgentBookings());
    }
}

*/

// ============================================================
// FILE: src/main/java/com/quickserve/controller/BookingController.java
// FULL REPLACEMENT — no Lombok, all endpoints including urgent
// ============================================================

package com.quickserve.controller;

import com.quickserve.dto.request.BookingRequest;
import com.quickserve.dto.request.CompleteBookingRequest;
import com.quickserve.dto.request.UrgentBookingRequest;
import com.quickserve.dto.response.BookingResponse;
import com.quickserve.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> create(
            @Valid @RequestBody BookingRequest req) {
        return ResponseEntity.ok(bookingService.createBooking(req));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<BookingResponse>> getCustomerBookings(
            @PathVariable Long customerId) {
        return ResponseEntity.ok(bookingService.getCustomerBookings(customerId));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<BookingResponse>> getProviderBookings(
            @PathVariable Long providerId) {
        return ResponseEntity.ok(bookingService.getProviderBookings(providerId));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<BookingResponse> accept(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.acceptBooking(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<BookingResponse> reject(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.rejectBooking(id));
    }

    @PutMapping("/{id}/start")
    public ResponseEntity<BookingResponse> start(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.startBooking(id));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<BookingResponse> complete(
            @PathVariable Long id,
            @Valid @RequestBody CompleteBookingRequest req) {
        return ResponseEntity.ok(bookingService.completeBooking(id, req));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }

    // ── Urgent booking endpoints ──────────────────────────────

    @PostMapping("/urgent")
    public ResponseEntity<BookingResponse> createUrgent(
            @Valid @RequestBody UrgentBookingRequest req) {
        return ResponseEntity.ok(bookingService.createUrgentBooking(req));
    }

    @PutMapping("/{id}/urgent-accept")
    public ResponseEntity<BookingResponse> acceptUrgent(
            @PathVariable Long id,
            @RequestParam Long providerId) {
        return ResponseEntity.ok(bookingService.acceptUrgentBooking(id, providerId));
    }

    @GetMapping("/urgent/open")
    public ResponseEntity<List<BookingResponse>> getOpenUrgent() {
        return ResponseEntity.ok(bookingService.getOpenUrgentBookings());
    }
}