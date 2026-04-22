// ============================================================
// FILE: src/main/java/com/quickserve/dto/request/LoginRequest.java
// ============================================================

package com.quickserve.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank
    private String email;

    @NotBlank
    private String password;

    private boolean rememberMe;
    
    public LoginRequest(String email, String password,
    					boolean rememberMe) {
    	this.email=email;
    	this.password=password;
    	this.rememberMe=rememberMe;
    }

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public boolean isRememberMe() {
		return rememberMe;
	}

	public void setRememberMe(boolean rememberMe) {
		this.rememberMe = rememberMe;
	}
}