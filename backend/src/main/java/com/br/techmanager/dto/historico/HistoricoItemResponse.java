package com.br.techmanager.dto.historico;

import java.time.LocalDateTime;

public class HistoricoItemResponse {
    public String idEvento;
    public LocalDateTime dataEvento;
    public Integer equipamentoId;
    public String numeroSerie;
    public String marca;
    public String modelo;
    public Integer funcionarioId;
    public String funcionarioNome;
    public String tipoUso;
    public String statusEvento;
    public String tipoEvento;
    public String observacoes;
}
