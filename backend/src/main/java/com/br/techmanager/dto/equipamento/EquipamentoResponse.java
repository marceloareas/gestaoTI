package com.br.techmanager.dto.equipamento;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EquipamentoResponse(
        Integer id,
        String numeroSerie,
        Integer modeloEquipamentoId,
        Integer categoriaId,
        LocalDate dataCompra,
        LocalDate dataFimGarantia,
        BigDecimal precoCompra,
        String observacoes
) {}
