package com.br.techmanager.dto.emprestimo;


import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record EmprestimoCreateRequest(
    @NotNull Integer funcionarioId,
    @NotNull Integer equipamentoId,
    @NotBlank String tipo,          
    @NotNull LocalDate dataRetirada,
    String observacoes
) {}
