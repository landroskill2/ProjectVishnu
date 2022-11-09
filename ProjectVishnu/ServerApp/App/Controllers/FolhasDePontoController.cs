﻿using Microsoft.AspNetCore.Mvc;
using ProjectVishnu.ServerApp.App.Dtos;
using ProjectVishnu.ServerApp.App.Services;
using ProjectVishnu.Services;

namespace ProjectVishnu.ServerApp.App.Controllers
{
    [ApiController]
    public class FolhasDePontoController : ControllerBase
    {

        private readonly IFolhaDePontoServices _folhadepontoServices;

        public FolhasDePontoController(IFolhaDePontoServices folhadepontoServices)
        {
            this._folhadepontoServices = folhadepontoServices;
        }

        [HttpPost("/obras/{obraID}/folha-de-ponto")]
        public string Create(string obraID, [FromBody] FolhaDePontoInfoModel info)
        {
            _folhadepontoServices.GenerateWithInfo(obraID, info);
            return "";
        }

        [HttpGet("/obras/{obraID}/folha-de-ponto")]
        public string GetAllByObra(string obraID)
        {
            _folhadepontoServices.GetAllFromObra(obraID);
            return "";
        }
        [HttpGet("/obras/{obraID}/folha-de-ponto/{date}")]
        public string GetByObra(string obraID, string date)
        {
            string[] dateValues = date.Split('-');
            string ano = dateValues[0];
            string mes = dateValues[1];
            _folhadepontoServices.GetFromObra(obraID, ano, mes);
            return "";
        }

        [HttpGet("/folha-de-ponto/{mercado}")]
        public string GetAllByMercado(string mercado)
        {
            _folhadepontoServices.GetAllFromMercado(mercado);
            return "";
        }

        [HttpGet("/folha-de-ponto/{mercado}/{date}")]
        public string GetByMercado(string mercado, string date)
        {
            string[] dateValues = date.Split('-');
            string ano = dateValues[0];
            string mes = dateValues[1];
            _folhadepontoServices.GetFromMercado(mercado, ano, mes);
            return "";
        }

        [HttpPut("/obras/{obraID}/folha-de-ponto/{date}")]
        public string setValues(string obraID, string date, [FromBody] FolhaDePontoValuesInputModel values)
        {
            _folhadepontoServices.setValues(obraID, date, values);
            return "";
        }
    }
}