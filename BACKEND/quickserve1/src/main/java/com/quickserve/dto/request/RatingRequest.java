// ============================================================
// FILE: src/main/java/com/quickserve/dto/request/RatingRequest.java
// ============================================================

package com.quickserve.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RatingRequest {

    @NotNull
    private Long bookingId;

    @NotNull
    private Long customerId;

    @NotNull
    private Long providerId;

    @NotNull
    @Min(1) @Max(5)
    private Integer stars;

    @Size(max = 300)
    private String review;

	public RatingRequest(@NotNull Long bookingId, @NotNull Long customerId, @NotNull Long providerId,
			@NotNull @Min(1) @Max(5) Integer stars, @Size(max = 300) String review) {
		super();
		this.bookingId = bookingId;
		this.customerId = customerId;
		this.providerId = providerId;
		this.stars = stars;
		this.review = review;
	}

	public Long getBookingId() {
		return bookingId;
	}

	public void setBookingId(Long bookingId) {
		this.bookingId = bookingId;
	}

	public Long getCustomerId() {
		return customerId;
	}

	public void setCustomerId(Long customerId) {
		this.customerId = customerId;
	}

	public Long getProviderId() {
		return providerId;
	}

	public void setProviderId(Long providerId) {
		this.providerId = providerId;
	}

	public Integer getStars() {
		return stars;
	}

	public void setStars(Integer stars) {
		this.stars = stars;
	}

	public String getReview() {
		return review;
	}

	public void setReview(String review) {
		this.review = review;
	}
    
    
}