package com.verizon.perksapi.controller;

import com.verizon.perksapi.model.Perk;
import com.verizon.perksapi.service.PerkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; // Ensure CrossOrigin is imported

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/perks")
@CrossOrigin(origins = "*")  // <-- Allow all origins for testing
public class PerkController {

    private final PerkService perkService;

    @Autowired
    public PerkController(PerkService perkService) {
        this.perkService = perkService;
    }

    @GetMapping
    public List<Perk> getAllPerks() {
        return perkService.getAllPerks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Perk> getPerkById(@PathVariable Long id) {
        Optional<Perk> perk = perkService.getPerkById(id);
        return perk.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Perk> createPerk(@RequestBody Perk perk) {
        Perk createdPerk = perkService.createPerk(perk);
        return new ResponseEntity<>(createdPerk, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Perk> updatePerk(@PathVariable Long id, @RequestBody Perk perk) {
        Perk updated = perkService.updatePerk(id, perk);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePerk(@PathVariable Long id) {
        perkService.deletePerk(id);
        return ResponseEntity.noContent().build();
    }
}
