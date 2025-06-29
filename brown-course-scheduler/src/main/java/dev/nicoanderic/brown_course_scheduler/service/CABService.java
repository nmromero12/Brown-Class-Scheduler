package dev.nicoanderic.brown_course_scheduler.service;

import dev.nicoanderic.brown_course_scheduler.dto.CourseInformationDto;
import dev.nicoanderic.brown_course_scheduler.model.DatabaseCourse;
import dev.nicoanderic.brown_course_scheduler.repository.CourseRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class CABService {

  private final CourseRepository courseRepository;
  private ScraperService scraperService;
  private final RestTemplate restTemplate;

  private static final String CAB_BASE_URL = "https://cab.brown.edu/api/?page=fose&route=details";

  public CABService(ScraperService scraperService, RestTemplate restTemplate,
      CourseRepository courseRepository) {
    this.scraperService = scraperService;
    this.restTemplate = restTemplate;
    this.courseRepository = courseRepository;
  }

  /**
   * Fetches course information from CAB using course metadata from the scraper,
   * sends POST requests for details, saves them to the DB, and returns a structured JSON-like object.
   */
  public Object fetchCourseInformation() {
    Map<String, List<Map<String, Object>>> responseMap = new HashMap<>();
    responseMap.put("courses", new ArrayList<>());
//    scraperService.scrape();
    var courses = scraperService.getCourses();

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);

    for (int i = 0; i < courses.size(); i++) {
      Map<String, Object> tempMap = new HashMap<>();
      Map<String, String> payload = new HashMap<>();
      payload.put("group", "code:" +  courses.get(i).getCode());
      payload.put("key", "crn:" + courses.get(i).getCrn());
      payload.put("srcdb", courses.get(i).getSemester());
      payload.put("matched", "crn:" + courses.get(i).getCrn());
      payload.put("userWithRolesStr", "!!!!!!");

      HttpEntity<Map<String, String>> request = new HttpEntity<>(payload, headers);

        CourseInformationDto courseLoad = restTemplate.postForObject(
            CAB_BASE_URL,
            request,
            CourseInformationDto.class
        );

      DatabaseCourse course = new DatabaseCourse();
      course.setCourseCode(courseLoad.getCode().replaceAll("\\s+", ""));
      course.setCourseName(courseLoad.getTitle());
      course.setCrn(courseLoad.getCrn());
      course.setClassTime(courseLoad.getMeeting_html().replaceAll("<[^>]*>", ""));
      course.setExamTime(courseLoad.getExam_html().replaceAll("<[^>]*>", "").replaceAll("&#160;", " "));
      course.setSection(courseLoad.getSection());

      courseRepository.save(course);

      tempMap.put("course code", courseLoad.getCode());
      tempMap.put("course title", courseLoad.getTitle());
      tempMap.put("crn", courseLoad.getCrn());
      tempMap.put("time" ,courseLoad.getMeeting_html().replaceAll("<[^>]*>", ""));
      tempMap.put("section", courseLoad.getSection());
      tempMap.put("exam time", courseLoad.getExam_html().replaceAll("<[^>]*>", "").replaceAll("&#160;", " "));

      responseMap.get("courses").add(tempMap);
    }

    return responseMap;
  }

  /**
   * Retrieves courses from the database by course code.
   *
   * @param coursecode The course code to search by.
   * @return A map containing the result and either matching courses or an error message.
   */
  public Object getCourseByCode(String coursecode) {
    Map<String, Object> courseMap = new HashMap<>();
    List<DatabaseCourse> courses = courseRepository.findByCourseCode(coursecode);
    if (courses.isEmpty()) {
      courseMap.put("result", "error");
      courseMap.put("message", "Sorry, no course has been found for that course code");
    } else {
      courseMap.put("result", "success");
      courseMap.put("courses", courses);
    }
    return courseMap;
  }

  /**
   * Retrieves a course from the database by its internal ID.
   *
   * @param id The database ID of the course.
   * @return A map with either the course object or an error message.
   */
  public Object getCoursebyid(Integer id) {
    Map<String, Object> courseMap = new HashMap<>();
    DatabaseCourse course = courseRepository.findByid(id);
    if (course == null) {
      courseMap.put("Error", "Cannot find course based on that id");
    } else {
      courseMap.put("course", course);
    }
    return courseMap;
  }
}
