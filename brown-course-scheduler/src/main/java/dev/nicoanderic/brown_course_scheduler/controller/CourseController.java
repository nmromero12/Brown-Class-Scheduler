package dev.nicoanderic.brown_course_scheduler.controller;


import dev.nicoanderic.brown_course_scheduler.repository.CourseRepository;
import dev.nicoanderic.brown_course_scheduler.service.CABService;
import org.springframework.web.bind.annotation.GetMapping;
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


}
