// ============================================================
// FILE: src/main/java/com/quickserve/config/SecurityConfig.java
// ============================================================

package com.quickserve.config;

import com.quickserve.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
//@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Value("${cors.allowed.origins}")
    private String allowedOrigin;
    
    //constructor
    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/ratings/provider/**").permitAll()

                // Customer endpoints
                .requestMatchers("/api/bookings/customer/**").hasRole("CUSTOMER")
                .requestMatchers("/api/payments/**").hasRole("CUSTOMER")
                // Customer can create urgent bookings
				.requestMatchers(HttpMethod.POST, "/api/bookings/urgent").hasRole("CUSTOMER")
				
				// Provider can accept urgent bookings and fetch open urgent list
				.requestMatchers(HttpMethod.PUT, "/api/bookings/*/urgent-accept").hasRole("PROVIDER")
				.requestMatchers(HttpMethod.GET, "/api/bookings/urgent/open").hasRole("PROVIDER")

                //trial for job status
                .requestMatchers(HttpMethod.GET, "/api/bookings/*").hasAnyRole("CUSTOMER","PROVIDER","ADMIN")
                .requestMatchers("/api/ratings").hasRole("CUSTOMER")
                .requestMatchers("/api/slots/available").hasRole("CUSTOMER")
                .requestMatchers("/api/providers/recommend").hasRole("CUSTOMER")
                .requestMatchers("/api/customers/**").hasRole("CUSTOMER")

                // Provider endpoints
                .requestMatchers("/api/bookings/provider/**").hasRole("PROVIDER")
                .requestMatchers("/api/bookings/*/accept").hasRole("PROVIDER")
                .requestMatchers("/api/bookings/*/reject").hasRole("PROVIDER")
                .requestMatchers("/api/bookings/*/start").hasRole("PROVIDER")
                .requestMatchers("/api/bookings/*/complete").hasRole("PROVIDER")
                .requestMatchers("/api/slots/**").hasAnyRole("PROVIDER", "CUSTOMER")
                .requestMatchers("/api/providers/*/earnings").hasRole("PROVIDER")
                
                //new lines for the badges..
                .requestMatchers(HttpMethod.GET,    "/api/providers/*/badges").permitAll()
                .requestMatchers(HttpMethod.POST,   "/api/admin/providers/*/badges").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/admin/providers/*/badges/**").hasRole("ADMIN")

                // Admin endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // General provider info — any authenticated
                .requestMatchers("/api/providers/**").authenticated()
                
                
              //Customer can browse packages and create group bookings(this is for grp bking)
              .requestMatchers(HttpMethod.GET,  "/api/packages").hasRole("CUSTOMER")
              .requestMatchers(HttpMethod.GET,  "/api/packages/*").hasAnyRole("CUSTOMER","ADMIN")
              .requestMatchers(HttpMethod.POST, "/api/packages/book").hasRole("CUSTOMER")
              .requestMatchers(HttpMethod.GET,  "/api/packages/group/*").hasRole("CUSTOMER")
              .requestMatchers(HttpMethod.GET,  "/api/packages/customer/*").hasRole("CUSTOMER")
              .requestMatchers(HttpMethod.POST, "/api/packages/seed").hasRole("ADMIN")

                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(allowedOrigin));
        config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}