// ============================================================
// FILE: src/main/java/com/quickserve/dto/request/BadgeAssignRequest.java
// ============================================================

package com.quickserve.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import com.quickserve.model.ProviderBadge;

//@Data
public class BadgeAssignRequest {

    @NotNull(message = "Badge type is required")
    private ProviderBadge.BadgeType badgeType;

    public BadgeAssignRequest() {
    }
    public BadgeAssignRequest(@NotNull(message = "Badge type is required") ProviderBadge.BadgeType badgeType) {
		super();
		this.badgeType = badgeType;
	}

	public ProviderBadge.BadgeType getBadgeType() {
		return badgeType;
	}

	public void setBadgeType(ProviderBadge.BadgeType badgeType) {
		this.badgeType = badgeType;
	}
    
}