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


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointmentId;

    @Column(name = "old_appointment_date", nullable = false)
    private LocalDate oldAppointmentDate;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "site_id", nullable = false)
    private SiteInfo oldSiteId;


    @Column(name = "old_appointment_time", nullable = false)
    private LocalTime oldAppointmentTime;

    @Column(name = "new_appointment_date", nullable = false)
    private LocalDate newAppointmentDate;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "site_id", nullable = false)
    private SiteInfo newSiteId;

    @Column(name = "new_appointment_time", nullable = false)
    private LocalTime newAppointmentTime;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rescheduled_by", nullable = false)
    private User rescheduledBy;

    @Column(name = "rescheduled_at")
    private LocalTime rescheduledAt;

}
