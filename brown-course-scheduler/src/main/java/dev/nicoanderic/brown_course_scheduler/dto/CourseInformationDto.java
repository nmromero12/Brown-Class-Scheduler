package dev.nicoanderic.brown_course_scheduler.dto;

public class CourseInformationDto {
  private String code;
  private String section;
  private String crn;
  private String title;
  private String meeting_html;
  private String exam_html;

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public String getSection() {
    return section;
  }

  public void setSection(String section) {
    this.section = section;
  }

  public String getCrn() {
    return crn;
  }

  public void setCrn(String crn) {
    this.crn = crn;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getMeeting_html() {
    return meeting_html;
  }

  public void setMeeting_html(String meeting_html) {
    this.meeting_html = meeting_html;
  }

  public String getExam_html() {
    return exam_html;
  }
  public void setExam_html(String exam_html) {
    this.exam_html = exam_html;
  }


}

