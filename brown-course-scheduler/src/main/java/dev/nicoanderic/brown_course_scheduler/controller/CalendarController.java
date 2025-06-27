<<<<<<< HEAD
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

    EventRequest formattedEventRequest = eventParserService.parse(eventRequest);

    String userId = eventRequest.getUserId();
    if (userId == null || userId.isEmpty()) {
      throw new Exception("User ID is required");
    }


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

    // Parse start and end times, set timezone and apply to event
    DateTimeFormatter formatter = DateTimeFormatter.ISO_ZONED_DATE_TIME;
    EventDateTime start = new EventDateTime().setDateTime(new com.google.api.client.util.DateTime(
        ZonedDateTime.parse(formattedEventRequest.getStartTime(), formatter).toInstant().toEpochMilli())).setTimeZone("America/New_York");
    EventDateTime end = new EventDateTime().setDateTime(new com.google.api.client.util.DateTime(
        ZonedDateTime.parse(formattedEventRequest.getEndTime(), formatter).toInstant().toEpochMilli())).setTimeZone("America/New_York");

    event.setStart(start);
    event.setEnd(end);

    // Add recurrence rules if any
    List<String> recurrence = Arrays.asList(formattedEventRequest.getRecurrenceRule());
    event.setRecurrence(recurrence);


    // Insert the event into the Course Scheduler Calendar
    Event createdEvent = service.events().insert(calendarId, event).execute();
    return "Event created: " + createdEvent.getHtmlLink();
  }
}
=======
//package dev.nicoanderic.brown_course_scheduler.controller;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.fasterxml.jackson.databind.node.ArrayNode;
//import com.google.api.client.auth.oauth2.BearerToken;
//import com.google.api.client.auth.oauth2.Credential;
//import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
//import com.google.api.client.http.javanet.NetHttpTransport;
//import com.google.api.client.json.jackson2.JacksonFactory;
//import com.google.api.services.calendar.Calendar;
//import com.google.api.services.calendar.model.Event;
//import com.google.api.services.calendar.model.EventDateTime;
//import dev.nicoanderic.brown_course_scheduler.model.EventRequest;
//import dev.nicoanderic.brown_course_scheduler.service.EventParserService;
//import java.util.Arrays;
//import java.util.List;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpEntity;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpMethod;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.client.RestTemplate;
//
//import java.time.ZonedDateTime;
//import java.time.format.DateTimeFormatter;
//
//@RestController
//@RequestMapping("/api/calendar")
//public class CalendarController {
//  EventParserService eventParserService = new EventParserService();
//
//  @Value("${clerk.secretKey}")
//  private String clerkSecretKey; // Clerk Secret Key loaded from application properties
//
//  /**
//   * Adds an event to the user's Google Calendar.
//   *
//   * @param clerkToken Authorization header token from client (not currently used directly)
//   * @param eventRequest Event details provided in the request body
//   * @return A confirmation message including the created event's Google Calendar link
//   * @throws Exception if user ID or Google access token cannot be retrieved
//   */
//  @PostMapping("/add-event")
//  public String addEvent(@RequestHeader("Authorization") String clerkToken, @RequestBody EventRequest eventRequest) throws Exception {
//    // Parse and format the incoming event details
//    EventRequest formattedEventRequest = eventParserService.parse(eventRequest);
//
//    String userId = eventRequest.getUserId();
//    if (userId == null || userId.isEmpty()) {
//      throw new Exception("User ID is required");
//    }
//
//    // Construct URL to fetch Google OAuth token associated with this user from Clerk
//    RestTemplate restTemplate = new RestTemplate();
//    String clerkApiUrl = "https://api.clerk.dev/v1/users/" + userId + "/oauth_access_tokens/oauth_google";
//
//    HttpHeaders headers = new HttpHeaders();
//    headers.set("Authorization", "Bearer " + clerkSecretKey);
//    headers.set("Content-Type", "application/json");
//
//    HttpEntity<String> entity = new HttpEntity<>(headers);
//
//    // Call Clerk API to get the OAuth access token for Google Calendar
//    String response = restTemplate.exchange(clerkApiUrl, HttpMethod.GET, entity, String.class).getBody();
//
//    // Parse JSON response to extract token
//    ObjectMapper mapper = new ObjectMapper();
//    ArrayNode tokenData = (ArrayNode) mapper.readTree(response);
//    String accessToken = null;
//    if (!tokenData.isEmpty()) {
//      accessToken = tokenData.get(0).get("token").asText();
//    }
//
//    if (accessToken == null) {
//      throw new Exception("Failed to retrieve Google access token");
//    }
//
//    // Build Google Calendar service client using OAuth token
//    NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();
//    JacksonFactory jsonFactory = JacksonFactory.getDefaultInstance();
//
//    Credential credential = new Credential(BearerToken.authorizationHeaderAccessMethod())
//        .setAccessToken(accessToken);
//
//    Calendar service = new Calendar.Builder(httpTransport, jsonFactory, credential)
//        .setApplicationName("Brown Course Scheduler")
//        .build();
//
//    // Create Google Calendar event and set basic details
//    Event event = new Event()
//        .setSummary(formattedEventRequest.getSummary())
//        .setDescription(formattedEventRequest.getDescription());
//
//    // Parse start and end times, set timezone and apply to event
//    DateTimeFormatter formatter = DateTimeFormatter.ISO_ZONED_DATE_TIME;
//    EventDateTime start = new EventDateTime().setDateTime(new com.google.api.client.util.DateTime(
//        ZonedDateTime.parse(formattedEventRequest.getStartTime(), formatter).toInstant().toEpochMilli())).setTimeZone("America/New_York");
//    EventDateTime end = new EventDateTime().setDateTime(new com.google.api.client.util.DateTime(
//        ZonedDateTime.parse(formattedEventRequest.getEndTime(), formatter).toInstant().toEpochMilli())).setTimeZone("America/New_York");
//
//    event.setStart(start);
//    event.setEnd(end);
//
//    // Add recurrence rules if any
//    List<String> recurrence = Arrays.asList(formattedEventRequest.getRecurrenceRule());
//    event.setRecurrence(recurrence);
//
//    // Insert event into user's primary calendar
//    Event createdEvent = service.events().insert("primary", event).execute();
//
//    return "Event created: " + createdEvent.getHtmlLink();
//  }
//}
>>>>>>> parent of 3da4640 (Deleted CalendarController as it is no longer used)
