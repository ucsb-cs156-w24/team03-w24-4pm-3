package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.UCSBMenuItemReview;
import edu.ucsb.cs156.example.repositories.UCSBMenuItemReviewRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.time.LocalDateTime;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = UCSBMenuItemReviewsController.class)
@Import(TestConfig.class)
public class UCSBMenuItemReviewsControllerTests extends ControllerTestCase {

        @MockBean
        UCSBMenuItemReviewRepository ucsbMenuItemReviewRepository;

        @MockBean
        UserRepository userRepository;

        // Tests for GET /api/ucsbmenuitemreviews/all
        
        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/ucsbmenuitemreviews/all"))
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_all() throws Exception {
                mockMvc.perform(get("/api/ucsbmenuitemreviews/all"))
                                .andExpect(status().is(200)); // logged
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_ucsbmenuitemreviews() throws Exception {

                // arrange
                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                UCSBMenuItemReview ucsbMenuItemReview1 = UCSBMenuItemReview.builder()
                                .itemId(42)
                                .reviewerEmail("berrylover@ucsb.edu")
                                .stars(5)
                                .dateReviewed(ldt1)
                                .comments("berry yummy")
                                .build();

                LocalDateTime ldt2 = LocalDateTime.parse("2022-03-11T00:00:00");

                UCSBMenuItemReview ucsbMenuItemReview2 = UCSBMenuItemReview.builder()
                                .itemId(21)
                                .reviewerEmail("bananalover@ucsb.edu")
                                .stars(1)
                                .dateReviewed(ldt2)
                                .comments("imperfect banana")
                                .build();

                ArrayList<UCSBMenuItemReview> expectedMenuItemReviews = new ArrayList<>();
                expectedMenuItemReviews.addAll(Arrays.asList(ucsbMenuItemReview1, ucsbMenuItemReview2));

                when(ucsbMenuItemReviewRepository.findAll()).thenReturn(expectedMenuItemReviews);

                // act
                MvcResult response = mockMvc.perform(get("/api/ucsbmenuitemreviews/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(ucsbMenuItemReviewRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedMenuItemReviews);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        // Tests for POST /api/ucsbmenuitemreviews/post...

        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/ucsbmenuitemreviews/post"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_regular_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/ucsbmenuitemreviews/post"))
                                .andExpect(status().is(403)); // only admins can post
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_ucsbmenuitemreview() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                UCSBMenuItemReview ucsbMenuItemReview1 = UCSBMenuItemReview.builder()
                                .itemId(42)
                                .reviewerEmail("berrylover@ucsb.edu")
                                .stars(5)
                                .dateReviewed(ldt1)
                                .comments("berry yummy")
                                .build();

                when(ucsbMenuItemReviewRepository.save(eq(ucsbMenuItemReview1))).thenReturn(ucsbMenuItemReview1);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/ucsbmenuitemreviews/post?itemId=42&reviewerEmail=berrylover@ucsb.edu&stars=5&dateReviewed=2022-01-03T00:00:00&comments=berry yummy")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(ucsbMenuItemReviewRepository, times(1)).save(ucsbMenuItemReview1);
                String expectedJson = mapper.writeValueAsString(ucsbMenuItemReview1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        // Tests for GET /api/ucsbmenuitemreviews?id=...

        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/ucsbmenuitemreviews?id=7"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

                // arrange
                LocalDateTime ldt = LocalDateTime.parse("2022-01-03T00:00:00");

                UCSBMenuItemReview ucsbMenuItemReview = UCSBMenuItemReview.builder()
                                .itemId(42)
                                .reviewerEmail("berrylover@ucsb.edu")
                                .stars(5)
                                .dateReviewed(ldt)
                                .comments("berry yummy")
                                .build();

                when(ucsbMenuItemReviewRepository.findById(eq(7L))).thenReturn(Optional.of(ucsbMenuItemReview));

                // act
                MvcResult response = mockMvc.perform(get("/api/ucsbmenuitemreviews?id=7"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(ucsbMenuItemReviewRepository, times(1)).findById(eq(7L));
                String expectedJson = mapper.writeValueAsString(ucsbMenuItemReview);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(ucsbMenuItemReviewRepository.findById(eq(7L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/ucsbmenuitemreviews?id=7"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(ucsbMenuItemReviewRepository, times(1)).findById(eq(7L));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("UCSBMenuItemReview with id 7 not found", json.get("message"));
        }


        // Tests for DELETE /api/ucsbmenuitemreviews?id=... 

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_a_menuitemreview() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                UCSBMenuItemReview ucsbMenuItemReview1 = UCSBMenuItemReview.builder()
                                .itemId(42)
                                .reviewerEmail("berrylover@ucsb.edu")
                                .stars(5)
                                .dateReviewed(ldt1)
                                .comments("berry yummy")
                                .build();

                when(ucsbMenuItemReviewRepository.findById(eq(15L))).thenReturn(Optional.of(ucsbMenuItemReview1));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/ucsbmenuitemreviews?id=15")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(ucsbMenuItemReviewRepository, times(1)).findById(15L);
                verify(ucsbMenuItemReviewRepository, times(1)).delete(any());

                Map<String, Object> json = responseToJson(response);
                assertEquals("UCSBMenuItemReview with id 15 deleted", json.get("message"));
        }
        
        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existent_ucsbmenuitemreview_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(ucsbMenuItemReviewRepository.findById(eq(15L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/ucsbmenuitemreviews?id=15")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(ucsbMenuItemReviewRepository, times(1)).findById(15L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("UCSBMenuItemReview with id 15 not found", json.get("message"));
        }

        // Tests for PUT /api/ucsbmenuitemreviews?id=... 

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_ucsbmenuitemreview() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
                LocalDateTime ldt2 = LocalDateTime.parse("2023-01-04T00:00:00");

                UCSBMenuItemReview ucsbMenuItemReviewOrig = UCSBMenuItemReview.builder()
                                .itemId(21)
                                .reviewerEmail("bananahater@ucsb.edu")
                                .stars(1)
                                .dateReviewed(ldt1)
                                .comments("imperfect banana")
                                .build();

                UCSBMenuItemReview ucsbMenuItemReviewEdited = UCSBMenuItemReview.builder()
                                .itemId(42)
                                .reviewerEmail("bananalover@ucsb.edu")
                                .stars(5)
                                .dateReviewed(ldt2)
                                .comments("perfect bananas")
                                .build();

                String requestBody = mapper.writeValueAsString(ucsbMenuItemReviewEdited);

                when(ucsbMenuItemReviewRepository.findById(eq(67L))).thenReturn(Optional.of(ucsbMenuItemReviewOrig));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/ucsbmenuitemreviews?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(ucsbMenuItemReviewRepository, times(1)).findById(67L);
                verify(ucsbMenuItemReviewRepository, times(1)).save(ucsbMenuItemReviewEdited); // should be saved with correct user
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        
        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_ucsbmenuitemreview_that_does_not_exist() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                UCSBMenuItemReview ucsbEditedMenuItemReview = UCSBMenuItemReview.builder()
                                .itemId(21)
                                .reviewerEmail("bananalover@ucsb.edu")
                                .stars(5)
                                .dateReviewed(ldt1)
                                .comments("perfect bananas")
                                .build();

                String requestBody = mapper.writeValueAsString(ucsbEditedMenuItemReview);

                when(ucsbMenuItemReviewRepository.findById(eq(67L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/ucsbmenuitemreviews?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(ucsbMenuItemReviewRepository, times(1)).findById(67L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("UCSBMenuItemReview with id 67 not found", json.get("message"));

        }
}
