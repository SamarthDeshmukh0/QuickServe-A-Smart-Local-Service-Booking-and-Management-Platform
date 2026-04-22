// ============================================================
// FILE: src/main/java/com/quickserve/dto/response/ProviderResponse.java
// ============================================================

package com.quickserve.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

import java.util.List;
import com.quickserve.dto.response.BadgeResponse;

//@Data
//@Builder
public class ProviderResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String profession;
    private String city;
    private Integer yearsExperience;
    private Double avgRating;
    private String status;
    private Double recommendationScore;
    private Boolean isTopPick;
    private LocalDateTime createdAt;
    private List<BadgeResponse> badges;
    
  //  No-args constructor
    public ProviderResponse() {
    }

    //  All-args constructor
    public ProviderResponse(Long id, String name, String email, String phone,
                            String profession, String city, Integer yearsExperience,
                            Double avgRating, String status,
                            Double recommendationScore, Boolean isTopPick,
                            LocalDateTime createdAt,
                            List<BadgeResponse> badges) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.profession = profession;
        this.city = city;
        this.yearsExperience = yearsExperience;
        this.avgRating = avgRating;
        this.status = status;
        this.recommendationScore = recommendationScore;
        this.isTopPick = isTopPick;
        this.createdAt = createdAt;
        this.badges=badges;
    }

    // ✅ Getters and Setters

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
    	this.id=id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Integer getYearsExperience() {
        return yearsExperience;
    }

    public void setYearsExperience(Integer yearsExperience) {
        this.yearsExperience = yearsExperience;
    }

    public Double getAvgRating() {
        return avgRating;
    }

    public void setAvgRating(Double avgRating) {
        this.avgRating = avgRating;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getRecommendationScore() {
        return recommendationScore;
    }

    public void setRecommendationScore(Double recommendationScore) {
        this.recommendationScore = recommendationScore;
    }

    public Boolean getIsTopPick() {
        return isTopPick;
    }

    public void setIsTopPick(Boolean isTopPick) {
        this.isTopPick = isTopPick;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

	public List<BadgeResponse> getBadges() {
		return badges;
	}

	public void setBadges(List<BadgeResponse> badges) {
		this.badges = badges;
	}
    

}