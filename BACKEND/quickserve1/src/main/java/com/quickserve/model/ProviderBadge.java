// ============================================================
// FILE: src/main/java/com/quickserve/model/ProviderBadge.java
// ============================================================

package com.quickserve.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "provider_badges",
       uniqueConstraints = @UniqueConstraint(columnNames = {"provider_id", "badge_type"}))
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
public class ProviderBadge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "provider_id", nullable = false)
    private Long providerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "badge_type", nullable = false)
    private BadgeType badgeType;

    @Column(name = "assigned_by")
    private String assignedBy;  // "ADMIN" or "SYSTEM"

    @Column(name = "assigned_at", updatable = false)
    private LocalDateTime assignedAt;

    @PrePersist
    protected void onCreate() {
        assignedAt = LocalDateTime.now();  
    }
    
    public ProviderBadge() {}
    public ProviderBadge(Long id, Long providerId, BadgeType badgeType, 
    				String assignedBy, LocalDateTime assignedAt) {
		super();
		this.id = id;
		this.providerId = providerId;
		this.badgeType = badgeType;
		this.assignedBy = assignedBy;
		this.assignedAt = assignedAt;
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

	public BadgeType getBadgeType() {
		return badgeType;
	}

	public void setBadgeType(BadgeType badgeType) {
		this.badgeType = badgeType;
	}

	public String getAssignedBy() {
		return assignedBy;
	}

	public void setAssignedBy(String assignedBy) {
		this.assignedBy = assignedBy;
	}

	public LocalDateTime getAssignedAt() {
		return assignedAt;
	}

	public void setAssignedAt(LocalDateTime assignedAt) {
		this.assignedAt = assignedAt;
	}




	public enum BadgeType {
        BACKGROUND_CHECKED,   // manual — admin only
        CERTIFIED_PROFESSIONAL, // manual — admin only
        TOP_RATED,            // auto — avg_rating >= 4.5
        VETERAN,              // auto — years_experience >= 5
        CENTURY               // auto — completed_jobs >= 100
    }
}