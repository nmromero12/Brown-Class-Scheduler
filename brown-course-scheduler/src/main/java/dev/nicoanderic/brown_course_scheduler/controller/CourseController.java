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

@RestController
@RequestMapping("/api/courses")
public class CourseController {
  private final CABService cabService;
  private final CourseRepository courseRepository;

  public CourseController(CABService cabService, CourseRepository courseRepository) {
    this.cabService = cabService;
    this.courseRepository = courseRepository;
  }

  @GetMapping("/fetch-courses")
  public Object fetchCourses() {
    return cabService.fetchCourseInformation();

  }


  @GetMapping("/code/{courseCode}")
  public Object fetchCourseCode(@PathVariable String courseCode) {
    return cabService.getCourseByCode(courseCode);
  }

  @GetMapping("/id/{id}")
  public Object fetchCourseById(@PathVariable Integer id) {
    return cabService.getCoursebyid(id);
  }


}


