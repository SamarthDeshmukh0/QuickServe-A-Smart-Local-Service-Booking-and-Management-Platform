// ============================================================
// FILE: src/main/java/com/quickserve/config/PackageDataSeeder.java
// NEW FILE — auto-seeds packages on first startup
// ============================================================

package com.quickserve.config;

import com.quickserve.service.PackageService;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class PackageDataSeeder implements ApplicationRunner {

    private final PackageService packageService;

    public PackageDataSeeder(PackageService packageService) {
        this.packageService = packageService;
    }

    @Override
    public void run(ApplicationArguments args) {
        // Seeds the 4 default packages if none exist yet
        // Safe to run multiple times — checks count first
        packageService.seedPackages();
    }
}