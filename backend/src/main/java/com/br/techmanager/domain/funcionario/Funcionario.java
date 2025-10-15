package com.br.techmanager.domain.funcionario;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "funcionario", schema = "techmanager")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Funcionario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer  id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "numero_registro", nullable = false, unique = true)
    private String numeroRegistro;

    @Column(name = "cargo_id")
    private Integer cargoId;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "telefone")
    private String telefone;
}
