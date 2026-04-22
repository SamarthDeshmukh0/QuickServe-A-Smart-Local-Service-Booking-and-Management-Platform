// ============================================================
// FILE: src/main/java/com/quickserve/repository/ServicePackageRepository.java
// NEW FILE
// ============================================================

package com.quickserve.repository;

import com.quickserve.model.ServicePackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServicePackageRepository extends JpaRepository<ServicePackage, Long> {

    List<ServicePackage> findByIsActiveTrue();
}
