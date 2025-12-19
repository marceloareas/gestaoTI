package com.br.techmanager.controller;

import com.br.techmanager.dto.emprestimo.*;
import com.br.techmanager.service.EmprestimoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;

@RestController
@RequestMapping("/api/emprestimos")
@RequiredArgsConstructor
public class EmprestimoController {

    private final EmprestimoService service;

    @PostMapping
    public ResponseEntity<EmprestimoResponse> criar(@Valid @RequestBody EmprestimoCreateRequest r){
        var resp = service.criar(r);
        return ResponseEntity.created(URI.create("/api/emprestimos/" + resp.id())).body(resp);
    }

    @PostMapping("/{id}/devolver")
    public EmprestimoResponse devolver(@PathVariable Integer id, @Valid @RequestBody DevolucaoRequest r){
        return service.devolver(id, r);
    }
}
