package com.br.techmanager.dto.equipamento;

public class ModeloEquipamentoDTO {
    public Integer id;
    public String marca;
    public String modelo;
    public Integer tipoEquipamentoId;

    public ModeloEquipamentoDTO(Integer id, String marca, String modelo, Integer tipoEquipamentoId) {
        this.id = id; this.marca = marca; this.modelo = modelo; this.tipoEquipamentoId = tipoEquipamentoId;
    }
}