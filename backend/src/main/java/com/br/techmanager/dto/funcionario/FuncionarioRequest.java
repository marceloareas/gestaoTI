package com.br.techmanager.dto.funcionario;

import jakarta.validation.constraints.*;

public record FuncionarioRequest(
        @NotBlank String nome,
        @NotBlank String numeroRegistro,
        Integer cargoId,
        @Email @NotBlank String email,
        String telefone
) {}
