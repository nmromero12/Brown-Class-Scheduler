package dev.nicoanderic.brown_course_scheduler.repository;

import dev.nicoanderic.brown_course_scheduler.model.DatabaseCourse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<DatabaseCourse, String> {
}
