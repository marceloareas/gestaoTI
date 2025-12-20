package com.br.techmanager.controller;

import com.br.techmanager.dto.funcionario.*;
import com.br.techmanager.service.FuncionarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
@RequiredArgsConstructor
public class FuncionarioController {
    private final FuncionarioService service;

    @GetMapping
    public List<FuncionarioResponse> listar(){ return service.listar(); }

    @PostMapping
    public ResponseEntity<FuncionarioResponse> criar(@Valid @RequestBody FuncionarioRequest r){
        var resp = service.criar(r);
        return ResponseEntity.created(URI.create("/api/funcionarios/" + resp.id())).body(resp);
    }

    @PutMapping("/{id}")
    public FuncionarioResponse atualizar(@PathVariable Integer id, @Valid @RequestBody FuncionarioRequest r){
        return service.atualizar(id, r);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Integer id){
        service.remover(id);
        return ResponseEntity.noContent().build();
    }
}
