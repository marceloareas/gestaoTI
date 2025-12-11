package com.br.techmanager.dto.emprestimo;


import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record DevolucaoRequest(
    @NotNull LocalDate dataDevolucao,
    String observacoes
) {}
