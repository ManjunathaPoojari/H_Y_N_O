package com.hyno.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public OAuth2SuccessHandler oAuth2SuccessHandler() {
        return new OAuth2SuccessHandler();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/health").permitAll() // Allow health check without authentication
                .requestMatchers("/api/auth/**").permitAll() // Allow auth endpoints
                .requestMatchers("/oauth2/**").permitAll() // Allow OAuth2 endpoints
                .requestMatchers("/login/oauth2/**").permitAll() // Allow OAuth2 login
                .requestMatchers("/api/**").permitAll() // Allow all API endpoints for now (development)
                .requestMatchers("/ws/**").permitAll() // Allow WebSocket connections
                .requestMatchers("/ws/info").permitAll() // Allow SockJS info endpoint
                .anyRequest().permitAll() // Allow all other requests
            )
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oAuth2SuccessHandler())
                .failureUrl("/api/auth/oauth2/failure")
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        return http.build();
    }
}
