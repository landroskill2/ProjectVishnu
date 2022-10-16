﻿using System;
using System.Collections.Generic;

namespace ProjectVishnu.Models
{
    public partial class Funcionario
    {
        public string Nome { get; set; } = null!;
        public DateOnly Dtnascimento { get; set; }
        public string Telemovel { get; set; } = null!;
        public string Contactoemergencia { get; set; } = null!;
        public string Nacionalidade { get; set; } = null!;
        public string Mercado { get; set; } = null!;
        public string Tipodocident { get; set; } = null!;
        public string Docident { get; set; } = null!;
        public string? Tituloresidencia { get; set; }
        public string? Manifestacaointeresse { get; set; }
        public DateOnly Validadedocident { get; set; }
        public string Catprof { get; set; } = null!;
        public string Nif { get; set; } = null!;
        public string Niss { get; set; } = null!;
        public string Morada { get; set; } = null!;
        public DateOnly Contratoinicio { get; set; }
        public DateOnly Contratofim { get; set; }
        public decimal Vencimentobase { get; set; }
        public string Tiposalario { get; set; } = null!;
        public decimal Salarioreal { get; set; }
        public decimal? Calcado { get; set; }
        public string Cartaconducao { get; set; } = null!;
        public string Iban { get; set; } = null!;

        public virtual CategoriasProfissionai CatprofNavigation { get; set; } = null!;
    }
}
