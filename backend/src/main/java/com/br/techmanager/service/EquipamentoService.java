package com.br.techmanager.service;

import com.br.techmanager.domain.equipamento.Equipamento;
import com.br.techmanager.domain.historico.HistoricoStatus;
import com.br.techmanager.dto.equipamento.*;
import com.br.techmanager.exception.NotFoundException;
import com.br.techmanager.repository.EquipamentoRepository;
import com.br.techmanager.repository.StatusEquipamentoRepository;
import com.br.techmanager.repository.HistoricoStatusRepository;
import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service @RequiredArgsConstructor
public class EquipamentoService {
    private final EquipamentoRepository repo;
    private final StatusEquipamentoRepository statusRepo;
    private final HistoricoStatusRepository historicoRepo;

    public List<EquipamentoListItem> listarResumo() {
        return repo.listarResumo();
    }

    @Transactional
    public EquipamentoResponse criar(EquipamentoRequest req) {
        // ... sua lógica existente de validação/construção do equipamento
        var e = Equipamento.builder()
                .numeroSerie(req.numeroSerie().trim())
                .modeloEquipamentoId(req.modeloEquipamentoId())
                .categoriaId(req.categoriaId())
                .dataCompra(req.dataCompra())
                .dataFimGarantia(req.dataFimGarantia())
                .precoCompra(req.precoCompra())
                .observacoes(req.observacoes())
                .build();

        e = repo.save(e);

        // REGISTRAR HISTÓRICO "Em estoque"
        var statusEstoqueId = statusRepo.findByNome("Em estoque")
                .map(s -> s.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Status 'Em estoque' não encontrado"));

        historicoRepo.save(HistoricoStatus.builder()
                .equipamentoId(e.getId())
                .statusId(statusEstoqueId)
                .dataAlteracao(LocalDateTime.now())
                .observacoes("Entrada no estoque (criação do item)")
                .build());

        // ... montar e retornar seu DTO EquipamentoResponse (adaptar ao seu projeto)
        return new EquipamentoResponse(
                e.getId(),
                e.getNumeroSerie(),
                e.getModeloEquipamentoId(),
                e.getCategoriaId(),
                e.getDataCompra(),
                e.getDataFimGarantia(),
                e.getPrecoCompra(),
                e.getObservacoes()
        );
    }

    @Transactional
    public void descartar(Integer id) {
        Equipamento e = repo.findById(id).orElseThrow(() -> new NotFoundException("Equipamento não encontrado"));

        // REGISTRAR HISTÓRICO "Descartado"
        var statusDescartadoId = statusRepo.findByNome("Descartado")
                .map(s -> s.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Status 'Descartado' não encontrado"));

        historicoRepo.save(HistoricoStatus.builder()
                .equipamentoId(e.getId())
                .statusId(statusDescartadoId)
                .dataAlteracao(LocalDateTime.now())
                .observacoes("Equipamento descartado")
                .build());
    }

    public EquipamentoResponse atualizar(Integer id, EquipamentoRequest req) {
        Equipamento e = repo.findById(id).orElseThrow(() -> new NotFoundException("Equipamento não encontrado"));
        e.setNumeroSerie(req.numeroSerie());
        e.setModeloEquipamentoId(req.modeloEquipamentoId());
        e.setCategoriaId(req.categoriaId());
        e.setDataCompra(req.dataCompra());
        e.setDataFimGarantia(req.dataFimGarantia());
        e.setPrecoCompra(req.precoCompra());
        e.setObservacoes(req.observacoes());
        return toResponse(repo.save(e));
    }

    public void remover(Integer id) {
        if (!repo.existsById(id)) throw new NotFoundException("Equipamento não encontrado");
        repo.deleteById(id);
    }

    private Equipamento toEntity(EquipamentoRequest r) {
        return Equipamento.builder()
                .numeroSerie(r.numeroSerie())
                .modeloEquipamentoId(r.modeloEquipamentoId())
                .categoriaId(r.categoriaId())
                .dataCompra(r.dataCompra())
                .dataFimGarantia(r.dataFimGarantia())
                .precoCompra(r.precoCompra())
                .observacoes(r.observacoes())
                .build();
    }

    private EquipamentoResponse toResponse(Equipamento e) {
        return new EquipamentoResponse(
                e.getId(), e.getNumeroSerie(), e.getModeloEquipamentoId(), e.getCategoriaId(),
                e.getDataCompra(), e.getDataFimGarantia(), e.getPrecoCompra(), e.getObservacoes()
        );
    }

    @Transactional
    public void retornar(Integer id) {
        Equipamento e = repo.findById(id).orElseThrow(() -> new NotFoundException("Equipamento não encontrado"));

        // REGISTRAR HISTÓRICO "Em estoque"
        var statusEstoqueId = statusRepo.findByNome("Em estoque")
                .map(s -> s.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Status 'Em estoque' não encontrado"));

        historicoRepo.save(HistoricoStatus.builder()
                .equipamentoId(e.getId())
                .statusId(statusEstoqueId)
                .dataAlteracao(LocalDateTime.now())
                .observacoes("Equipamento retornado ao estoque")
                .build());
    }
}
