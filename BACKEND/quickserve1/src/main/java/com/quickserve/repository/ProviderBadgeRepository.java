// ============================================================
// FILE: src/main/java/com/quickserve/repository/ProviderBadgeRepository.java
// ============================================================

package com.quickserve.repository;

import com.quickserve.model.ProviderBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderBadgeRepository extends JpaRepository<ProviderBadge, Long> {

    List<ProviderBadge> findByProviderId(Long providerId);

    Optional<ProviderBadge> findByProviderIdAndBadgeType(Long providerId, ProviderBadge.BadgeType badgeType);

    boolean existsByProviderIdAndBadgeType(Long providerId, ProviderBadge.BadgeType badgeType);

    void deleteByProviderIdAndBadgeType(Long providerId, ProviderBadge.BadgeType badgeType);
}