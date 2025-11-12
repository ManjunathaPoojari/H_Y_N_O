package com.hyno.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    public void sendWelcomeEmail(String to, String name, String temporaryPassword, String userType) {
        try {
            Context context = new Context();
            context.setVariable("name", name);
            context.setVariable("temporaryPassword", temporaryPassword);
            context.setVariable("userType", userType);
            context.setVariable("loginUrl", "http://localhost:3000/" + userType + "-login");

            String htmlContent = templateEngine.process("welcome-email", context);

            sendHtmlEmail(to, "Welcome to HYNO Health Management System", htmlContent);
            logger.info("Welcome email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send welcome email to: {}", to, e);
        }
    }

    public void sendPasswordResetEmail(String to, String resetLink) {
        try {
            Context context = new Context();
            context.setVariable("resetUrl", resetLink);

            String htmlContent = templateEngine.process("password-reset-email", context);

            sendHtmlEmail(to, "Password Reset Request - HYNO Health System", htmlContent);
            logger.info("Password reset email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send password reset email to: {}", to, e);
        }
    }

    public void sendVerificationEmail(String to, String name, String verificationLink) {
        try {
            Context context = new Context();
            context.setVariable("name", name);
            context.setVariable("verificationUrl", verificationLink);

            String htmlContent = templateEngine.process("verification-email", context);

            sendHtmlEmail(to, "Verify Your Email - HYNO Health Management System", htmlContent);
            logger.info("Verification email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send verification email to: {}", to, e);
        }
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        helper.setFrom("noreply@hynohealth.com");

        mailSender.send(message);
    }
}
