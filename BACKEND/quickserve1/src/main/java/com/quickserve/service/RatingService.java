// ============================================================
// FILE: src/main/java/com/quickserve/service/RatingService.java
// ============================================================

package com.quickserve.service;

import com.quickserve.dto.request.RatingRequest;
import com.quickserve.dto.response.RatingResponse;
import com.quickserve.model.Provider;
import com.quickserve.model.Rating;
import com.quickserve.model.User;
import com.quickserve.repository.ProviderRepository;
import com.quickserve.repository.RatingRepository;
import com.quickserve.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final ProviderRepository providerRepository;
    private final UserRepository userRepository;
    
    private final BadgeService badgeService;
    
    public RatingService(RatingRepository ratingRepository,
            ProviderRepository providerRepository,
            UserRepository userRepository,
            BadgeService badgeService) {
			this.ratingRepository = ratingRepository;
			this.providerRepository = providerRepository;
			this.userRepository = userRepository;
			this.badgeService=badgeService;
			}

    // ─── Submit rating ───────────────────────────────────────
    @Transactional
    public RatingResponse submitRating(RatingRequest req) {
        if (ratingRepository.existsByBookingId(req.getBookingId())) {
            throw new RuntimeException("Rating already submitted for this booking");
        }

        Rating rating = new Rating();
        rating.setBookingId(req.getBookingId());
        rating.setCustomerId(req.getCustomerId());
        rating.setProviderId(req.getProviderId());
        rating.setStars(req.getStars());
        rating.setReview(req.getReview());
        
        Rating savedRating = ratingRepository.save(rating);

        // Recalculate provider average rating
        Double newAvg = ratingRepository.getAverageRatingByProvider(req.getProviderId());
        providerRepository.findById(req.getProviderId()).ifPresent(provider -> {
            provider.setAvgRating(newAvg != null ? Math.round(newAvg * 10.0) / 10.0 : 0.0);
            providerRepository.save(provider);
        });
        
        //new line for the badge..
        badgeService.updateAutoBadges(req.getProviderId());
        
        return toResponse(savedRating);
    }

    // ─── Get ratings for a provider ──────────────────────────
    public List<RatingResponse> getProviderRatings(Long providerId) {
        return ratingRepository.findByProviderId(providerId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private RatingResponse toResponse(Rating r) {
        String customerName = userRepository.findById(r.getCustomerId())
                .map(User::getName).orElse("Anonymous");
        RatingResponse res = new RatingResponse();

        res.setId(r.getId());
        res.setBookingId(r.getBookingId());
        res.setCustomerId(r.getCustomerId());
        res.setCustomerName(customerName);
        res.setProviderId(r.getProviderId());
        res.setStars(r.getStars());
        res.setReview(r.getReview());
        res.setCreatedAt(r.getCreatedAt());

        return res;
    }
}