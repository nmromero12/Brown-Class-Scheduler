package dev.nicoanderic.brown_course_scheduler.repository;

import dev.nicoanderic.brown_course_scheduler.model.DatabaseCourse;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository interface for accessing DatabaseCourse entities.
 * Extends JpaRepository to provide standard CRUD operations.
 */
public interface CourseRepository extends JpaRepository<DatabaseCourse, String> {

  /**
   * Retrieves all courses matching the specified course code.
   *
   * @param coursecode The course code to search for
   * @return A list of DatabaseCourse entities with the given course code
   */
  List<DatabaseCourse> findByCourseCode(String coursecode);

  /**
   * Finds a single course by its unique integer ID.
   *
   * @param id The integer ID of the course
   * @return The DatabaseCourse matching the given ID, or null if none found
   */
  DatabaseCourse findByid(Integer id);

}
