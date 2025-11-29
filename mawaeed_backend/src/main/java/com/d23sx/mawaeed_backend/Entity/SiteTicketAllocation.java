package com.d23sx.mawaeed_backend.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Table(name = "site_ticket_allocation")
public class SiteTicketAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "site_id", nullable = false)
    private long site_id;

    @Column(name = "allocation_date", nullable = false)
    private String allocation_date;

    @Column(name = "start_number", nullable = false)
    private int start_number;

    @Column(name = "next_available_number", nullable = false)
    private int next_available_number;

    @Column(name = "is_active", nullable = false)
    private boolean is_active;

    @Column(name = "created_at")
    private LocalDateTime created_at;

    @Column(name = "updated_at")
    private LocalDateTime updated_at;

}
