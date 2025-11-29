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
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_role_id", nullable = false, unique = true)
    private Long user_role_id;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "ar_name", nullable = false)
    private String ar_name;

    @Column(name = "eng_name", nullable = false)
    private String eng_name;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "phone_number")
    private String phone_number;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "is_active", nullable = false)
    private boolean is_active;

    @Column(name = "created_at")
    private LocalDateTime created_at;

    @Column(name = "updated_at")
    private LocalDateTime updated_at;
}
