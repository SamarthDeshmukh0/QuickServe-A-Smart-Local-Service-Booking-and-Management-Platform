// ============================================================
// FILE: src/main/java/com/quickserve/model/Earnings.java
// ============================================================

package com.quickserve.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "earnings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Earnings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "provider_id", nullable = false)
    private Long providerId;

    @Column(name = "booking_id", nullable = false)
    private Long bookingId;

    @Column(nullable = false)
    private Double amount;

    @Column(name = "earned_at")
    private LocalDateTime earnedAt;
    
    public Earnings() {}
    public Earnings(Long id, Long providerId, Long bookingId, Double amount, LocalDateTime earnedAt ) {
    	this.id=id;
    	this.providerId=providerId;
    	this.bookingId=bookingId;
    	this.amount=amount;
    	this.earnedAt=earnedAt;
    }
    
    

    public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getProviderId() {
		return providerId;
	}
	public void setProviderId(Long providerId) {
		this.providerId = providerId;
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
	public LocalDateTime getEarnedAt() {
		return earnedAt;
	}
	public void setEarnedAt(LocalDateTime earnedAt) {
		this.earnedAt = earnedAt;
	}
	@PrePersist
    protected void onCreate() {
        earnedAt = LocalDateTime.now();
              
    }
}