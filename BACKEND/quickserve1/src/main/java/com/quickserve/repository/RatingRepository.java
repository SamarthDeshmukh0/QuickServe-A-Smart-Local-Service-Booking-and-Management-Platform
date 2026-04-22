// ============================================================
// FILE: src/main/java/com/quickserve/repository/RatingRepository.java
// ============================================================

package com.quickserve.repository;

import com.quickserve.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByProviderId(Long providerId);
    Optional<Rating> findByBookingId(Long bookingId);
    boolean existsByBookingId(Long bookingId);

    @Query("SELECT AVG(r.stars) FROM Rating r WHERE r.providerId = :pid")
    Double getAverageRatingByProvider(@Param("pid") Long providerId);
}