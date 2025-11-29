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
    private String block_type;

    @Column(name = "cpr_or_passport_number", nullable = false)
    private String cpr_or_passport_number;

    @Column(name = "no_show_count", nullable = false)
    private int no_show_count;

    @Column(name = "block_start_date", nullable = false)
    private String block_start_date;

    @Column(name = "block_end_date", nullable = false)
    private String block_end_date;

    @Column(name = "block_reason", nullable = false)
    private String block_reason;

    @Column(name = "site_id", nullable = false)
    private Long site_id;

    @Column(name = "block_date")
    private String block_date;

    @Column(name = "start_time")
    private String start_time;

    @Column(name = "end_time")
    private String end_time;

    @Column(name = "is_active", nullable = false)
    private boolean is_active;

    @Column(name = "blocked_by_appointment_id")
    private Long blocked_by_appointment_id;

    @Column(name = "created_by")
    private long created_by;

    @Column(name = "created_at")
    private LocalDateTime created_at;

    @Column(name = "updated_at")
    private LocalDateTime updated_at;
}
