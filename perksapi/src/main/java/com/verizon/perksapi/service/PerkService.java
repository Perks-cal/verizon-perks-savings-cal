package com.verizon.perksapi.service;

import com.verizon.perksapi.model.Perk;
import com.verizon.perksapi.repository.PerkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PerkService {

    private final PerkRepository perkRepository;

    @Autowired
    public PerkService(PerkRepository perkRepository) {
        this.perkRepository = perkRepository;
    }

    public List<Perk> getAllPerks() {
        return perkRepository.findAll();
    }

    public Optional<Perk> getPerkById(Long id) {
        return perkRepository.findById(id);
    }

    public Perk createPerk(Perk perk) {
        return perkRepository.save(perk);
    }

    public Perk updatePerk(Long id, Perk updatedPerk) {
        return perkRepository.findById(id)
                .map(existingPerk -> {
                    existingPerk.setName(updatedPerk.getName());
                    // Update price fields instead of description
                    existingPerk.setStandalonePrice(updatedPerk.getStandalonePrice());
                    existingPerk.setVerizonPerkPrice(updatedPerk.getVerizonPerkPrice());
                    return perkRepository.save(existingPerk);
                })
                .orElse(null);
    }

    public void deletePerk(Long id) {
        if (perkRepository.existsById(id)) {
            perkRepository.deleteById(id);
        } else {
            System.out.println("Perk with ID " + id + " not found for deletion.");
        }
    }
}