import React, { useEffect, useState, } from "react";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td
} from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { fetchFolhaDePontoByMercado, submitFolhaDePontoValues } from "../common/APICalls";
import IFolhaDePontoOutput from "../common/Interfaces/FolhaDePonto/IFolhaDePontoOutput";
import IFuncionarioOutput from "../common/Interfaces/Funcionario/IFuncionarioOutput";
import FolhaDePontoValuesInput, { FuncDaysOfWorkInput } from "../common/Interfaces/FolhaDePonto/IFolhaDePontoInput";
import IFuncionarioInput from "../common/Interfaces/Funcionario/IFuncionarioInput";

type FolhaDePontoTableProps = {
    folhaDePontoData : IFolhaDePontoOutput,
    submitValues? : (values : FolhaDePontoValuesInput) => {}
    //acrescentar as funções necessárias
}

export function FolhaDePontoTable({ folhaDePontoData, submitValues } : FolhaDePontoTableProps){

    
    async function formatValues() {
        // TODO check values type
        const firstDay = folhaDePontoData.limits[0]
        const endOfMonth = folhaDePontoData.limits[1]
        const lastDay = folhaDePontoData.limits[2]
        let values : FolhaDePontoValuesInput = {values : []}

        folhaDePontoData.funcionarios.forEach(func => {
            
            let funcValues : FuncDaysOfWorkInput = {func : func as IFuncionarioInput, dias : []}
            let day = firstDay
            for(day; day != lastDay; day = (day + 1)%endOfMonth){
                if(day == 0) day = endOfMonth
                let hours : string | number = document.getElementById(`Func${func.id}Day${day}`)!.innerHTML
                if(hours === '') hours = 0
                else hours = Number(hours)
                funcValues.dias.push(
                    {
                        dia: day,
                        horas: hours
                    }
                )
            }
            //console.log(document.getElementById(`Val${func.id}`).innerHTML === '')
            // VER SE SALARIO FINAL É DIFERENTE DO SALARIO FINAL RECEBIDO E SE FOR, ENVIAR ESSE VALOR
            values.values.push(funcValues)
        })
        submitValues!(values)
    }

    // async function fetchDataByMercado(){
    //     const [ano, mes] = data.split("-")
    //     const res = await fetchFolhaDePontoByMercado(mercado, ano, mes)
    //     const jsonInfo = await res.json()
    //     setInfo(jsonInfo)
    // }

    // async function fetchDataByObra(){
    //     const [ano, mes] = data.split("-")
    //     const res = await fetchFolhaDePontoByMercado(codigo, ano, mes)
    //     const jsonInfo = await res.json()
    //     setInfo(jsonInfo)
    // }

    return(
        renderTable(folhaDePontoData)
    )

    function renderTable(folhaDePontoData : IFolhaDePontoOutput){
        const days = getHeaderDaysColumns(folhaDePontoData)
        const funcRows = getFuncRows(folhaDePontoData, days)

        return(
            <div>
                <Table size='sm' variant='unstyled' className='border-collapse border-slate-500 border-4' aria-labelledby="tabelLabel">
                    <Thead>
                    <Tr>
                        <Th className="border-collapse border-2 border-slate-300">Funcionario</Th>
                        {days}
                        <Th className="border-collapse border-2 border-slate-300">Salário Final</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                        {funcRows.map(f => 
                            {
                                return <Tr key={f.func.id}>
                                    <Td className="border-collapse border-2 border-slate-300">{f.func.nome}</Td>
                                    {f.data}
                                    {!folhaDePontoData.finalValue && <Td className="border-collapse border-2 border-slate-300" id={`Val${f.func.id}`} contentEditable={submitValues !== undefined}></Td>}
                                    {folhaDePontoData.finalValue && <Td className="border-collapse border-2 border-slate-300" id={`Val${f.func.id}`} contentEditable={submitValues !== undefined}>{folhaDePontoData.finalValue[f.func.nif as keyof Map<string, number>]}</Td>}

                                </Tr>;
                            }
                        )}
                    </Tbody>
                </Table>
                <button type="button" className="btn btn-primary" onClick={() => formatValues()}>Submeter</button>
            </div>
        )
    }

    function getFuncRows(folhaData : IFolhaDePontoOutput, days : React.ReactElement[]) : {func : IFuncionarioOutput, data : React.ReactElement[]}[]{
        const funcRows : {func : IFuncionarioOutput, data : React.ReactElement[]}[] = []
    
        console.log(folhaData)
        folhaData.funcionarios.forEach(func => {
            funcRows.push(
                {func : func, data : []}
            )
        })
    
        funcRows.forEach(row => {
            days.forEach(day => {
                let funcNif = row.func.nif as keyof Map<string, Map<number, number>>
                let daysOfFunc = folhaData.funcWorkDays[funcNif].valueOf()
                console.log(daysOfFunc)
                let dayNumber = day.props.children as keyof Object
                let hours = daysOfFunc[dayNumber] as unknown as number
                if(hours != 0){
                    row.data.push(
                        <Td contentEditable={submitValues !== undefined} id={`Func${row.func.id}Day${day.props.children}`} className={getClassName(folhaData, day.props.children)}>{hours}</Td>
                    )
                }else{
                    row.data.push(
                        <Td contentEditable={submitValues !== undefined} id={`Func${row.func.id}Day${day.props.children}`} className={getClassName(folhaData, day.props.children)}></Td>
                    )
                }
                
            })
        })
    
        return funcRows
    }
}

function getHeaderDaysColumns(data : IFolhaDePontoOutput) : React.ReactElement[]{
    const days = []
    const firstDay = data.limits[0]
    const endOfMonth = data.limits[1]
    const lastDay = data.limits[2]
    let day = firstDay
        
    for(day; day != lastDay; day = (day + 1)%endOfMonth){
        if(day == 0) day = endOfMonth
        days.push(
            <Th className={getClassName(data, day)}>{day}</Th>
        )
    }
    days.push(<Th className={getClassName(data, lastDay)}>{lastDay}</Th>)

    return days
}

function getClassName(data : IFolhaDePontoOutput, day : number){
    let className = 'border-2 border-slate-300'
        if(data.saturdays.includes(day)){
            className = className.concat(' bg-blue-300')
        }else if(data.sundays.includes(day)){
            className = className.concat(' bg-orange-400')
        }else if(data.holidays.includes(day)){
            className = className.concat(' bg-red-900')
        }
    return className
}