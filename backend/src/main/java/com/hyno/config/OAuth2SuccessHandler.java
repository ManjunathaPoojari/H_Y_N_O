package com.hyno.config;

import com.hyno.entity.Patient;
import com.hyno.service.PatientService;
import com.hyno.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private PatientService patientService;

    @Autowired
    private JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                      Authentication authentication) throws IOException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String googleId = oauth2User.getAttribute("id");

        // Check if user exists, if not create new patient
        Optional<Patient> existingPatient = patientService.findByEmail(email);
        Patient patient;

        if (existingPatient.isPresent()) {
            patient = existingPatient.get();
            // Update Google ID if not set
            if (patient.getGoogleId() == null || patient.getGoogleId().isEmpty()) {
                patient.setGoogleId(googleId);
                patientService.save(patient);
            }
        } else {
            // Create new patient
            patient = new Patient();
            patient.setName(name);
            patient.setEmail(email);
            patient.setGoogleId(googleId);
            patient.setVerified(true);
            patient = patientService.createPatient(patient);
        }

        // Generate JWT token
        String token = jwtService.generateToken(patient.getId(), email, "patient");

        // Redirect to frontend with token
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/oauth2/redirect")
                .queryParam("token", token)
                .queryParam("user", patient.getId())
                .queryParam("role", "patient")
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
