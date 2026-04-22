// ============================================================
// FILE: src/main/java/com/quickserve/service/ProviderService.java
// ============================================================

package com.quickserve.service;

import com.quickserve.dto.request.ProfileUpdateRequest;
import com.quickserve.dto.response.ProviderResponse;
import com.quickserve.model.Provider;
import com.quickserve.repository.BookingRepository;
import com.quickserve.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
//@RequiredArgsConstructor
public class ProviderService {

    private final ProviderRepository providerRepository;
    private final BadgeService badgeService;
    private final BookingRepository bookingRepository;
    
    //consr
    public ProviderService(ProviderRepository providerRepository,
    		               BadgeService badgeService, BookingRepository bookingRepository) {
        this.providerRepository = providerRepository;
		this.badgeService =  badgeService;
		this.bookingRepository=bookingRepository;
    }

    @Value("${flask.recommendation.url}")
    private String flaskUrl;

    // ─── Recommend providers via Flask ───────────────────────
    @SuppressWarnings("unchecked")
    public List<ProviderResponse> getRecommendedProviders(String city, String service) {
        List<Provider> providers = providerRepository.findByCityAndProfessionAndStatus(
                city, service, Provider.Status.APPROVED);
        
        

        if (providers.isEmpty()) {
            // Fallback: any approved providers with this profession
            providers = providerRepository.findByProfessionAndApproved(service);
        }

        if (providers.isEmpty()) return Collections.emptyList();

        // Build payload for Flask
        Map<String, Object> payload = new HashMap<>();
        payload.put("customer_city", city);
        payload.put("service_type", service);

        List<Map<String, Object>> providerList = providers.stream().map(p -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", p.getId());
            m.put("name", p.getName());
            m.put("city", p.getCity());
            m.put("avg_rating", p.getAvgRating() != null ? p.getAvgRating() : 0.0);
            m.put("years_experience", p.getYearsExperience() != null ? p.getYearsExperience() : 0);
          //  m.put("total_jobs", 0);
            m.put("completed_jobs", bookingRepository.countCompletedByProvider(p.getId()));
            m.put("total_jobs",     bookingRepository.countCompletedByProvider(p.getId()));

            return m;
        }).collect(Collectors.toList());

        payload.put("providers", providerList);

        Map<Long, Double> scoreMap = new HashMap<>();
        Map<Long, Boolean> topPickMap = new HashMap<>();

        try {
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> flaskResponse = restTemplate.postForObject(flaskUrl, payload, Map.class);
            if (flaskResponse != null && flaskResponse.containsKey("ranked_providers")) {
                List<Map<String, Object>> ranked = (List<Map<String, Object>>) flaskResponse.get("ranked_providers");
                for (Map<String, Object> r : ranked) {
                    Long id = ((Number) r.get("id")).longValue();
                    Double score = ((Number) r.get("recommendation_score")).doubleValue();
                    Boolean isTop = (Boolean) r.getOrDefault("is_top_pick", false);
                    scoreMap.put(id, score);
                    topPickMap.put(id, isTop);
                }
            }
        } catch (Exception e) {
            // Flask unavailable — compute scores locally
            for (Provider p : providers) {
                double ratingScore = p.getAvgRating() != null ? p.getAvgRating() : 0.0;
                double expScore = Math.min((p.getYearsExperience() != null ? p.getYearsExperience() : 0) / 10.0, 1.0) * 5.0;
                double proximityScore = city.equalsIgnoreCase(p.getCity()) ? 5.0 : 0.0;
                double badgeBonus = badgeService.getBadgesForProvider(p.getId()).size() * 0.3; // ← ADD
                double score = (ratingScore * 0.40) + (expScore * 0.35) + (proximityScore * 0.25);
                scoreMap.put(p.getId(), Math.round(score * 100.0) / 100.0);
            }
        }

        List<ProviderResponse> result = providers.stream().map(p -> {
            ProviderResponse res = new ProviderResponse();

            res.setId(p.getId());
            res.setName(p.getName());
            res.setEmail(p.getEmail());
            res.setPhone(p.getPhone());
            res.setProfession(p.getProfession());
            res.setCity(p.getCity());
            res.setYearsExperience(p.getYearsExperience());
            res.setAvgRating(p.getAvgRating());
            res.setStatus(p.getStatus().name());
            res.setRecommendationScore(scoreMap.getOrDefault(p.getId(), 0.0));
            res.setIsTopPick(topPickMap.getOrDefault(p.getId(), false));
            res.setCreatedAt(p.getCreatedAt());

            return res;
        })
                .collect(Collectors.toList());

        // Mark top pick if not set by Flask
        if (topPickMap.isEmpty() && !result.isEmpty()) {
            result.sort((a, b) -> Double.compare(b.getRecommendationScore(), a.getRecommendationScore()));
            result.get(0).setIsTopPick(true);
        } else {
            result.sort((a, b) -> Double.compare(b.getRecommendationScore(), a.getRecommendationScore()));
        }
        

        return result;
    }

    // ─── Get by ID ───────────────────────────────────────────
    public ProviderResponse getProviderById(Long id) {
        Provider p = providerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        return toResponse(p);
    }

    // ─── Update profile ──────────────────────────────────────
    public ProviderResponse updateProfile(Long id, ProfileUpdateRequest req) {
        Provider p = providerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        if (req.getPhone() != null)  p.setPhone(req.getPhone());
        if (req.getCity() != null)   p.setCity(req.getCity());
        providerRepository.save(p);
        badgeService.updateAutoBadges(id); // ← ADD THIS LINE

        return toResponse(p);
    }

    // ─── Helper ──────────────────────────────────────────────
    public ProviderResponse toResponse(Provider p) {
    	ProviderResponse res = new ProviderResponse();

    	res.setId(p.getId());
    	res.setName(p.getName());
    	res.setEmail(p.getEmail());
    	res.setPhone(p.getPhone());
    	res.setProfession(p.getProfession());
    	res.setCity(p.getCity());
    	res.setYearsExperience(p.getYearsExperience());
    	res.setAvgRating(p.getAvgRating());
    	res.setStatus(p.getStatus().name());
    	res.setCreatedAt(p.getCreatedAt());
    	//badge
    	 res.setBadges(badgeService.getBadgesForProvider(p.getId()));

    	return res;
    }
}