﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using ProjectVishnu.Models;
using ProjectVishnu.Services;

namespace ProjectVishnu.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FuncionariosController : ControllerBase
    {

        private FuncionariosService _funcionariosService;

        public FuncionariosController()
        {
            this._funcionariosService = new FuncionariosService();
        }

        [HttpGet]
        public Funcionario List([FromQuery(Name = "mercado")] string? mercado)
        {
            if (mercado == null) return _funcionariosService.ListAlphabetically();
            //else  return _funcionariosService.ListByMarket(mercado);
            return null;
        }

        [HttpGet("{id}")]
        public String Get(int id)
        {
            return _funcionariosService.Get(id);
        }

        [HttpPost("{id}")]
        public IActionResult Create(int id) // levar um segundo parâmetro com os parâmetros necessários para editar um funcionário(possivelmente necessário criar um dto)
        {
            throw new NotImplementedException();
        }

        [HttpPut("{id}")]
        public IActionResult Edit(int id) // levar um segundo parâmetro com os parâmetros necessários para editar um funcionário(possivelmente necessário criar um dto)
        {
            throw new NotImplementedException();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            throw new NotImplementedException();
        }
    }
}
