package com.hyno.config;

import com.hyno.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling
public class ScheduledTasksConfig {

    @Autowired
    private ScheduleService scheduleService;

    // Run every 5 minutes to clean up expired reservations
    @Scheduled(fixedRate = 300000) // 5 minutes in milliseconds
    public void cleanupExpiredReservations() {
        scheduleService.cleanupExpiredReservations();
    }
}
