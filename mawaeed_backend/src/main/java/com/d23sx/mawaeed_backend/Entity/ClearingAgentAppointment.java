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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointmentId;

    @Column(name = "agent_name", nullable = false)
    private String agentName;

    @Column(name = "agent_cpr", nullable = false)
    private String agentCpr;

    @Column(name = "agent_cr_number", nullable = false)
    private String agentCrNumber;

    @Column(name = "agent_phone")
    private String agentPhone;

    @Column(name = "agent_email")
    private String agentEmail;

    @Column(name = "applicant_cpr_numbers")
    private String applicantCprNumbers;

    @Column(name = "applicant_cpr_count")
    private int applicantCprCount;

    @Column(name = "note")
    private String note;

    @Column(name = "active", nullable = false)
    private Boolean active;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_portal", nullable = false)
    private Boolean isPortal;


}
