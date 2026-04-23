// ============================================================
// FILE: src/main/java/com/quickserve/controller/PaymentController.java
// ============================================================

package com.quickserve.controller;

import com.quickserve.dto.request.PaymentRequest;
import com.quickserve.dto.response.PaymentResponse;
import com.quickserve.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")

public class PaymentController {

    private final PaymentService paymentService;
    

    public PaymentController(PaymentService paymentService) {
		super();
		this.paymentService = paymentService;
	}

	@PostMapping
    public ResponseEntity<PaymentResponse> makePayment(@Valid @RequestBody PaymentRequest req) {
        return ResponseEntity.ok(paymentService.makePayment(req));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<PaymentResponse> getByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(paymentService.getPaymentByBooking(bookingId));
    }
}