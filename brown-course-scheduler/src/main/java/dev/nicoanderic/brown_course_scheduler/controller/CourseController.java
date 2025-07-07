package dev.nicoanderic.brown_course_scheduler.controller;

import dev.nicoanderic.brown_course_scheduler.model.DatabaseCourse;
import dev.nicoanderic.brown_course_scheduler.repository.CourseRepository;
import dev.nicoanderic.brown_course_scheduler.service.CABService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller providing endpoints related to course data.
 * Delegates business logic to CABService and data access to CourseRepository.
 */
@RestController
@RequestMapping("/api/courses")
public class CourseController {
  private final CABService cabService;
  private final CourseRepository courseRepository;

  /**
   * Constructor injecting required services and repositories.
   *
   * @param cabService Service for course-related operations
   * @param courseRepository Repository interface for course data access
   */
  public CourseController(CABService cabService, CourseRepository courseRepository) {
    this.cabService = cabService;
    this.courseRepository = courseRepository;
  }

  /**
   * Endpoint to fetch the full list of courses from the CAB service.
   *
   * @return An object representing course information (likely a list or map)
   */

  /**
   * Endpoint to fetch course details by course code.
   *
   * @param courseCode The course code to look up
   * @return Course information associated with the specified code
   */
  @GetMapping("/code/{courseCode}")
  public Object fetchCourseCode(@PathVariable String courseCode) {
    return cabService.getCourseByCode(courseCode);
  }

  /**
   * Endpoint to fetch course details by unique integer ID.
   *
   * @param id The ID of the course to retrieve
   * @return Course information for the given ID
   */
  @GetMapping("/id/{id}")
  public Object fetchCourseById(@PathVariable Integer id) {
    return cabService.getCoursebyid(id);
  }
}
