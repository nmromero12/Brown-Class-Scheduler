package dev.nicoanderic.brown_course_scheduler.controller;

import com.google.api.client.auth.oauth2.BearerToken;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import dev.nicoanderic.brown_course_scheduler.model.EventRequest;
import dev.nicoanderic.brown_course_scheduler.service.EventParserService;
import java.util.Arrays;
import java.util.List;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {
  EventParserService eventParserService = new EventParserService();

  @PostMapping("/add-event")
  public String addEvent(@RequestHeader("Authorization") String authHeader, @RequestBody EventRequest eventRequest) throws Exception {
    // Extract access token from Authorization header
    String accessToken = authHeader.replace("Bearer ", "");
    if (accessToken == null || accessToken.isEmpty()) {
      throw new Exception("Access token is required");
    }

    // Format the event request
    EventRequest formattedEventRequest = eventParserService.parse(eventRequest);
    String userId = eventRequest.getUserId();
    if (userId == null || userId.isEmpty()) {
      throw new Exception("User ID is required");
    }

    // Proceed with Google Calendar API
    NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();
    JacksonFactory jsonFactory = JacksonFactory.getDefaultInstance();

    Credential credential = new Credential(BearerToken.authorizationHeaderAccessMethod())
        .setAccessToken(accessToken);

    Calendar service = new Calendar.Builder(httpTransport, jsonFactory, credential)
        .setApplicationName("Brown Course Scheduler")
        .build();

    // First, find the Course Scheduler Calendar
    String calendarId = null;
    var calendarList = service.calendarList().list().execute();
    for (var calendar : calendarList.getItems()) {
      if ("Course Scheduler Calendar".equals(calendar.getSummary())) {
        calendarId = calendar.getId();
        break;
      }
    }

    if (calendarId == null) {
      throw new Exception("Course Scheduler Calendar not found");
    }

    Event event = new Event()
        .setSummary(formattedEventRequest.getSummary())
        .setDescription(formattedEventRequest.getDescription());

    DateTimeFormatter formatter = DateTimeFormatter.ISO_ZONED_DATE_TIME;
    EventDateTime start = new EventDateTime().setDateTime(new com.google.api.client.util.DateTime(
        ZonedDateTime.parse(formattedEventRequest.getStartTime(), formatter).toInstant().toEpochMilli())).setTimeZone("America/New_York");
    EventDateTime end = new EventDateTime().setDateTime(new com.google.api.client.util.DateTime(
        ZonedDateTime.parse(formattedEventRequest.getEndTime(), formatter).toInstant().toEpochMilli())).setTimeZone("America/New_York");

    event.setStart(start);
    event.setEnd(end);
    List<String> recurrence = Arrays.asList(formattedEventRequest.getRecurrenceRule());
    event.setRecurrence(recurrence);

    // Insert the event into the Course Scheduler Calendar
    Event createdEvent = service.events().insert(calendarId, event).execute();
    return "Event created: " + createdEvent.getHtmlLink();
  }
}