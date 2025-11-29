package com.d23sx.mawaeed_backend.Entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Table(name = "site_time_slot")

public class SiteTimeSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "site_id", nullable = false)
    private long site_id;

    @Column(name = "slot_id", nullable = false)
    private long slot_id;

    @Column(name = "start_time")
    private LocalTime start_time;

    @Column(name = "end_time")
    private LocalTime end_time;

    @Column(name = "slot_duration_minutes")
    private int slot_duration_minutes;

    @Column(name = "max_limit")
    private int max_limit;

    @Column(name = "available_days")
    private List<Integer> available_days;

    @Column(name = "is_active", nullable = false)
    private boolean is_active;

    @Column(name = "created_by")
    private long created_by;

    @Column(name = "created_at")
    private LocalDateTime created_at;

    @Column(name = "updated_at")
    private LocalDateTime updated_at;

}
