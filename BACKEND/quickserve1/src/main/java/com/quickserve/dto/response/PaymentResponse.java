// ============================================================
// FILE: src/main/java/com/quickserve/dto/response/PaymentResponse.java
// ============================================================

package com.quickserve.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentResponse {
    private Long id;
	private Long bookingId;
    private Double amount;
    private String method;
    private String paymentStatus;
    private LocalDateTime paidAt;
    
    //no-args constr
    public PaymentResponse() {}
    //constructor
    public PaymentResponse(Long id, Long bookingId, Double amount, String method, String paymentStatus,
			LocalDateTime paidAt) {
		super();
		this.id = id;
		this.bookingId = bookingId;
		this.amount = amount;
		this.method = method;
		this.paymentStatus = paymentStatus;
		this.paidAt = paidAt;
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

	public String getPaymentStatus() {
		return paymentStatus;
	}

	public void setPaymentStatus(String paymentStatus) {
		this.paymentStatus = paymentStatus;
	}

	public LocalDateTime getPaidAt() {
		return paidAt;
	}

	public void setPaidAt(LocalDateTime paidAt) {
		this.paidAt = paidAt;
	}
    
}