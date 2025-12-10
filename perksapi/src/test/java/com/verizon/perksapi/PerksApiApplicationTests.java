package com.verizon.perksapi;

import com.verizon.perksapi.controller.PerkController;
import com.verizon.perksapi.model.Perk;
import com.verizon.perksapi.service.PerkService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PerkController.class)
class PerkControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PerkService perkService;

    @Test
    void getAllPerks_shouldReturnListOfPerks() throws Exception {
        Perk perk1 = new Perk(1L, "Disney+ Hulu ESPN+ with Ads", 14.99, 10.00);
        Perk perk2 = new Perk(2L, "Netflix & Max with Ads", 16.99, 10.00);

        when(perkService.getAllPerks()).thenReturn(Arrays.asList(perk1, perk2));

        mockMvc.perform(get("/api/perks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].name", is("Disney+ Hulu ESPN+ with Ads")))
                .andExpect(jsonPath("$[0].standalonePrice", is(14.99)))
                .andExpect(jsonPath("$[0].verizonPerkPrice", is(10.00)))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].name", is("Netflix & Max with Ads")))
                .andExpect(jsonPath("$[1].standalonePrice", is(16.99)))
                .andExpect(jsonPath("$[1].verizonPerkPrice", is(10.00)));
    }

    @Test
    void getAllPerks_shouldReturnEmptyList() throws Exception {
        when(perkService.getAllPerks()).thenReturn(List.of());

        mockMvc.perform(get("/api/perks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void getPerkById_shouldReturnPerk_whenValidId() throws Exception {
        Perk perk = new Perk(1L, "Disney+ Hulu ESPN+ with Ads", 14.99, 10.00);
        when(perkService.getPerkById(1L)).thenReturn(Optional.of(perk));

        mockMvc.perform(get("/api/perks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Disney+ Hulu ESPN+ with Ads")))
                .andExpect(jsonPath("$.standalonePrice", is(14.99)))
                .andExpect(jsonPath("$.verizonPerkPrice", is(10.00)));
    }

    @Test
    void getPerkById_shouldReturnNotFound_whenInvalidId() throws Exception {
        when(perkService.getPerkById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/perks/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createPerk_shouldReturnCreatedPerk() throws Exception {
        String perkJson = """
            {
                "name": "Apple Music",
                "standalonePrice": 10.99,
                "verizonPerkPrice": 5.99
            }
        """;

        Perk savedPerk = new Perk(3L, "Apple Music", 10.99, 5.99);
        when(perkService.createPerk(any(Perk.class))).thenReturn(savedPerk);

        mockMvc.perform(post("/api/perks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(perkJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(3)))
                .andExpect(jsonPath("$.name", is("Apple Music")))
                .andExpect(jsonPath("$.standalonePrice", is(10.99)))
                .andExpect(jsonPath("$.verizonPerkPrice", is(5.99)));
    }

    @Test
    void updatePerk_shouldReturnUpdatedPerk() throws Exception {
        String updatedJson = """
            {
                "name": "Netflix Premium",
                "standalonePrice": 19.99,
                "verizonPerkPrice": 11.99
            }
        """;

        Perk updatedPerk = new Perk(2L, "Netflix Premium", 19.99, 11.99);
        when(perkService.updatePerk(eq(2L), any(Perk.class))).thenReturn(updatedPerk);

        mockMvc.perform(put("/api/perks/2")
                .contentType(MediaType.APPLICATION_JSON)
                .content(updatedJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(2)))
                .andExpect(jsonPath("$.name", is("Netflix Premium")))
                .andExpect(jsonPath("$.standalonePrice", is(19.99)))
                .andExpect(jsonPath("$.verizonPerkPrice", is(11.99)));
    }

    @Test
    void deletePerk_shouldReturnNoContent_whenValidId() throws Exception {
        mockMvc.perform(delete("/api/perks/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void invalidEndpoint_shouldReturn404() throws Exception {
        mockMvc.perform(get("/api/unknown"))
                .andExpect(status().isNotFound());
    }
}
