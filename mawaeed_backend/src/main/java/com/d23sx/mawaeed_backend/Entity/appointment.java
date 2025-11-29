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
public class appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "site_id")
    private Long site_id;

    @Column(name = "slot_id")
    private Long slot_id;

    @Column(name = "appointment_date")
    private LocalDate appointment_date;

    @Column(name = "appointment_time")
    private LocalTime appointment_time;

    @Column(name = "appointment_type")
    private String appointment_type;

    @Column(name = "appointment_number")
    private int appointment_number;

    @Column(name = "phone_number")
    private String phone_number;

    @Column(name = "email")
    private String email;

    @Column(name = "status_reason")
    private String status_reason;

    @Column(name = "ticket_printed_at")
    private LocalDateTime ticket_printed_at;

    @Column(name = "employee_id")
    private Long employee_id;

    @Column(name = "is_rescheduled")
    private boolean is_rescheduled;

    @Column(name = "rescheduled_from_appointment_id")
    private long rescheduled_from_appointment_id;

    @Column(name = "is_active")
    private boolean is_active;

    @Column(name = "created_by")
    private long created_by;

    @Column(name = "created_at")
    private LocalDateTime created_at;

    @Column(name = "updated_at")
    private LocalDateTime updated_at;
}
