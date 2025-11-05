package com.verizon.perksapi.model;

public class Perk {
    private Long id;
    private String name;
    private Double standalonePrice;
    private Double verizonPerkPrice; 

    public Perk() {
    }

    // Update constructor to match new fields
    public Perk(Long id, String name, Double standalonePrice, Double verizonPerkPrice) {
        this.id = id;
        this.name = name;
        this.standalonePrice = standalonePrice;
        this.verizonPerkPrice = verizonPerkPrice;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getStandalonePrice() {
        return standalonePrice;
    }

    public void setStandalonePrice(Double standalonePrice) {
        this.standalonePrice = standalonePrice;
    }

    public Double getVerizonPerkPrice() {
        return verizonPerkPrice;
    }

    public void setVerizonPerkPrice(Double verizonPerkPrice) {
        this.verizonPerkPrice = verizonPerkPrice;
    }
}