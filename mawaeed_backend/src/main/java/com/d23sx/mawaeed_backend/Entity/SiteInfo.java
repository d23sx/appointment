package com.d23sx.mawaeed_backend.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Table(name = "site_info")
public class SiteInfo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "site_name", nullable = false)
    private String siteName;

    @Column(name = "description")
    private String description;
    
    @Column(name = "address")
    private String address;
    
    @Column(name = "email")
    private String email;
    
    @Column(name = "phone")
    private String phone;
    
    @Column(name = "latitude")
    private String latitude;
    
    @Column(name = "longitude")
    private String longitude;
    
    @Column(name = "start_time")
    private LocalTime startTime;
    
    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "ticket_start_number", nullable = false)
    private int ticketStartNumber;

    @Column(name = "ticket_max_number", nullable = false)
    private int ticketMaxNumber;
    
    @Column(name = "active", nullable = false)
    private Boolean active;
    
    @Column(name = "is_non_bahraini")
    private Boolean isNonBahraini;
    
    @Column(name = "inactive_start_date")
    private String inactiveStartDate;
    
    @Column(name = "inactive_end_date")
    private String inactiveEndDate;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
