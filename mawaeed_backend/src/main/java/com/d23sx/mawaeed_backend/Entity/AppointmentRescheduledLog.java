package com.d23sx.mawaeed_backend.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Table(name = "appointment_rescheduled_log")
public class AppointmentRescheduledLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "appointment_id", nullable = false)
    private Long appointment_id;

    @Column(name = "old_appointment_date", nullable = false)
    private LocalDate old_appointment_date;

    @Column(name = "old_site_id", nullable = false)
    private Long old_site_id;


    @Column(name = "old_appointment_time", nullable = false)
    private LocalTime old_appointment_time;

    @Column(name = "new_appointment_date", nullable = false)
    private LocalDate new_appointment_date;

    @Column(name = "new_site_id", nullable = false)
    private Long new_site_id;

    @Column(name = "new_appointment_time", nullable = false)
    private LocalTime new_appointment_time;

    @Column(name = "rescheduled_by", nullable = false)
    private Long rescheduled_by;

    @Column(name = "rescheduled_at")
    private String rescheduled_at;

}
