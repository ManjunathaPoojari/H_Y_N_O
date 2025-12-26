package com.hyno.service;

import com.hyno.entity.AuditLog;
import com.hyno.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Transactional
    public void log(String userId, String userRole, String action, String resourceType, String resourceId, String details, String ipAddress, String deviceInfo) {
        AuditLog log = new AuditLog();
        log.setUserId(userId);
        log.setUserRole(userRole);
        log.setAction(action);
        log.setResourceType(resourceType);
        log.setResourceId(resourceId);
        log.setDetails(details);
        log.setIpAddress(ipAddress);
        log.setDeviceInfo(deviceInfo);
        
        auditLogRepository.save(log);
    }
}
