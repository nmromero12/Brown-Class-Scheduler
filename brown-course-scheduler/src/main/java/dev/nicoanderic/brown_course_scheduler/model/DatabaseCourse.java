package dev.nicoanderic.brown_course_scheduler.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "courses")
public class DatabaseCourse {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;


  private String courseCode;
  private String courseName;
  private String examTime;
  private String section;
  private String classTime;
  private String crn;

  public DatabaseCourse() {
  }

  public Integer getId() {
    return id;
  }

  public String getCourseCode() {
    return courseCode;
  }

  public String getCourseName() {
    return courseName;
  }

  public String getExamTime() {
    return examTime;
  }

  public String getSection() {
    return section;
  }

  public String getClassTime() {
    return classTime;
  }

  public String getCrn() {
    return crn;
  }

  public DatabaseCourse(String courseCode, String courseName, String examTime, String section, String classTime, String crn, Integer id) {
    this.courseCode = courseCode;
    this.courseName = courseName;
    this.examTime = examTime;
    this.section = section;
    this.classTime = classTime;
    this.crn = crn;
    this.id = id;
  }


  public void setCourseCode(String courseCode) {
    this.courseCode = courseCode;
  }

  public void setCourseName(String courseName) {
    this.courseName = courseName;
  }

  public void setExamTime(String examTime) {
    this.examTime = examTime;
  }

  public void setSection(String section) {
    this.section = section;
  }

  public void setClassTime(String classTime) {
    this.classTime = classTime;
  }

  public void setCrn(String crn) {
    this.crn = crn;
  }
  public void setId(Integer id) {
    this.id = id;
  }
}
