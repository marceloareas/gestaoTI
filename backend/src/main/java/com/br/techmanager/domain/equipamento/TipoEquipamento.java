package com.br.techmanager.domain.equipamento;

import jakarta.persistence.*;

@Entity
@Table(name = "tipo_equipamento", schema = "techmanager")
public class TipoEquipamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String nome;

    public Integer getId() { return id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
}