package com.br.techmanager.dto.equipamento;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Projection baseada em aliases da native query.
 * O Jackson aplicará snake_case via application.properties.
 */
public interface EquipamentoListItem {
    Integer getId();
    String getNumeroSerie();
    String getMarca();
    String getModelo();
    String getCategoria();       // vem de tipo_equipamento.nome (ex.: "notebook")
    LocalDate getDataCompra();
    LocalDate getDataFimGarantia();
    BigDecimal getPrecoCompra();
    String getObservacoes();
    LocalDateTime getDataCriacao();
    String getStatus();          // última ocorrência do histórico (ex.: "Em uso")
}
