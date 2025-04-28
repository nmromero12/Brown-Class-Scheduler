package dev.nicoanderic.brown_course_scheduler.model;

public class ScrapeCourse {
  private String code;
  private String crn;
  private String semester;

  public ScrapeCourse(String code, String crn, String semester) {
    this.code = code;
    this.crn = crn;
    this.semester = semester;
  }
  public String getCode() {
    return code;
  }
  public String getCrn() {
    return crn;
  }
  public String getSemester() {
    return semester;
  }
  public void setCrn(String crn) {
    this.crn = crn;
  }
  public void setCode(String code) {
    this.code = code;
  }
  public void setSemester(String semester) {
    this.semester = semester;
  }
}
