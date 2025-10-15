package com.br.techmanager.service;

import com.br.techmanager.domain.funcionario.Funcionario;
import com.br.techmanager.dto.funcionario.*;
import com.br.techmanager.exception.NotFoundException;
import com.br.techmanager.repository.FuncionarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service @RequiredArgsConstructor
public class FuncionarioService {
    private final FuncionarioRepository repo;

    public List<FuncionarioResponse> listar() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }

    public FuncionarioResponse criar(FuncionarioRequest r) {
        if (repo.existsByNumeroRegistro(r.numeroRegistro()))
            throw new IllegalArgumentException("Número de registro já existente");
        if (repo.existsByEmail(r.email()))
            throw new IllegalArgumentException("Email já existente");

        Funcionario f = toEntity(r);
        f = repo.save(f);
        return toResponse(f);
    }

    public FuncionarioResponse atualizar(Integer id, FuncionarioRequest r) {
        Funcionario f = repo.findById(id).orElseThrow(() -> new NotFoundException("Funcionário não encontrado"));
        f.setNome(r.nome());
        f.setNumeroRegistro(r.numeroRegistro());
        f.setCargoId(r.cargoId());
        f.setEmail(r.email());
        f.setTelefone(r.telefone());
        return toResponse(repo.save(f));
    }

    public void remover(Integer id) {
        if (!repo.existsById(id)) throw new NotFoundException("Funcionário não encontrado");
        repo.deleteById(id);
    }

    private Funcionario toEntity(FuncionarioRequest r) {
        return Funcionario.builder()
                .nome(r.nome())
                .numeroRegistro(r.numeroRegistro())
                .cargoId(r.cargoId())
                .email(r.email())
                .telefone(r.telefone())
                .build();
    }

    private FuncionarioResponse toResponse(Funcionario f) {
        return new FuncionarioResponse(f.getId(), f.getNome(), f.getNumeroRegistro(), f.getCargoId(), f.getEmail(), f.getTelefone());
    }
}
