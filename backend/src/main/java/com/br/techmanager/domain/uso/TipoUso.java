package com.br.techmanager.domain.uso;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tipo_uso", schema = "techmanager")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class TipoUso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String codigo;       // "emprestimo" ou "cedido"

    @Column(nullable = false)
    private String descricao;    // Ex: "Empréstimo" ou "Cedido"
}
