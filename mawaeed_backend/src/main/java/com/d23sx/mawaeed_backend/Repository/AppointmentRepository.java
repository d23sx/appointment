package com.d23sx.mawaeed_backend.Repository;

import com.d23sx.mawaeed_backend.Entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
}
