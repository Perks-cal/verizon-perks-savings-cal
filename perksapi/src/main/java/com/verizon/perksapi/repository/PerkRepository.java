package com.verizon.perksapi.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.verizon.perksapi.model.Perk;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Repository;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap; 

@Repository
public class PerkRepository {

    private final Map<Long, Perk> perks = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper;
    private final ResourceLoader resourceLoader;

    @Value("${perks.data.json.path:classpath:static/data.json}") 
    private String perksDataPath;

    public PerkRepository(ObjectMapper objectMapper, ResourceLoader resourceLoader) {
        this.objectMapper = objectMapper;
        this.resourceLoader = resourceLoader;
    }

    @PostConstruct
    public void init() {
        try {
            Resource resource = resourceLoader.getResource(perksDataPath);
            try (InputStream inputStream = resource.getInputStream()) {
                // This line will correctly parse the new JSON structure as well
                List<Perk> loadedPerks = objectMapper.readValue(inputStream, new TypeReference<List<Perk>>() {});

                loadedPerks.forEach(perk -> {
                    if (perk.getId() != null) {
                        perks.put(perk.getId(), perk);
                    } else {
                        System.err.println("Perk loaded from JSON is missing an 'id' field. Skipping perk: " + perk.getName());
                    }
                });

                System.out.println("Loaded " + perks.size() + " perks from " + perksDataPath);
            }
        } catch (IOException e) {
            System.err.println("Failed to load perks from JSON file: " + perksDataPath);
            e.printStackTrace();
        }
    }

    public List<Perk> findAll() {
        return new ArrayList<>(perks.values());
    }

    public Optional<Perk> findById(Long id) {
        return Optional.ofNullable(perks.get(id));
    }

    public Perk save(Perk perk) {
        if (perk.getId() == null) {
            long newId = perks.keySet().stream().mapToLong(Long::longValue).max().orElse(0L) + 1;
            perk.setId(newId);
            perks.put(newId, perk);
        } else {
            perks.put(perk.getId(), perk);
        }
        return perk;
    }

    public void deleteById(Long id) {
        perks.remove(id);
    }

    public boolean existsById(Long id) {
        return perks.containsKey(id);
    }
}