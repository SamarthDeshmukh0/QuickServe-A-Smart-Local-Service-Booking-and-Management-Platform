// ============================================================
// FILE: src/main/java/com/quickserve/service/PaymentService.java
// ============================================================

package com.quickserve.service;

import com.quickserve.dto.request.PaymentRequest;
import com.quickserve.dto.response.PaymentResponse;
import com.quickserve.model.Booking;
import com.quickserve.model.Earnings;
import com.quickserve.model.Payment;
import com.quickserve.repository.BookingRepository;
import com.quickserve.repository.EarningsRepository;
import com.quickserve.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
//@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final EarningsRepository earningsRepository;
    private final BookingService bookingService;
    
    public PaymentService(PaymentRepository paymentRepository,
     BookingRepository bookingRepository,
    EarningsRepository earningsRepository,
     BookingService bookingService) {
    	this.paymentRepository=paymentRepository;
    	this.bookingRepository=bookingRepository;
    	this.earningsRepository=earningsRepository;
    	this.bookingService=bookingService;
    }

    // ─── Simulate payment ────────────────────────────────────
    @Transactional
    public PaymentResponse makePayment(PaymentRequest req) {
        Booking booking = bookingRepository.findById(req.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != Booking.Status.COMPLETED) {
            throw new RuntimeException("Booking must be COMPLETED before payment");
        }

        // Prevent duplicate payment
        if (paymentRepository.findByBookingId(req.getBookingId()).isPresent()) {
            throw new RuntimeException("Payment already made for this booking");
        }

        Payment payment = new Payment();
        payment.setBookingId(req.getBookingId());
        payment.setAmount(req.getAmount());
        payment.setMethod(req.getMethod());
        payment.setPaymentStatus(Payment.PaymentStatus.SUCCESS);
        
        Payment savedPayment = paymentRepository.save(payment);

        // Update booking status to PAID
        bookingService.markAsPaid(req.getBookingId());
        
        // ── CHANGED: provider earns finalAmount (provider-set price)
        // not the original base amount estimate
        double providerEarning = booking.getFinalAmount() != null
                ? booking.getFinalAmount()
                : booking.getAmount();

        // Record earnings for provider
        Earnings earnings = new Earnings();
        earnings.setProviderId(booking.getProviderId());
        earnings.setBookingId(booking.getId());
        earnings.setAmount(providerEarning);
        
        earningsRepository.save(earnings);

        return toResponse(savedPayment);
    }

    // ─── Get payment by booking ──────────────────────────────
    public PaymentResponse getPaymentByBooking(Long bookingId) {
        Payment p = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return toResponse(p);
    }

    private PaymentResponse toResponse(Payment p) {
    	PaymentResponse res = new PaymentResponse();

    	res.setId(p.getId());
    	res.setBookingId(p.getBookingId());
    	res.setAmount(p.getAmount());
    	res.setMethod(p.getMethod());
    	res.setPaymentStatus(p.getPaymentStatus().name());
    	res.setPaidAt(p.getPaidAt());

    	return res;
    }
}