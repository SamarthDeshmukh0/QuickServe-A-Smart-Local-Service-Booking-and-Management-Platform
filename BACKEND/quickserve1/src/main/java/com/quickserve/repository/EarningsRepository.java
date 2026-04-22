// ============================================================
// FILE: src/main/java/com/quickserve/repository/EarningsRepository.java
// ============================================================

package com.quickserve.repository;

import com.quickserve.model.Earnings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EarningsRepository extends JpaRepository<Earnings, Long> {
    List<Earnings> findByProviderIdOrderByEarnedAtDesc(Long providerId);

    @Query("SELECT SUM(e.amount) FROM Earnings e WHERE e.providerId = :pid")
    Double sumByProviderId(@Param("pid") Long providerId);

    @Query("SELECT SUM(e.amount) FROM Earnings e WHERE e.providerId = :pid AND e.earnedAt >= :start AND e.earnedAt <= :end")
    Double sumByProviderIdAndDateRange(@Param("pid") Long providerId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT FUNCTION('MONTH', e.earnedAt), FUNCTION('YEAR', e.earnedAt), SUM(e.amount) FROM Earnings e WHERE e.providerId = :pid GROUP BY FUNCTION('YEAR', e.earnedAt), FUNCTION('MONTH', e.earnedAt) ORDER BY FUNCTION('YEAR', e.earnedAt), FUNCTION('MONTH', e.earnedAt)")
    List<Object[]> getMonthlyEarnings(@Param("pid") Long providerId);
}