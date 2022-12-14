﻿using Microsoft.AspNetCore.Mvc;
using ProjectVishnu.ServerApp.App.Dtos;
using ProjectVishnu.ServerApp.App.Services;
using ProjectVishnu.Services;

namespace ProjectVishnu.ServerApp.App.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class MercadosController : ControllerBase
    {
        private readonly IMercadosService _mercadosService;

        public MercadosController(IMercadosService mercadosService)
        {
            _mercadosService = mercadosService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<string>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult List()
        {
            var result = _mercadosService.ListAlphabetically();
            return result == null ? NotFound() : Ok(result);
        }
    }
}
