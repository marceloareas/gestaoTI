package com.br.techmanager.domain.historico;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historico_status", schema = "techmanager")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HistoricoStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name="equipamento_id", nullable=false)
    private Integer equipamentoId;

    @Column(name="status_id", nullable=false)
    private Integer statusId;

    @Column(name="data_alteracao", nullable=false)
    private LocalDateTime dataAlteracao;

    private String observacoes;
}