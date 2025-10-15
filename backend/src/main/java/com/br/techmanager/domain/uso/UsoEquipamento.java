package com.br.techmanager.domain.uso;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "uso_equipamento", schema = "techmanager")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UsoEquipamento {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer  id;

    @Column(name = "funcionario_id", nullable = false)
    private Integer  funcionarioId;

    @Column(name = "equipamento_id", nullable = false)
    private Integer  equipamentoId;

    @Column(name = "tipo_uso_id", nullable = false)
    private Integer tipoUsoId; //  emprestimo/cedido (id em tipo_uso)

    @Column(name = "data_retirada", nullable = false)
    private LocalDate dataRetirada;

    @Column(name = "data_devolucao")
    private LocalDate dataDevolucao;

    @Column(name = "data_limite")
    private LocalDate dataLimite;

    @Column(name = "observacoes")
    private String observacoes;
}
