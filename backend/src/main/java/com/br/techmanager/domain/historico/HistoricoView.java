package com.br.techmanager.domain.historico;

import jakarta.persistence.*;
import org.hibernate.annotations.Immutable;
import java.time.LocalDateTime;

@Entity
@Table(name = "vw_historico_equipamentos", schema = "techmanager")
@Immutable // somente leitura
public class HistoricoView {

    @Id
    @Column(name = "id_evento")
    private String idEvento;

    @Column(name = "data_evento")
    private LocalDateTime dataEvento;

    @Column(name = "equipamento_id")
    private Integer equipamentoId;

    @Column(name = "numero_serie")
    private String numeroSerie;

    @Column(name = "marca")
    private String marca;

    @Column(name = "modelo")
    private String modelo;

    @Column(name = "funcionario_id")
    private Integer funcionarioId;

    @Column(name = "funcionario_nome")
    private String funcionarioNome;

    @Column(name = "tipo_uso")
    private String tipoUso;

    @Column(name = "status_evento")
    private String statusEvento;

    @Column(name = "tipo_evento")
    private String tipoEvento; // STATUS | RETIRADA | DEVOLUCAO

    @Column(name = "observacoes")
    private String observacoes;

    public String getIdEvento() { return idEvento; }
    public LocalDateTime getDataEvento() { return dataEvento; }
    public Integer getEquipamentoId() { return equipamentoId; }
    public String getNumeroSerie() { return numeroSerie; }
    public String getMarca() { return marca; }
    public String getModelo() { return modelo; }
    public Integer getFuncionarioId() { return funcionarioId; }
    public String getFuncionarioNome() { return funcionarioNome; }
    public String getTipoUso() { return tipoUso; }
    public String getStatusEvento() { return statusEvento; }
    public String getTipoEvento() { return tipoEvento; }
    public String getObservacoes() { return observacoes; }
}
