package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.UCSBMenuItemReview;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.UCSBMenuItemReviewRepository;

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

@Tag(name = "UCSBMenuItemReviews")
@RequestMapping("/api/ucsbmenuitemreviews")
@RestController
@Slf4j
public class UCSBMenuItemReviewsController extends ApiController {

    @Autowired
    UCSBMenuItemReviewRepository ucsbMenuItemReviewRepository;

    @Operation(summary= "List all menu item reviews")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<UCSBMenuItemReview> allMenuItemReviews() {
        Iterable<UCSBMenuItemReview> menuItemReviews = ucsbMenuItemReviewRepository.findAll();
        return menuItemReviews;
    }

    @Operation(summary= "Create a new menu item review")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public UCSBMenuItemReview postUCSBMenuItemReview(
            @Parameter(name="itemId") @RequestParam long itemId,
            @Parameter(name="reviewerEmail") @RequestParam String reviewerEmail,
            @Parameter(name="stars") @RequestParam int stars,
            @Parameter(name="dateReviewed",description="in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601") @RequestParam("dateReviewed") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateReviewed,
            @Parameter(name="comments") @RequestParam String comments
            )
            throws JsonProcessingException {

        // For an explanation of @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        // See: https://www.baeldung.com/spring-date-parameters

        log.info("dateReviewed={}", dateReviewed);

        UCSBMenuItemReview ucsbMenuItemReview = new UCSBMenuItemReview();
        ucsbMenuItemReview.setItemId(itemId);
        ucsbMenuItemReview.setReviewerEmail(reviewerEmail);
        ucsbMenuItemReview.setStars(stars);
        ucsbMenuItemReview.setDateReviewed(dateReviewed);
        ucsbMenuItemReview.setComments(comments);

        UCSBMenuItemReview savedUcsbMenuItemReview = ucsbMenuItemReviewRepository.save(ucsbMenuItemReview);

        return savedUcsbMenuItemReview;
    }

    @Operation(summary= "Get a single menu item review")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public UCSBMenuItemReview getById(
            @Parameter(name="id") @RequestParam Long id) {
        UCSBMenuItemReview ucsbMenuItemReview = ucsbMenuItemReviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(UCSBMenuItemReview.class, id));

        return ucsbMenuItemReview;
    }

    @Operation(summary= "Delete a MenuItemReview")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteUCSBMenuItemReview(
            @Parameter(name="id") @RequestParam Long id) {
        UCSBMenuItemReview ucsbMenuItemReview = ucsbMenuItemReviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(UCSBMenuItemReview.class, id));

        ucsbMenuItemReviewRepository.delete(ucsbMenuItemReview);
        return genericMessage("UCSBMenuItemReview with id %s deleted".formatted(id));
    }

    @Operation(summary= "Update a single menuitemreview")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public UCSBMenuItemReview updateUCSBMenuItemReview(
            @Parameter(name="id") @RequestParam Long id,
            @RequestBody @Valid UCSBMenuItemReview incoming) {

        UCSBMenuItemReview ucsbMenuItemReview = ucsbMenuItemReviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(UCSBMenuItemReview.class, id));

        ucsbMenuItemReview.setItemId(incoming.getItemId());
        ucsbMenuItemReview.setReviewerEmail(incoming.getReviewerEmail());
        ucsbMenuItemReview.setStars(incoming.getStars());
        ucsbMenuItemReview.setDateReviewed(incoming.getDateReviewed());
        ucsbMenuItemReview.setComments(incoming.getComments());

        ucsbMenuItemReviewRepository.save(ucsbMenuItemReview);

        return ucsbMenuItemReview;
    }
}
