// ============================================================
// FILE: src/main/java/com/quickserve/service/AuthService.java
// ============================================================

package com.quickserve.service;

import com.quickserve.dto.request.*;
import com.quickserve.dto.response.AuthResponse;
import com.quickserve.model.Provider;
import com.quickserve.model.User;
import com.quickserve.repository.ProviderRepository;
import com.quickserve.repository.UserRepository;
import com.quickserve.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
//@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    //Constructor with args
    public AuthService(UserRepository userRepository,
            ProviderRepository providerRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
    	
			this.userRepository = userRepository;
			this.providerRepository = providerRepository;
			this.passwordEncoder = passwordEncoder;
			this.jwtUtil = jwtUtil;
			}
    
    // ─── Customer Register ───────────────────────────────────
    public AuthResponse registerCustomer(CustomerRegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPhone(req.getPhone());
        user.setCity(req.getCity());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(User.Role.CUSTOMER);
        userRepository.save(user);
        return buildCustomerAuthResponse(user);
    }

    // ─── Customer Login ──────────────────────────────────────
    public AuthResponse loginCustomer(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (user.getRole() != User.Role.CUSTOMER) {
            throw new RuntimeException("Not a customer account");
        }
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        return buildCustomerAuthResponse(user);
    }

    // ─── Provider Register ───────────────────────────────────
    public void registerProvider(ProviderRegisterRequest req) {
        if (providerRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        Provider provider = new Provider();
        provider.setName(req.getName());
        provider.setEmail(req.getEmail());
        provider.setPhone(req.getPhone());
        provider.setProfession(req.getProfession());
        provider.setYearsExperience(req.getYearsExperience());
        provider.setCity(req.getCity());
        provider.setPassword(passwordEncoder.encode(req.getPassword()));
        provider.setStatus(Provider.Status.PENDING);
        providerRepository.save(provider);
    }

    // ─── Provider Login ──────────────────────────────────────
    public AuthResponse loginProvider(LoginRequest req) {
        Provider provider = providerRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (provider.getStatus() == Provider.Status.PENDING) {
            throw new RuntimeException("Your account is pending admin approval");
        }
        if (provider.getStatus() == Provider.Status.REJECTED) {
            throw new RuntimeException("Your account has been rejected. Contact support.");
        }
        if (!passwordEncoder.matches(req.getPassword(), provider.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        return buildProviderAuthResponse(provider);
    }

    // ─── Admin Login ─────────────────────────────────────────
    public AuthResponse loginAdmin(LoginRequest req) {
        User admin = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid admin credentials"));

        if (admin.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Not an admin account");
        }
        if (!passwordEncoder.matches(req.getPassword(), admin.getPassword())) {
            throw new RuntimeException("Invalid admin credentials");
        }
        String token = jwtUtil.generateToken(admin.getId(), admin.getEmail(), "ADMIN");
        AuthResponse res = new AuthResponse();

        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo();
        userInfo.setId(admin.getId());
        userInfo.setName(admin.getName());
        userInfo.setEmail(admin.getEmail());
        userInfo.setRole("ADMIN");

        res.setToken(token);
        res.setUser(userInfo);

        return res;
    }

    // ─── Helpers ─────────────────────────────────────────────
    private AuthResponse buildCustomerAuthResponse(User user) {
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), "CUSTOMER");
        AuthResponse res = new AuthResponse();

        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo();
        userInfo.setId(user.getId());
        userInfo.setName(user.getName());
        userInfo.setEmail(user.getEmail());
        userInfo.setPhone(user.getPhone());
        userInfo.setCity(user.getCity());
        userInfo.setRole("CUSTOMER");

        res.setToken(token);
        res.setUser(userInfo);

        return res;
    }

    private AuthResponse buildProviderAuthResponse(Provider provider) {
        String token = jwtUtil.generateToken(provider.getId(), provider.getEmail(), "PROVIDER");
        AuthResponse res = new AuthResponse();

        AuthResponse res1 = new AuthResponse();

        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo();
        userInfo.setId(provider.getId());
        userInfo.setName(provider.getName());
        userInfo.setEmail(provider.getEmail());
        userInfo.setPhone(provider.getPhone());
        userInfo.setCity(provider.getCity());
        userInfo.setRole("PROVIDER");
        userInfo.setProfession(provider.getProfession());
        userInfo.setStatus(provider.getStatus().name());
        userInfo.setAvgRating(provider.getAvgRating());
        userInfo.setYearsExperience(provider.getYearsExperience());

        res1.setToken(token);
        res1.setUser(userInfo);

        return res1;
    }
}