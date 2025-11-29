package com.d23sx.mawaeed_backend.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Table(name = "appointment")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "site_id", nullable = false)
    private SiteInfo siteId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "slot_id", nullable = false)
    private SiteTimeSlot slot_id;

    @Column(name = "appointment_date", nullable = false)
    private LocalDate appointment_date;

    @Column(name = "appointment_time", nullable = false)
    private LocalTime appointment_time;

    @Column(name = "appointment_type")
    private String appointment_type;

    @Column(name = "appointment_number", nullable = false)
    private int appointment_number;

    @Column(name = "phone_number", nullable = false)
    private String phone_number;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "status_reason")
    private String status_reason;

    @Column(name = "ticket_printed_at")
    private LocalDateTime ticket_printed_at;

    @Column(name = "employee_id")
    private Long employee_id;

    @Column(name = "is_rescheduled")
    private Boolean is_rescheduled;

    @Column(name = "rescheduled_from_appointment_id")
    private long rescheduled_from_appointment_id;

    @Column(name = "active", nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean active;

    @Column(name = "created_by")
    private long created_by;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
