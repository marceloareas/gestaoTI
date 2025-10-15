package com.br.techmanager.service;

import com.br.techmanager.domain.uso.UsoEquipamento;
import com.br.techmanager.dto.uso.*;
import com.br.techmanager.exception.NotFoundException;
import com.br.techmanager.repository.UsoEquipamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service @RequiredArgsConstructor
public class UsoEquipamentoService {
    private final UsoEquipamentoRepository repo;

    public List<UsoEquipamentoResponse> listarAtivosPorEquipamento(Integer equipamentoId) {
        return repo.findByEquipamentoIdAndDataDevolucaoIsNull(equipamentoId).stream().map(this::toResponse).toList();
    }

    public List<UsoEquipamentoResponse> listarAtivosPorFuncionario(Integer funcionarioId) {
        return repo.findByFuncionarioIdAndDataDevolucaoIsNull(funcionarioId).stream().map(this::toResponse).toList();
    }

    public List<UsoEquipamentoResponse> listarEmprestimosVencidos() {
        return repo.findEmprestimosVencidos(LocalDate.now()).stream().map(this::toResponse).toList();
    }

    public UsoEquipamentoResponse criar(UsoEquipamentoRequest r) {
        boolean jaAtivo = !repo.findByEquipamentoIdAndDataDevolucaoIsNull(r.equipamentoId()).isEmpty();
        if (jaAtivo) throw new IllegalArgumentException("Equipamento já está em uso ativo");

        UsoEquipamento u = UsoEquipamento.builder()
                .funcionarioId(r.funcionarioId())
                .equipamentoId(r.equipamentoId())
                .tipoUsoId(r.tipoUsoId())
                .dataRetirada(r.dataRetirada())
                .dataDevolucao(r.dataDevolucao())
                .observacoes(r.observacoes())
                .build();

        u = repo.save(u);
        return toResponse(u);
    }

    public UsoEquipamentoResponse devolver(Integer id) {
        UsoEquipamento u = repo.findById(id).orElseThrow(() -> new NotFoundException("Uso não encontrado"));
        if (u.getDataDevolucao() != null) return toResponse(u);
        u.setDataDevolucao(LocalDate.now());
        return toResponse(repo.save(u));
    }

    private UsoEquipamentoResponse toResponse(UsoEquipamento u) {
        return new UsoEquipamentoResponse(
                u.getId(), u.getFuncionarioId(), u.getEquipamentoId(), u.getTipoUsoId(),
                u.getDataRetirada(), u.getDataDevolucao(), u.getDataLimite(), u.getObservacoes()
        );
    }
}
