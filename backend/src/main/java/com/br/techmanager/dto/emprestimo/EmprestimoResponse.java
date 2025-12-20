package com.br.techmanager.dto.emprestimo;

import java.time.LocalDate;

public record EmprestimoResponse(
    Integer id,
    Integer funcionarioId,
    Integer equipamentoId,
    Integer tipo,          
    LocalDate dataRetirada,
    LocalDate dataLimite,
    LocalDate dataDevolucao,
    String observacoes
) {}

