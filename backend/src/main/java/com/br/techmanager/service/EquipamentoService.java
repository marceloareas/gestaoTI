package com.br.techmanager.service;

import com.br.techmanager.domain.equipamento.Equipamento;
import com.br.techmanager.dto.equipamento.*;
import com.br.techmanager.exception.NotFoundException;
import com.br.techmanager.repository.EquipamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service @RequiredArgsConstructor
public class EquipamentoService {
    private final EquipamentoRepository repo;

    public List<EquipamentoResponse> listar() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }

    public EquipamentoResponse criar(EquipamentoRequest req) {
        if (repo.existsByNumeroSerie(req.numeroSerie()))
            throw new IllegalArgumentException("Número de série já existente");

        Equipamento e = toEntity(req);
        e = repo.save(e);
        return toResponse(e);
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
}
