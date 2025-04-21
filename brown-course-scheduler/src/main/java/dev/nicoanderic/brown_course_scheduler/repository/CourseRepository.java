package dev.nicoanderic.brown_course_scheduler.repository;

import dev.nicoanderic.brown_course_scheduler.model.DatabaseCourse;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<DatabaseCourse, String> {
  List<DatabaseCourse> findByCourseCode(String coursecode);

  DatabaseCourse findByid(Integer id);

}
