package com.br.techmanager.domain.equipamento;

import jakarta.persistence.*;

@Entity
@Table(name = "modelo_equipamento", schema = "techmanager",
       uniqueConstraints = @UniqueConstraint(columnNames = {"marca", "modelo"}))
public class ModeloEquipamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false) private String marca;
    @Column(nullable = false) private String modelo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_equipamento_id", nullable = false)
    private TipoEquipamento tipoEquipamento;

    public Integer getId() { return id; }
    public String getMarca() { return marca; }
    public String getModelo() { return modelo; }
    public TipoEquipamento getTipoEquipamento() { return tipoEquipamento; }

    public void setMarca(String marca) { this.marca = marca; }
    public void setModelo(String modelo) { this.modelo = modelo; }
    public void setTipoEquipamento(TipoEquipamento tipoEquipamento) { this.tipoEquipamento = tipoEquipamento; }
}