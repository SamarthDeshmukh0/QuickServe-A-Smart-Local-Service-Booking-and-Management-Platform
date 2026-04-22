// ============================================================
// FILE: src/main/java/com/quickserve/controller/AuthController.java
// ============================================================

package com.quickserve.controller;

import com.quickserve.dto.request.*;
import com.quickserve.dto.response.AuthResponse;
import com.quickserve.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
		super();
		this.authService = authService;
	}

	@PostMapping("/customer/register")
    public ResponseEntity<AuthResponse> registerCustomer(@Valid @RequestBody CustomerRegisterRequest req) {
        return ResponseEntity.ok(authService.registerCustomer(req));
    }

    @PostMapping("/customer/login")
    public ResponseEntity<AuthResponse> loginCustomer(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.loginCustomer(req));
    }

    @PostMapping("/provider/register")
    public ResponseEntity<Map<String, String>> registerProvider(@Valid @RequestBody ProviderRegisterRequest req) {
        authService.registerProvider(req);
        return ResponseEntity.ok(Map.of("message",
                "Your account has been submitted for approval. You will be able to login once approved by admin."));
    }

    @PostMapping("/provider/login")
    public ResponseEntity<AuthResponse> loginProvider(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.loginProvider(req));
    }

    @PostMapping("/admin/login")
    public ResponseEntity<AuthResponse> loginAdmin(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.loginAdmin(req));
    }
}