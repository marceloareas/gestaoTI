package com.br.techmanager.domain.equipamento;

import jakarta.persistence.*;

@Entity
@Table(name = "categoria_uso", schema = "techmanager")
public class CategoriaUso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // O segredo está no columnDefinition: 
    // bpchar é como o Postgres trata o tipo character(1)
    @Column(nullable = false, columnDefinition = "bpchar", length = 1)
    private String codigo;

    @Column(nullable = false)
    private String descricao;

    // Construtor padrão exigido pelo JPA
    public CategoriaUso() {
    }

    // Getters
    public Integer getId() {
        return id;
    }

    public String getCodigo() {
        return codigo;
    }

    public String getDescricao() {
        return descricao;
    }

    // Setters (Caso precise salvar dados futuramente)
    public void setId(Integer id) {
        this.id = id;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}