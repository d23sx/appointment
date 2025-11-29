package com.d23sx.mawaeed_backend.Repository;

import com.d23sx.mawaeed_backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
