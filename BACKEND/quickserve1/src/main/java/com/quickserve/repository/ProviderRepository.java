// ============================================================
// FILE: src/main/java/com/quickserve/repository/ProviderRepository.java
// ============================================================

package com.quickserve.repository;

import com.quickserve.model.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long> {
    Optional<Provider> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Provider> findByStatus(Provider.Status status);
    List<Provider> findByCityAndProfessionAndStatus(String city, String profession, Provider.Status status);
    List<Provider> findByCityAndStatus(String city, Provider.Status status);
    long countByStatus(Provider.Status status);

    @Query("SELECT p FROM Provider p WHERE p.status = 'APPROVED' ORDER BY p.avgRating DESC")
    List<Provider> findTopProviders();

    @Query("SELECT p FROM Provider p WHERE p.profession = :profession AND p.status = 'APPROVED'")
    List<Provider> findByProfessionAndApproved(@Param("profession") String profession);
}