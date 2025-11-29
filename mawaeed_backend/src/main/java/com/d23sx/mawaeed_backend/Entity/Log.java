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
@Table(name = "log")
public class Log {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long user_id;

    @Column(name = "action_type", nullable = false)
    private String action_type;

    @Column(name = "appointment_id")
    private Long appointment_id;

    @Column(name = "cpr_or_passport_number")
    private String cpr_or_passport_number;

    @Column(name = "site_id", nullable = false)
    private Long site_id;

    @Column(name = "action_description", nullable = false)
    private String action_description;

    @Column(name = "table_name", nullable = false)
    private String table_name;

    @Column(name = "old_value")
    private String old_value;

    @Column(name = "new_value")
    private String new_value;

    @Column(name = "ip_address")
    private String ip_address;

    @Column(name = "user_agent")
    private String user_agent;

    @Column(name = "created_at")
    private LocalDateTime created_at;
}
