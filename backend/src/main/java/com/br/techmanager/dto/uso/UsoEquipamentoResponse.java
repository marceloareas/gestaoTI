package com.br.techmanager.dto.uso;

import java.time.LocalDate;

public record UsoEquipamentoResponse(
        Integer id,
        Integer funcionarioId,
        Integer equipamentoId,
        Integer tipoUsoId,
        LocalDate dataRetirada,
        LocalDate dataDevolucao,
        LocalDate dataLimite,
        String observacoes
) {}
