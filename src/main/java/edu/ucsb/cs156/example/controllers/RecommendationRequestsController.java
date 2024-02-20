package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.RecommendationRequests;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.RecommendationRequestsRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import java.time.LocalDateTime;

@Tag(name = "RecommendationRequests")
@RequestMapping("/api/recommendationrequest")
@RestController
@Slf4j
public class RecommendationRequestsController extends ApiController {

    @Autowired
    RecommendationRequestsRepository recommendationRequestsRepository;

    @Operation(summary= "List all recommendation requests")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<RecommendationRequests> allRecommendationRequests() {
        Iterable<RecommendationRequests> requests = recommendationRequestsRepository.findAll();
        return requests;
    }

    @Operation(summary= "Create a new recommendation request")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public RecommendationRequests postRecommendationRequests(
            @Parameter(name="requesterEmail") @RequestParam String requesterEmail,
            @Parameter(name="professorEmail") @RequestParam String professorEmail,
            @Parameter(name="explanation") @RequestParam String explanation,
            @Parameter(name="dateRequested", description="date (in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601)") @RequestParam("dateRequested") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateRequested,
            @Parameter(name="dateNeeded", description="date (in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601)") @RequestParam("dateNeeded") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateNeeded,
            @Parameter(name="done") @RequestParam boolean done)
            throws JsonProcessingException {

        // For an explanation of @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        // See: https://www.baeldung.com/spring-date-parameters

        log.info("dateRequested={}", dateRequested);
        log.info("dateNeeded={}", dateNeeded);

        RecommendationRequests recommendationRequests = new RecommendationRequests();
        recommendationRequests.setRequesterEmail(requesterEmail);
        recommendationRequests.setProfessorEmail(professorEmail);
        recommendationRequests.setExplanation(explanation);
        recommendationRequests.setDateRequested(dateRequested);
        recommendationRequests.setDateNeeded(dateNeeded);
        recommendationRequests.setDone(done);


        RecommendationRequests savedRecommendationRequests = recommendationRequestsRepository.save(recommendationRequests);

        return savedRecommendationRequests;
    }

    @Operation(summary= "Get a recommendation request")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public RecommendationRequests getById(
            @Parameter(name="id") @RequestParam Long id) {
        RecommendationRequests recommendationRequests = recommendationRequestsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(RecommendationRequests.class, id));

        return recommendationRequests;
    }

    @Operation(summary= "Delete a recommendation request")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteRecommendationRequest(
            @Parameter(name="id") @RequestParam Long id) {
        RecommendationRequests recommendationRequests = recommendationRequestsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(RecommendationRequests.class, id));

        recommendationRequestsRepository.delete(recommendationRequests);
        return genericMessage("RecommendationRequest with id %s deleted".formatted(id));
    }

    @Operation(summary= "Update a single recommendation request")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public RecommendationRequests updateRecommendationRequests(
            @Parameter(name="id") @RequestParam Long id,
            @RequestBody @Valid RecommendationRequests incoming) {

        RecommendationRequests recommendationRequests = recommendationRequestsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(RecommendationRequests.class, id));

    
        recommendationRequests.setRequesterEmail(incoming.getRequesterEmail());
        recommendationRequests.setProfessorEmail(incoming.getProfessorEmail());
        recommendationRequests.setExplanation(incoming.getExplanation());
        recommendationRequests.setDateRequested(incoming.getDateRequested());
        recommendationRequests.setDateNeeded(incoming.getDateNeeded());
        recommendationRequests.setDone(incoming.getDone());

        recommendationRequestsRepository.save(recommendationRequests);

        return recommendationRequests;
    }
}
