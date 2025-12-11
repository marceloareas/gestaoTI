package com.br.techmanager.domain.equipamento;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "status_equipamento", schema = "techmanager")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StatusEquipamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable=false, unique=true)
    private String nome; // Em estoque, Em uso, Em manutenção, Descartado
}