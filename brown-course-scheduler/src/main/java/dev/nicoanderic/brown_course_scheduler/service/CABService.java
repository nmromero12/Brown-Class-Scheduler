package dev.nicoanderic.brown_course_scheduler.service;

import dev.nicoanderic.brown_course_scheduler.dto.CourseInformationDto;
import dev.nicoanderic.brown_course_scheduler.model.DatabaseCourse;
import dev.nicoanderic.brown_course_scheduler.repository.CourseRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.hibernate.dialect.Database;
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

  public Object fetchCourseInformation() {
    Map<String, List<Map<String, Object>>> responseMap = new HashMap<>();
    responseMap.put("courses", new ArrayList<>());
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
      CourseInformationDto courseLoad = restTemplate.postForObject(CAB_BASE_URL, request,
          CourseInformationDto.class);

      DatabaseCourse course = new DatabaseCourse();
      course.setCourseCode(courseLoad.getCode());
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

  public List<DatabaseCourse> getCourseByCode(String coursecode) {
    return courseRepository.findByCourseCode(coursecode);
  }

  public Object getCoursebyid(Integer id) {
    Map<String, DatabaseCourse> courseMap = new HashMap<>();
    DatabaseCourse course = courseRepository.findByid(id);
    courseMap.put("course", course);
    return courseMap;
  }
}
