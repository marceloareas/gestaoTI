package com.br.techmanager.domain.equipamento;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "equipamento", schema = "techmanager")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Equipamento {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer  id;

    @Column(name = "numero_serie", nullable = false, unique = true)
    private String numeroSerie;

    @Column(name = "modelo_equipamento_id")
    private Integer modeloEquipamentoId; // FK simples (modelo + tipo)

    @Column(name = "categoria_id")
    private Integer categoriaId; // A,B,C,D,E (id da categoria_uso)

    @Column(name = "data_compra")
    private LocalDate dataCompra;

    @Column(name = "data_fim_garantia")
    private LocalDate dataFimGarantia;

    @Column(name = "preco_compra", precision = 12, scale = 2)
    private BigDecimal precoCompra;

    @Column(name = "observacoes")
    private String observacoes;
}
