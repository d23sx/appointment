package com.d23sx.mawaeed_backend.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Table(name = "appointment_bahraini")
public class AppointmentBahraini {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "appointment_id", nullable = false)
    private Long appointment_id;

    @Column(name = "cpr_or_passport_number", nullable = false)
    private String cpr_or_passport_number;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    @Column(name = "dependents_cpr")
    private List<Integer> dependents_cpr;

    @Column(name = "cpr_count")
    private int cpr_count;

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
