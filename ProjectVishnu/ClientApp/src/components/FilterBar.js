import React, { useEffect, useState } from 'react'

export function FilterBar({searchByMercado, searchBarSubmit}){
    const [mercados, setMercados] = useState(null)
    const [dropdownText, setDropdownText] = useState("Mercados")

    function onClickSearch(){
        const searchString= document.getElementById("searchBar").value
        searchBarSubmit(searchString)
    }

    function onClickDropDownItem(mercado){
        setDropdownText(mercado)
        searchByMercado(mercado)
    }

    useEffect(() => {
        const getMercadosData = async ()=> {
            const response = await fetch('api/mercados')
            const data = await response.json()
            setMercados(data)
        }

        getMercadosData()
        
    }, [])

    return (
        <nav class="navbar bg-light">
        <div class = "container-fluid">
            {mercados && <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {dropdownText}
                </button>
                <ul class="dropdown-menu">
                    {mercados.map(mercado => 
                        <li><button class="dropdown-item" onClick={() => onClickDropDownItem(mercado)}>{mercado}</button></li>
                    )}
                </ul>
                </div>}
            <form class="d-flex" role="search">
                <input class="form-control me-2" id= "searchBar" type="search" placeholder="Search" aria-label="Search"/>
                <button class="btn btn-outline-success" type="button" onClick = { () => onClickSearch()}>Search</button>
            </form>
        </div>
        </nav>
    )
}