package com.verizon.perksapi;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.when;

import com.verizon.perksapi.controller.PerkController;
import com.verizon.perksapi.model.Perk;
import com.verizon.perksapi.service.PerkService; 

import java.util.Arrays;
import java.util.List;

@SpringBootTest
class PerksApiApplicationTests {

    @Test
    void contextLoads() {
       }
}

/**
 * Test class for the PerkController.
 * Uses @WebMvcTest to focus on testing the web layer without loading the full application context.
 * It automatically configures MockMvc and scans for @Controller components.
 */
@WebMvcTest(PerkController.class)
class PerkControllerTests {

    @Autowired
    private MockMvc mockMvc; // MockMvc is used to send HTTP requests to the controller

    @MockBean
    private PerkService perkService; // Mock the PerkService to control its behavior during tests

    /**
     * Test case to verify the GET /api/perks endpoint.
     * It checks if the endpoint returns a list of perks with the correct HTTP status (200 OK)
     * and if the JSON response contains the expected data.
     *
     * @throws Exception if any error occurs during the MockMvc request
     */
    @Test
    void getAllPerks_shouldReturnListOfPerks() throws Exception {
        // Create mock Perk objects that the service will return
        Perk perk1 = new Perk(1L, "Disney+ Hulu ESPN+ with Ads", 14.99, 10.00);
        Perk perk2 = new Perk(2L, "Netflix & Max with Ads", 16.99, 10.00);

        // Configure the mock PerkService to return our predefined list of perks
        when(perkService.getAllPerks()).thenReturn(Arrays.asList(perk1, perk2));

        // Perform a GET request to /api/perks and assert the response
        mockMvc.perform(get("/api/perks"))
                .andExpect(status().isOk()) // Expect HTTP 200 OK status
                .andExpect(jsonPath("$", hasSize(2))) // Expect a JSON array of size 2
                .andExpect(jsonPath("$[0].id", is(1))) // Assert properties of the first perk
                .andExpect(jsonPath("$[0].name", is("Disney+ Hulu ESPN+ with Ads")))
                .andExpect(jsonPath("$[0].standalonePrice", is(14.99)))
                .andExpect(jsonPath("$[0].verizonPerkPrice", is(10.00)))
                .andExpect(jsonPath("$[1].id", is(2))) // Assert properties of the second perk
                .andExpect(jsonPath("$[1].name", is("Netflix & Max with Ads")))
                .andExpect(jsonPath("$[1].standalonePrice", is(16.99)))
                .andExpect(jsonPath("$[1].verizonPerkPrice", is(10.00)));
    }

    /**
     * Test case to verify the GET /api/perks endpoint when no perks are available.
     * It checks if the endpoint returns an empty list and HTTP 200 OK status.
     *
     * @throws Exception if any error occurs during the MockMvc request
     */
    @Test
    void getAllPerks_shouldReturnEmptyList() throws Exception {
        // Configure the mock PerkService to return an empty list
        when(perkService.getAllPerks()).thenReturn(List.of());

        // Perform a GET request to /api/perks and assert the response
        mockMvc.perform(get("/api/perks"))
                .andExpect(status().isOk()) // Expect HTTP 200 OK status
                .andExpect(jsonPath("$", hasSize(0))) // Expect an empty JSON array
                .andExpect(jsonPath("$", is(List.of()))); // Ensure it's an empty list
    }
}
