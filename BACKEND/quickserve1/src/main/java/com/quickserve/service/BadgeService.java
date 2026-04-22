// ============================================================
// FILE: src/main/java/com/quickserve/service/BadgeService.java
// ============================================================

package com.quickserve.service;

import com.quickserve.dto.response.BadgeResponse;
import com.quickserve.model.Provider;
import com.quickserve.model.ProviderBadge;
import com.quickserve.repository.BookingRepository;
import com.quickserve.repository.ProviderBadgeRepository;
import com.quickserve.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
//@RequiredArgsConstructor
public class BadgeService {

    private final ProviderBadgeRepository badgeRepository;
    private final ProviderRepository      providerRepository;
    private final BookingRepository       bookingRepository;
    
   
    public BadgeService(ProviderBadgeRepository badgeRepository, ProviderRepository providerRepository,
			BookingRepository bookingRepository) {
		super();
		this.badgeRepository = badgeRepository;
		this.providerRepository = providerRepository;
		this.bookingRepository = bookingRepository;
	}
    
    

	public ProviderBadgeRepository getBadgeRepository() {
		return badgeRepository;
	}

	public ProviderRepository getProviderRepository() {
		return providerRepository;
	}

	public BookingRepository getBookingRepository() {
		return bookingRepository;
	}

	public static Map<ProviderBadge.BadgeType, String[]> getBadgeMeta() {
		return BADGE_META;
	}



	// ── Badge metadata map ───────────────────────────────────
    // badgeType → [label, color, icon]
    private static final Map<ProviderBadge.BadgeType, String[]> BADGE_META = Map.of(
        ProviderBadge.BadgeType.BACKGROUND_CHECKED,    new String[]{"Background Checked",    "blue",   "✔"},
        ProviderBadge.BadgeType.CERTIFIED_PROFESSIONAL,new String[]{"Certified Professional","purple", "🎓"},
        ProviderBadge.BadgeType.TOP_RATED,             new String[]{"Top Rated",             "amber",  "⭐"},
        ProviderBadge.BadgeType.VETERAN,               new String[]{"5-Year Veteran",        "green",  "🏅"},
        ProviderBadge.BadgeType.CENTURY,               new String[]{"100+ Jobs Done",        "teal",   "💯"}
    );

    // ── Get all badges for a provider ───────────────────────
    public List<BadgeResponse> getBadgesForProvider(Long providerId) {
        return badgeRepository.findByProviderId(providerId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ── Admin manually assigns a badge ──────────────────────
    @Transactional
    public BadgeResponse assignBadge(Long providerId, ProviderBadge.BadgeType badgeType) {
        // Idempotent — don't duplicate if already exists
        if (badgeRepository.existsByProviderIdAndBadgeType(providerId, badgeType)) {
            return toResponse(
                badgeRepository.findByProviderIdAndBadgeType(providerId, badgeType).get()
            );
        }
        ProviderBadge badge = new ProviderBadge();
        		badge.setProviderId(providerId);
        		badge.setBadgeType(badgeType);
        		badge.setAssignedBy("ADMIN");
        		return toResponse(badgeRepository.save(badge));
    }

    // ── Admin revokes a badge ────────────────────────────────
    @Transactional
    public void revokeBadge(Long providerId, ProviderBadge.BadgeType badgeType) {
        badgeRepository.deleteByProviderIdAndBadgeType(providerId, badgeType);
    }

    // ── Auto-badge: called after every rating update and job completion ──
    // Plug this into RatingService.submitRating() and BookingService.completeBooking()
    @Transactional
    public void updateAutoBadges(Long providerId) {
        Provider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        long completedJobs = bookingRepository
                .countByProviderIdAndStatus(providerId, com.quickserve.model.Booking.Status.PAID);

        // TOP_RATED: avg_rating >= 4.5
        handleAutoBadge(providerId,
                ProviderBadge.BadgeType.TOP_RATED,
                provider.getAvgRating() != null && provider.getAvgRating() >= 4.5);

        // VETERAN: years_experience >= 5
        handleAutoBadge(providerId,
                ProviderBadge.BadgeType.VETERAN,
                provider.getYearsExperience() != null && provider.getYearsExperience() >= 5);

        // CENTURY: completed jobs (PAID status) >= 100
        handleAutoBadge(providerId,
                ProviderBadge.BadgeType.CENTURY,
                completedJobs >= 100);
    }

    // ── Helper: add or remove auto badge based on condition ─
    private void handleAutoBadge(Long providerId,
                                  ProviderBadge.BadgeType badgeType,
                                  boolean conditionMet) {
        boolean alreadyHas = badgeRepository.existsByProviderIdAndBadgeType(providerId, badgeType);

        if (conditionMet && !alreadyHas) {
            // Award badge
            ProviderBadge badge = new ProviderBadge();
            badge.setProviderId(providerId);
            badge.setBadgeType(badgeType);
            badge.setAssignedBy("SYSTEM");

            badgeRepository.save(badge);
            
        } else if (!conditionMet && alreadyHas) {
            // Revoke badge if provider falls below threshold
            badgeRepository.deleteByProviderIdAndBadgeType(providerId, badgeType);
        }
    }

    // ── Convert entity to response DTO ───────────────────────
    public BadgeResponse toResponse(ProviderBadge badge) {
        String[] meta = BADGE_META.getOrDefault(badge.getBadgeType(),
                new String[]{"Unknown", "gray", "?"});
       
        BadgeResponse response = new BadgeResponse();
        response.setId(badge.getId());
        response.setBadgeType(badge.getBadgeType().name());
        response.setLabel(meta[0]);
        response.setColor(meta[1]);
        response.setIcon(meta[2]);
        response.setAssignedBy(badge.getAssignedBy());
        response.setAssignedAt(badge.getAssignedAt());

        return response;
    }
}