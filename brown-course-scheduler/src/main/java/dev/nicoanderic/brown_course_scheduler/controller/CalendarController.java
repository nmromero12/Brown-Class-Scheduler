package dev.nicoanderic.brown_course_scheduler.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {
  EventParserService eventParserService = new EventParserService();

  @Value("${clerk.secretKey}")
  private String clerkSecretKey; // Store Clerk Secret Key in application.properties

  @PostMapping("/add-event")
  public String addEvent(@RequestHeader("Authorization") String clerkToken, @RequestBody EventRequest eventRequest) throws Exception {
    // Extract user ID from the request
    EventRequest formattedEventRequest = eventParserService.parse(eventRequest);
    String userId = eventRequest.getUserId();
    if (userId == null || userId.isEmpty()) {
      throw new Exception("User ID is required");
    }

    // Fetch Google OAuth access token from Clerk
    RestTemplate restTemplate = new RestTemplate();
    String clerkApiUrl = "https://api.clerk.dev/v1/users/" + userId + "/oauth_access_tokens/oauth_google";

    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "Bearer " + clerkSecretKey);
    headers.set("Content-Type", "application/json");

    HttpEntity<String> entity = new HttpEntity<>(headers);

    String response = restTemplate.exchange(clerkApiUrl, HttpMethod.GET, entity, String.class).getBody();

    // Parse the response to extract the access token
    ObjectMapper mapper = new ObjectMapper();
    ArrayNode tokenData = (ArrayNode) mapper.readTree(response);
    String accessToken = null;
    if (!tokenData.isEmpty()) {
      accessToken = tokenData.get(0).get("token").asText();
    }

    if (accessToken == null) {
      throw new Exception("Failed to retrieve Google access token");
    }

    // Proceed with Google Calendar API
    NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();
    JacksonFactory jsonFactory = JacksonFactory.getDefaultInstance();

    Credential credential = new Credential(BearerToken.authorizationHeaderAccessMethod())
        .setAccessToken(accessToken);

    Calendar service = new Calendar.Builder(httpTransport, jsonFactory, credential)
        .setApplicationName("Brown Course Scheduler")
        .build();

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


    Event createdEvent = service.events().insert("primary", event).execute();
    return "Event created: " + createdEvent.getHtmlLink();
  }
}