package com.br.techmanager.dto.funcionario;

public record FuncionarioResponse(
        Integer id,
        String nome,
        String numeroRegistro,
        Integer cargoId,
        String email,
        String telefone
) {}
