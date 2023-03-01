﻿using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using ProjectVishnu.Models;
using ProjectVishnu.ServerApp.App.Dtos;
using ProjectVishnu.Services;

namespace ProjectVishnu.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ObrasController : ControllerBase
    {
        private readonly IObrasService _obrasService;

        public ObrasController(IObrasService obrasService)
        {
            this._obrasService = obrasService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<ObraOutputModel>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult List([FromQuery()] string? estado, [FromQuery(Name = "mercado")] string? mercado, [FromQuery(Name = "valor")] string? valor)
        {
            try
            {
                IEnumerable<Obra> obraList;
                if(estado == null && mercado == null && valor == null){
                    obraList = _obrasService.ListAlphabetically();
                }
                else
                {
                    obraList = _obrasService.ListWithFilters(estado, mercado, valor);
                }

                return Ok(obraList.Select(obra => obra.toObraOutputModel()));
            }
            catch(Exception e)
            {
                return Problem(statusCode: 500, title: "Erro inesperado");
            }
            

            
        }
        // New
        [HttpGet("funcionario/{funcionarioId}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<ObraOutputModel>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult ListByFuncionario(int funcionarioId)
        {
            try
            {
                if (Request.QueryString.HasValue) return BadRequest();
                IEnumerable<Obra>? result = _obrasService.ListByFuncionario(funcionarioId);
                return Ok(result);
            }
            catch(Exception e)
            {
                return Problem(statusCode: 500, title: "Erro inesperado");
            }
        }

        [HttpGet("{codigoInterno}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ObraOutputModel))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult Get(string codigoInterno)
        {
            try
            {
                if (Request.QueryString.HasValue) return BadRequest();
                Obra result = _obrasService.Get(codigoInterno);
                return Ok(result.toObraOutputModel());
            }
            catch(Exception e)
            {
                return Problem(statusCode: 500, title: "Erro inesperado");
            }
           
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult Create([FromBody] ObraInputModel obraInput)
        {
            if (Request.QueryString.HasValue) return BadRequest();

            try
            {
                // TODO verificar se isto é 🍞 ou 💩
                if(obraInput.Datainicio != null)
                {
                    DateTime.TryParse(obraInput.Datainicio, out DateTime dt);
                    obraInput.Datainicio = dt.ToShortDateString();
                }

                if(obraInput.Datafim != null)
                {
                    DateTime.TryParse(obraInput.Datainicio, out DateTime dt);
                    obraInput.Datafim = dt.ToShortDateString();
                }
                // end 
                string codigoInterno = _obrasService.Create(obraInput);

                var actionName = nameof(ObrasController.Get);
                var routeValues = new
                {
                    codigoInterno = codigoInterno
                };
                ActionResult a = CreatedAtAction(actionName, routeValues, obraInput);
                return a;
            }
            catch (Exception e)
            {
                return Problem(statusCode: 500, title: "Erro inesperado");
            }
        }

        [HttpPut("{codigoInterno}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult Edit(string codigoInterno, [FromBody] ObraInputModel obraInput)
        {
            try
            {
                if (Request.QueryString.HasValue) return BadRequest();
                string result = _obrasService.Update(codigoInterno, obraInput);
                return Ok(result);
            }
            catch(Exception e)
            {
                return Problem(statusCode: 500, title: "Erro inesperado");
            }
        }

        [HttpDelete("{codigoInterno}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult Delete(string codigoInterno)
        {
            try
            {
                if (Request.QueryString.HasValue) return BadRequest();
                string result = _obrasService.Delete(codigoInterno);
                return Ok(result);
            }
            catch(Exception e)
            {
                return Problem(statusCode: 500, title: "Erro inesperado");
            }
        }

        [HttpGet("{codigoInterno}/funcionarios/current")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<FuncionarioObraOutputModel>))]
        public IActionResult GetCurrentFuncionarios(string codigoInterno)
        {
            try
            {
                IEnumerable<FuncionarioObraOutputModel> funcs = _obrasService.GetCurrentFuncs(codigoInterno);
                return Ok(funcs);
            }
            catch(Exception e)
            {
                return Problem(statusCode: 500, title: "Erro inesperado");
            }
        }

        [HttpGet("{codigoInterno}/funcionarios/past")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<FuncionarioObraOutputModel>))]
        public IActionResult GetPastFuncionarios(string codigoInterno)
        {
            try
            {
                IEnumerable<FuncionarioObraOutputModel> funcs = _obrasService.GetPastFuncs(codigoInterno);
                return Ok(funcs);
            }
            catch(Exception e)
            {
                return Problem(statusCode: 500, title: "Erro inesperado");
            }
        }

        [HttpPost("{codigoInterno}/add")]
        public IActionResult AddFuncionario(string codigoInterno, [FromBody] FuncionarioObraInputModel funcInput)
        {
            try
            {
                _obrasService.AddFuncToObra(codigoInterno, funcInput);
                return Ok();
            }
            catch(Exception e)
            {
                return Problem(statusCode: 500, title: "Erro inesperado");
            }
        }

        [HttpPut("{codigoInterno}/remove")]
        public IActionResult RemoveFuncionario(string codigoInterno, [FromBody] FuncionarioObraInputModel funcInput)
        {
            try
            {
                _obrasService.RemoveFuncFromObra(codigoInterno, funcInput);
                return Ok();
            }
            catch(Exception e)
            {
                return Problem(statusCode: 500, title: "Erro inesperado");
            }          
        }
    }
}
