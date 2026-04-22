// ============================================================
// FILE: src/main/java/com/quickserve/dto/request/PaymentRequest.java
// ============================================================

package com.quickserve.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class PaymentRequest {

    @NotNull
    private Long bookingId;

    @NotNull
    @Positive
    private Double amount;

    @NotBlank
    private String method;
    
    public PaymentRequest(Long bookingId, Double amount, String method) {
    	this.bookingId=bookingId;
    	this.amount=amount;
    	this.method=method;
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
}