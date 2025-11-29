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
@Table(name = "holiday")
public class Holiday {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "holiday_name", nullable = false)
    private String holiday_name;
    @Column(name = "start_holiday_date", nullable = false)
    private LocalDateTime start_holiday_date;

    @Column(name = "end_holiday_date", nullable = false)
    private LocalDateTime end_holiday_date;

    @Column(name = "holiday_description", nullable = false)
    private String holiday_description;

    @Column(name = "reminder_before")
    private int reminder_before;

    @Column(name = "is_active", nullable = false)
    private boolean is_active;

    @Column(name = "created_by", nullable = false)
    private long created_by;

    @Column(name = "created_at")
    private LocalDateTime created_at;

    @Column(name = "updated_at")
    private LocalDateTime updated_at;
}
