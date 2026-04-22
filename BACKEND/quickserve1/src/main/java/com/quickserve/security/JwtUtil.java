// ============================================================
// FILE: src/main/java/com/quickserve/security/JwtUtil.java
// ============================================================

package com.quickserve.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration.customer}")
    private long customerExpiration;

    @Value("${jwt.expiration.provider}")
    private long providerExpiration;

    @Value("${jwt.expiration.admin}")
    private long adminExpiration;

    private SecretKey getSigningKey() {
    	if(secret.length()<32) {
    		throw new IllegalArgumentException("JWT secret key must be atleast 32 char long.");
    	}
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Long userId, String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("role", role);

        long expiration = switch (role) {
            case "PROVIDER" -> providerExpiration;
            case "ADMIN"    -> adminExpiration;
            default         -> customerExpiration;
        };

        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return (String) extractAllClaims(token).get("role");
    }

    public Long extractUserId(String token) {
        Object id = extractAllClaims(token).get("userId");
        if (id instanceof Integer) {
        	//return ((Integer) id).longValue();
        	return ((Number) id).longValue();
        }
        throw new IllegalArgumentException("Invalid userid in token");
        //return (Long) id;
    }

    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}