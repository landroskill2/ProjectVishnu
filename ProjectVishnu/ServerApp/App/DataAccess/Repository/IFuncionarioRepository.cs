﻿using ProjectVishnu.Models;

namespace ProjectVishnu.DataAccess.Repository
{
    public interface IFuncionarioRepository : IRepository<Funcionario>
    {
        IEnumerable<Funcionario> ListByMarket(string mercado);
        IEnumerable<Funcionario> ListAlphabetically();

        IEnumerable<Funcionario> SearchByName(string nome);

        void Delete(int id);

        void Update(Funcionario funcionario);

        int Add(Funcionario funcionario);
        Funcionario Get(int id);
    }
}
