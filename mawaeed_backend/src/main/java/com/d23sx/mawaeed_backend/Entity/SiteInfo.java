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
    private String site_name;

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
    private LocalTime start_time;
    
    @Column(name = "end_time")
    private LocalTime end_time;

    @Column(name = "ticket_start_number", nullable = false)
    private int ticket_start_number;

    @Column(name = "ticket_max_number", nullable = false)
    private int ticket_max_number;
    
    @Column(name = "is_active", nullable = false)
    private boolean is_active;
    
    @Column(name = "is_non_bahraini")
    private boolean is_non_bahraini;
    
    @Column(name = "inactive_start_date")
    private String inactive_start_date;
    
    @Column(name = "inactive_end_date")
    private String inactive_end_date;
    
    @Column(name = "created_at")
    private LocalDateTime created_at;
    
    @Column(name = "updated_at")
    private LocalDateTime updated_at;
}
