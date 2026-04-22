// ============================================================
// FILE: src/main/java/com/quickserve/config/DataInitializer.java
// ============================================================

package com.quickserve.config;

import com.quickserve.model.User;
import com.quickserve.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
//@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.name}")
    private String adminName;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;
    
    //constructor from gpt
    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    	this.userRepository=userRepository;	
    	this.passwordEncoder=passwordEncoder;
    }
    

    @Override
    public void run(String... args) {
        // Seed admin account on startup if not already present
        if (!userRepository.existsByEmail(adminEmail)) {
        	
        	User admin = new User(
                    adminName,
                    adminEmail,
                    "0000000000",
                    "Bangalore",
                    passwordEncoder.encode(adminPassword),
                    User.Role.ADMIN
            );
        	
            userRepository.save(admin);
            System.out.println("✅ Admin account seeded: " + adminEmail);
        }
    }
}