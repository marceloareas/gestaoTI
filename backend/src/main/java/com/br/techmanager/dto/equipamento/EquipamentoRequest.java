package com.br.techmanager.dto.equipamento;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record EquipamentoRequest(
        @NotBlank String numeroSerie,
        Integer modeloEquipamentoId,
        Integer categoriaId,
        LocalDate dataCompra,
        LocalDate dataFimGarantia,
        BigDecimal precoCompra,
        String observacoes
) {}
