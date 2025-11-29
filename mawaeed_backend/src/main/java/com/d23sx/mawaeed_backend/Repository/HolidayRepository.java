package com.d23sx.mawaeed_backend.Repository;

import com.d23sx.mawaeed_backend.Entity.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HolidayRepository extends JpaRepository<Holiday, Long> {
}
