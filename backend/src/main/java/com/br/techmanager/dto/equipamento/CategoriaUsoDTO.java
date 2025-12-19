package com.br.techmanager.dto.equipamento;

public class CategoriaUsoDTO {

    public Integer id;
    public String codigo;
    public String descricao;

    public CategoriaUsoDTO(Integer id, String codigo, String descricao) {
        this.id = id;
        this.codigo = codigo;
        this.descricao = descricao;
    }
}
