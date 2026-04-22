// ============================================================
// FILE: src/main/java/com/quickserve/controller/CustomerController.java
// ============================================================

package com.quickserve.controller;

import com.quickserve.dto.request.ProfileUpdateRequest;
import com.quickserve.model.User;
import com.quickserve.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final UserRepository userRepository;
    

    public CustomerController(UserRepository userRepository) {
		super();
		this.userRepository = userRepository;
	}

	@PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long id,
                                            @RequestBody ProfileUpdateRequest req) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (req.getName()  != null) user.setName(req.getName());
        if (req.getPhone() != null) user.setPhone(req.getPhone());
        if (req.getCity()  != null) user.setCity(req.getCity());
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomer(@PathVariable Long id) {
        return ResponseEntity.ok(userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found")));
    }
}