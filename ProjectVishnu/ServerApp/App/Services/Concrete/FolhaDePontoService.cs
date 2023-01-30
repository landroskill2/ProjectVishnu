﻿using NUnit.Framework.Constraints;
using ProjectVishnu.DataAccess;
using ProjectVishnu.Models;
using ProjectVishnu.ServerApp.App.Dtos;
using ProjectVishnu.ServerApp.App.Utils;
using System.Linq;
using System;

namespace ProjectVishnu.ServerApp.App.Services.Concrete
{
    public class FolhaDePontoService : IFolhaDePontoService
    {

        private readonly IUnitOfWork _unitOfWork;
        public FolhaDePontoService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public FolhaDePontoEmptyOutputModel GenerateWithInfo(string obraID, FolhaDePontoInfoModel info)
        {

            FolhaDePontoEmptyOutputModel model = new FolhaDePontoEmptyOutputModel();
            model.Limits = new List<int>();
            List<int> saturdays;
            List<int> sundays;
            List<int> holidays;


            Mercado interval = _unitOfWork.Obras.GetMercado(obraID); // TODO: MUDAR ISTO

            int previousMonth = CalendarUtils.GetPreviousMonth(info.Mes);
            string prevMonthStr = previousMonth >= 10 ? previousMonth.ToString() : "0" + previousMonth.ToString();
            string startAno = info.Ano;
            if(previousMonth == 12) startAno = (int.Parse(info.Ano)-1).ToString();

            DateOnly startDate = DateOnly.Parse(String.Format("{0}-{1}-{2}", startAno, prevMonthStr, interval.DiaInicio));
            DateOnly endDate = DateOnly.Parse(String.Format("{0}-{1}-{2}", info.Ano, info.Mes, interval.DiaFim));

            model.Funcionarios = _unitOfWork.FuncionariosObra.GetFuncsDuringInterval(obraID, startDate, endDate).Select(func => func.toOutputModel()).ToList();

            int midLimit = CalendarUtils.GetMidLimit(info.Ano, info.Mes);
            model.Limits.Add((int)interval.DiaInicio);
            model.Limits.Add(midLimit);
            model.Limits.Add((int)interval.DiaFim);

            CalendarUtils.GetNonWorkDays(info.Ano, info.Mes, interval, out saturdays, out sundays, out holidays);

            model.Saturdays = saturdays;
            model.Sundays = sundays;
            model.Holidays = holidays;
            model.Info = info;

            FolhaDePonto folha = new FolhaDePonto {
                Mes = info.Mes,
                Ano = info.Ano,
                Obra = obraID,
                Mercado = interval.Mercadoname
            };

            model.Funcionarios.ForEach(func => {
                SalarioFinal salarioFunc = new SalarioFinal{
                    Funcionario = func.Nif,
                    Mes = folha.Mes,
                    Ano = folha.Ano,
                    Valorfinal = 0
                };
                folha.IdSalarios.Add(salarioFunc);
            });

            try{
                _unitOfWork.FolhaDePontos.Add(folha);
                _unitOfWork.Complete();
            }catch(Exception e){
                Console.WriteLine(e.StackTrace);
                return null;
            }
            

            return model;
        }

        

        public List<FolhaDePontoInfoModel> GetAllFromMercado(string mercado)
        {
            try
            {
                return _unitOfWork.FolhaDePontos.GetAllFromMercado(mercado).Select(x => x.toFolhaDePontoInfoModel()).ToList();
            }catch(Exception e)
            {
                return null;
            }
        }

        public List<FolhaDePontoInfoModel> GetAllFromObra(string obraID)
        {
            try
            {
                return _unitOfWork.FolhaDePontos.GetAllFromObra(obraID).Select(x => x.toFolhaDePontoInfoModel()).ToList();
            }catch(Exception e)
            {
                return null;
            }
        }

        public FolhaDePontoValuesOutputModel GetFromMercado(string mercado, string ano, string mes)
        {
            try
            {
                List<FolhaDePonto> folhaDePontoList = _unitOfWork.FolhaDePontos.GetFromMercado(mercado, ano, mes);
                return null;
            }catch(Exception e)
            {
                return null;
            }
            
            
        }

        public FolhaDePontoValuesOutputModel GetFromObra(string obraID, string ano, string mes)
        {
            try
            {
                FolhaDePonto folhaDePonto = _unitOfWork.FolhaDePontos.GetFromObra(obraID, ano, mes);
                
                FolhaDePontoInfoModel info = new FolhaDePontoInfoModel{
                    Ano = ano,
                    Mes = mes
                };


                Mercado mercado = folhaDePonto.MercadoNavigation;

                int previousMonth = CalendarUtils.GetPreviousMonth(info.Mes);
                string prevMonthStr = previousMonth >= 10 ? previousMonth.ToString() : "0" + previousMonth.ToString();
                
                string startAno = ano;
                if(previousMonth == 12) startAno = (int.Parse(info.Ano)-1).ToString();

                DateOnly startDate = DateOnly.Parse(String.Format("{0}-{1}-{2}", startAno, prevMonthStr, mercado.DiaInicio));
                DateOnly endDate = DateOnly.Parse(String.Format("{0}-{1}-{2}", ano, info.Mes, mercado.DiaFim));

                Dictionary<string, Dictionary<int, decimal>> FuncWorkDays =
                new Dictionary<string, Dictionary<int, decimal>>();

                Dictionary<string, decimal> FinalValue = new Dictionary<string, decimal>();

                List<FuncionarioOutputModel> funcionariosOutputModel = new List<FuncionarioOutputModel>();

                foreach(SalarioFinal sf in folhaDePonto.IdSalarios){
                    Dictionary<int, decimal> WorkDay = new Dictionary<int, decimal>();
                    FinalValue.Add(sf.Funcionario, sf.Valorfinal);
                    funcionariosOutputModel.Add(sf.FuncionarioNavigation.toOutputModel());
                    List<DiaTrabalho> diasTrabalho = _unitOfWork.DiasTrabalho.GetFuncDaysFromObraBetweenDates(sf.Funcionario, obraID, startDate, endDate);
                    diasTrabalho.ForEach( dt => {
                        WorkDay.Add(dt.Dia, dt.Horas);
                    });
                    FuncWorkDays.Add(sf.Funcionario, WorkDay);
                }
                
                List<int> Limits = new List<int>();
                List<int> saturdays;
                List<int> sundays;
                List<int> holidays;

                CalendarUtils.GetNonWorkDays(ano, mes, mercado, out saturdays, out sundays, out holidays);


                int midLimit = CalendarUtils.GetMidLimit(info.Ano, info.Mes);
                Limits.Add((int)mercado.DiaInicio);
                Limits.Add(midLimit);
                Limits.Add((int)mercado.DiaFim);

                
                return new FolhaDePontoValuesOutputModel{
                    Info = info,
                    FuncWorkDays = FuncWorkDays,
                    FinalValue = FinalValue,
                    Funcionarios = funcionariosOutputModel,
                    Limits = Limits,
                    Saturdays = saturdays,
                    Sundays = sundays,
                    Holidays = holidays
                };

            }catch(Exception e)
            {
                return null;
            }
            
        }

        public void setValues(string obraID, string date, FolhaDePontoValuesInputModel values)
        {
            string[] dateArr = date.Split("-");
            string mes = dateArr[1];
            string ano = dateArr[0];

            FolhaDePonto folha = _unitOfWork.FolhaDePontos.GetFromObra(obraID, ano, mes);

            Mercado mercado = _unitOfWork.Obras.Get(obraID).MercadoNavigation;

            int midLimit = CalendarUtils.GetMidLimit(ano, mes);

            values.Values.ForEach(f => {
                decimal valorFinal = 0;
                f.Dias.ForEach(dia => {
                    valorFinal = valorFinal + ((decimal) dia.Horas) * f.Func.Salarioreal;
                    
                    string monthStr = mes;
                
                    string anoStr = ano;

                    if(dia.Dia >= mercado.DiaInicio && dia.Dia <= midLimit){
                        int previousMonth = CalendarUtils.GetPreviousMonth(mes);
                        monthStr = previousMonth >= 10 ? previousMonth.ToString() : "0" + previousMonth.ToString();

                        if(previousMonth == 12) anoStr = (int.Parse(ano)-1).ToString();
                    }
                    DiaTrabalho diaTrabalho = new DiaTrabalho {
                        Funcionario = f.Func.Nif,
                        Codigoobra = obraID,
                        Dia = dia.Dia,
                        Horas = (decimal) dia.Horas,
                        Mes = monthStr,
                        Ano = anoStr,
                        Valor = f.Func.Salarioreal
                    };
                    _unitOfWork.DiasTrabalho.AddOrUpdate(diaTrabalho);
                });
                SalarioFinal salarioFinal = folha.IdSalarios.Where(sf => sf.Funcionario == f.Func.Nif).First();
                salarioFinal.Valorfinal = valorFinal;
                _unitOfWork.SalarioFinal.AddOrUpdate(salarioFinal);
            });
            _unitOfWork.Complete();
        }

        // private FolhaDePontoValuesOutputModel GenerateFolhaDePontoValuesOutputModel(List<FolhaDePonto> folhasDePonto, string ano, string mes)
        // {
        //     FolhaDePontoValuesOutputModel model = new FolhaDePontoValuesOutputModel();

        //     FolhaDePontoInfoModel info = new FolhaDePontoInfoModel();
        //     info.Mes = mes;
        //     info.Ano = ano;
        //     model.Info = info;

        //     Dictionary<string, Dictionary<int, decimal>> FuncWorkDays =
        //         new Dictionary<string, Dictionary<int, decimal>>();

        //     Dictionary<string, decimal> FinalValue = new Dictionary<string, decimal>();

        //     List<FuncionarioOutputModel> funcionariosOutputModel = new List<FuncionarioOutputModel>();

        //     foreach (FolhaDePonto folha in folhasDePonto)
        //     {
        //         foreach (SalarioFinal salario in folha.IdSalarios)
        //         {

        //             Funcionario funcionario = salario.FuncionarioNavigation;
        //             FuncionarioOutputModel funcionarioOutputModel = funcionario.toOutputModel();

        //             Dictionary<int, decimal> diasAReceber = new Dictionary<int, decimal>();

        //             foreach (DiaTrabalho dia in funcionario.DiaTrabalhos)
        //             {
        //                 diasAReceber.Add(dia.Dia, dia.Valor);
        //             }
        //             funcionariosOutputModel.Add(funcionarioOutputModel);
        //             FuncWorkDays.Add(funcionario.Nif, diasAReceber);
        //             FinalValue.Add(funcionario.Nif, salario.Valorfinal);
        //         }

        //     }

        //     model.FuncWorkDays = FuncWorkDays;
        //     model.FinalValue = FinalValue;
        //     model.funcionariosOutputModel = funcionariosOutputModel;

        //     model.Limits = new List<int>();
        //     List<int> saturdays;
        //     List<int> sundays;
        //     List<int> holidays;

        //     Mercado interval = folhasDePonto[0].MercadoNavigation;

        //     CalendarUtils.GetNonWorkDays(ano, mes, interval, out saturdays, out sundays, out holidays);


        //     int midLimit = CalendarUtils.GetMidLimit(info.Ano, info.Mes);
        //     model.Limits.Add((int)interval.DiaInicio);
        //     model.Limits.Add(midLimit);
        //     model.Limits.Add((int)interval.DiaFim);

        //     model.Saturdays = saturdays;
        //     model.Sundays = sundays;
        //     model.Holidays = holidays;

        //     return model;
        // }
    }
}
