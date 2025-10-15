package com.br.techmanager.controller;

import com.br.techmanager.dto.uso.*;
import com.br.techmanager.service.UsoEquipamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/usos")
@RequiredArgsConstructor
public class UsoEquipamentoController {
    private final UsoEquipamentoService service;

    @GetMapping("/ativos/equipamento/{equipamentoId}")
    public List<UsoEquipamentoResponse> ativosPorEquipamento(@PathVariable Integer equipamentoId){
        return service.listarAtivosPorEquipamento(equipamentoId);
    }

    @GetMapping("/ativos/funcionario/{funcionarioId}")
    public List<UsoEquipamentoResponse> ativosPorFuncionario(@PathVariable Integer funcionarioId){
        return service.listarAtivosPorFuncionario(funcionarioId);
    }

    @GetMapping("/emprestimos/vencidos")
    public List<UsoEquipamentoResponse> emprestimosVencidos(){
        return service.listarEmprestimosVencidos();
    }

    @PostMapping
    public ResponseEntity<UsoEquipamentoResponse> criar(@Valid @RequestBody UsoEquipamentoRequest req){
        var resp = service.criar(req);
        return ResponseEntity.created(URI.create("/api/usos/" + resp.id())).body(resp);
    }

    @PatchMapping("/{id}/devolver")
    public UsoEquipamentoResponse devolver(@PathVariable Integer id){
        return service.devolver(id);
    }
}
