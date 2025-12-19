package com.br.techmanager.controller;

import com.br.techmanager.domain.equipamento.CategoriaUso;
import com.br.techmanager.domain.equipamento.ModeloEquipamento;
import com.br.techmanager.domain.equipamento.TipoEquipamento;
import com.br.techmanager.dto.equipamento.CategoriaUsoDTO;
import com.br.techmanager.dto.equipamento.ModeloEquipamentoDTO;
import com.br.techmanager.dto.equipamento.TipoEquipamentoDTO;
import com.br.techmanager.repository.CategoriaUsoRepository;
import com.br.techmanager.repository.ModeloEquipamentoRepository;
import com.br.techmanager.repository.TipoEquipamentoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CatalogoEquipamentoController {

    private final TipoEquipamentoRepository tipoRepo;
    private final ModeloEquipamentoRepository modeloRepo;
    private final CategoriaUsoRepository categoriaUsoRepo;

    public CatalogoEquipamentoController(
            TipoEquipamentoRepository tipoRepo,
            ModeloEquipamentoRepository modeloRepo,
            CategoriaUsoRepository categoriaUsoRepo
    ) {
        this.tipoRepo = tipoRepo;
        this.modeloRepo = modeloRepo;
        this.categoriaUsoRepo = categoriaUsoRepo;
    }

    // ---------- TIPOS DE EQUIPAMENTO ----------
    @GetMapping("/tipos-equipamento")
    @Transactional(readOnly = true)
    public ResponseEntity<List<TipoEquipamentoDTO>> listarTipos() {
        List<TipoEquipamento> tipos =
                tipoRepo.findAllByOrderByNomeAsc();

        var out = tipos.stream()
                .map(t -> new TipoEquipamentoDTO(
                        t.getId(),
                        t.getNome()
                ))
                .toList();

        return ResponseEntity.ok(out);
    }

    // ---------- CATEGORIAS DE USO ----------
    @GetMapping("/categorias-uso")
    @Transactional(readOnly = true)
    public ResponseEntity<List<CategoriaUsoDTO>> listarCategoriasUso() {
        List<CategoriaUso> categorias =
                categoriaUsoRepo.findAllByOrderByDescricaoAsc();

        var out = categorias.stream()
                .map(c -> new CategoriaUsoDTO(
                        c.getId(),
                        c.getCodigo(),
                        c.getDescricao()
                ))
                .toList();

        return ResponseEntity.ok(out);
    }

    // ---------- MODELOS DE EQUIPAMENTO ----------
    @GetMapping("/modelos-equipamento")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ModeloEquipamentoDTO>> listarModelos(
            @RequestParam(value = "tipoId", required = false) Integer tipoId
    ) {
        List<ModeloEquipamento> modelos = (tipoId == null)
                ? modeloRepo.findAllByOrderByMarcaAscModeloAsc()
                : modeloRepo.findByTipoEquipamento_IdOrderByMarcaAscModeloAsc(tipoId);

        var out = modelos.stream()
                .map(m -> new ModeloEquipamentoDTO(
                        m.getId(),
                        m.getMarca(),
                        m.getModelo(),
                        m.getTipoEquipamento() != null
                                ? m.getTipoEquipamento().getId()
                                : null
                ))
                .toList();

        return ResponseEntity.ok(out);
    }
}
