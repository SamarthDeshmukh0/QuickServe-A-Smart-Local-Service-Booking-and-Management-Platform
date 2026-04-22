// ============================================================
// FILE: src/main/java/com/quickserve/model/Payment.java
// ============================================================

package com.quickserve.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_id", nullable = false, unique = true)
    private Long bookingId;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String method;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.SUCCESS;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;
    
    
    public Payment() {}
    public Payment(Long id, Long bookingId, Double amount, String method, LocalDateTime paidAt) {
    	this.id=id;
    	this.bookingId=bookingId;
    	this.amount=amount;
    	this.method=method;
    	this.paidAt=paidAt;
    }

    public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getBookingId() {
		return bookingId;
	}
	public void setBookingId(Long bookingId) {
		this.bookingId = bookingId;
	}
	public Double getAmount() {
		return amount;
	}
	public void setAmount(Double amount) {
		this.amount = amount;
	}
	public String getMethod() {
		return method;
	}
	public void setMethod(String method) {
		this.method = method;
	}
	public PaymentStatus getPaymentStatus() {
		return paymentStatus;
	}
	public void setPaymentStatus(PaymentStatus paymentStatus) {
		this.paymentStatus = paymentStatus;
	}
	public LocalDateTime getPaidAt() {
		return paidAt;
	}
	public void setPaidAt(LocalDateTime paidAt) {
		this.paidAt = paidAt;
	}
	@PrePersist
    protected void onCreate() {
        paidAt = LocalDateTime.now();
    }

    public enum PaymentStatus {
        SUCCESS, FAILED, PENDING
    }
}