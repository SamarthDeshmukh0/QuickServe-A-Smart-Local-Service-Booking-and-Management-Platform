// ============================================================
// FILE: src/main/java/com/quickserve/dto/response/BadgeResponse.java
// ============================================================

package com.quickserve.dto.response;


import java.time.LocalDateTime;


public class BadgeResponse {
    private Long id;
    private String badgeType;    // e.g. "TOP_RATED"
    private String label;        // e.g. "Top Rated"
	private String color;        // Tailwind color class for frontend
    private String icon;         // emoji icon
    private String assignedBy;
    private LocalDateTime assignedAt;
    
    
    public BadgeResponse() {}
    public BadgeResponse(Long id, String badgeType, String label, String color, String icon, String assignedBy,
			LocalDateTime assignedAt) {
		super();
		this.id = id;
		this.badgeType = badgeType;
		this.label = label;
		this.color = color;
		this.icon = icon;
		this.assignedBy = assignedBy;
		this.assignedAt = assignedAt;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getBadgeType() {
		return badgeType;
	}
	public void setBadgeType(String badgeType) {
		this.badgeType = badgeType;
	}
	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public String getIcon() {
		return icon;
	}
	public void setIcon(String icon) {
		this.icon = icon;
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
    
    
}