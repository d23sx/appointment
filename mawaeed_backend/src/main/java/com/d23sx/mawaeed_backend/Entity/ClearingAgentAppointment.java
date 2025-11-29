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
@Table(name = "clearing_agent_appointment")
public class ClearingAgentAppointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "appointment_id", nullable = false)
    private Long appointment_id;

    @Column(name = "agent_name", nullable = false)
    private String agent_name;

    @Column(name = "agent_cpr", nullable = false)
    private String agent_cpr;

    @Column(name = "agent_cr_number", nullable = false)
    private String agent_cr_number;

    @Column(name = "agent_phone")
    private String agent_phone;

    @Column(name = "agent_email")
    private String agent_email;


    @Column(name = "applicant_cpr_numbers")
    private String applicant_cpr_numbers;

    @Column(name = "applicant_cpr_count")
    private int applicant_cpr_count;

    @Column(name = "note")
    private String note;

    @Column(name = "is_active", nullable = false)
    private boolean is_active;

    @Column(name = "created_by")
    private long created_by;

    @Column(name = "created_at")
    private LocalDateTime created_at;

    @Column(name = "updated_at")
    private LocalDateTime updated_at;

    @Column(name = "is_portal", nullable = false)
    private boolean is_portal;


}
