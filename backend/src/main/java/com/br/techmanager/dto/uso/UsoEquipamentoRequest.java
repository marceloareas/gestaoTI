package com.br.techmanager.dto.uso;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record UsoEquipamentoRequest(
        @NotNull Integer funcionarioId,
        @NotNull Integer equipamentoId,
        @NotNull Integer tipoUsoId,   // id em tipo_uso
        @NotNull LocalDate dataRetirada,
        LocalDate dataDevolucao,
        String observacoes
) {}
