package com.d23sx.mawaeed_backend.Entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Table(name = "open_day_log")
public class OpenDayLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "site_id", nullable = false)
    private Long site_id;

    @Column(name = "open_date", nullable = false)
    private String open_date;

    @Column(name = "created_by", nullable = false)
    private Long created_by;

    @Column(name = "created_at")
    private String created_at;
}
