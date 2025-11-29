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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "site_id", nullable = false)
    private SiteInfo siteId;

    @Column(name = "allocation_date", nullable = false)
    private String allocationDate;

    @Column(name = "start_number", nullable = false)
    private int startNumber;

    @Column(name = "next_available_number", nullable = false)
    private int nextAvailableNumber;

    @Column(name = "active", nullable = false)
    private Boolean active;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}
