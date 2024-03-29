using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectVishnu.ServerApp.App.Dtos;
using ProjectVishnu.ServerApp.App.Services;

namespace ProjectVishnu.ServerApp.App.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/categorias-profissionais")]
    public class CategoriasProfissionaisController : ControllerBase
    {

        private readonly ICategoriaProfService _catProfServices;

        public CategoriasProfissionaisController(ICategoriaProfService catProfServices)
        {
            this._catProfServices = catProfServices;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<CatProfDto>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult List()
        {
            try
            {
                if (Request.QueryString.HasValue) return BadRequest();
                var result = _catProfServices.ListAlphabetically();
                return Ok(result);
            }
            catch (Exception e)
            {
                return Problem(statusCode: 500, title: "Erro inesperado");
            }

        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public IActionResult Create([FromBody] CatProfDto catProf)
        {
            try
            {
                var result = _catProfServices.Create(catProf.Codigo, catProf.Nomenclatura);
                var actionName = nameof(CategoriasProfissionaisController.Get);
                var routeValues = new
                {
                    codigo = result.Codigo
                };
                return CreatedAtAction(actionName, routeValues, result);
            }
            catch (Exception ex)
            {
                string erroCode = ex.InnerException!.Data["SqlState"]!.ToString()!;
                // 23505 significa primary key duplicada (Postgres).
                bool duplicate = (erroCode.Equals("23505"));
                string errorMessage = duplicate ? "Categoria profissional duplicada." : "Ocorreu um erro, por favor tente novamente, se o erro persistir, entre em contacto connosco.";
                int errorCode = duplicate ? 409 : 500;
                return Problem(statusCode: errorCode, title: errorMessage);
            }
        }

        [HttpGet("{codigo}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CatProfDto))]
        public IActionResult Get(string codigo)
        {
            try
            {
                var result = _catProfServices.Get(codigo);
                return Ok(result);
            }
            catch (Exception e)
            {
                return Problem(statusCode: 500, title: "Erro inesperado");
            }
        }
    }
}