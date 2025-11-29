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
@Table(name = "block")
public class Block {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "block_type", nullable = false)
    private String blockType;

    @Column(name = "cpr_or_passport_number", nullable = false)
    private String cprOrPassportNumber;

    @Column(name = "no_show_count", nullable = false)
    private int noShowCount;

    @Column(name = "block_start_date", nullable = false)
    private String blockStartDate;

    @Column(name = "block_end_date", nullable = false)
    private String blockEndDate;

    @Column(name = "block_reason", nullable = false)
    private String block_reason;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "site_id", nullable = false)
    private SiteInfo siteId;

    @Column(name = "block_date")
    private String blockDate;

    @Column(name = "start_time")
    private String startTime;

    @Column(name = "end_time")
    private String endTime;

    @Column(name = "active", nullable = false)
    private Boolean active;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "blocked_by_appointment_id", nullable = false)
    private User blockedByAppointmentId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
