DROP TABLE IF EXISTS CONTA;
DROP TABLE IF EXISTS FOLHAS_SALARIO;
DROP TABLE IF EXISTS FOLHA_DE_PONTO;
DROP TABLE IF EXISTS SALARIO_FINAL;
DROP TABLE IF EXISTS DIA_TRABALHO;
DROP TABLE IF EXISTS FUNCIONARIOS_OBRAS;
DROP TABLE IF EXISTS OBRA;
DROP TABLE IF EXISTS FUNCIONARIO;
DROP TABLE IF EXISTS CATEGORIAS_PROFISSIONAIS;
DROP TABLE IF EXISTS TIPO_DOC;
DROP TABLE IF EXISTS MERCADO;

CREATE TABLE TIPO_DOC(
		Sigla varchar(5) PRIMARY KEY,
		Designacao varchar(50)
);

CREATE TABLE CATEGORIAS_PROFISSIONAIS(
		codigo varchar(7) PRIMARY KEY,
		nomenclatura varchar(50) NOT NULL
);

CREATE TABLE MERCADO(
		MercadoName varchar(40) primary key,
		Sigla varchar(2),
		Dia_Inicio int,
		Dia_Fim int
);

CREATE TABLE FUNCIONARIO(
		Id INT GENERATED ALWAYS AS IDENTITY,
		Nome varchar(200) NOT NULL,
		DtNascimento date NOT NULL,
		Telemovel varchar(15) NOT NULL,
		ContactoEmergencia varchar(15) NOT NULL,
		Nacionalidade varchar(20) NOT NULL,
		Mercado varchar(40) references MERCADO(MercadoName),
		TipoDocIdent varchar(5) references TIPO_DOC(Sigla) NOT NULL,
		DocIdent varchar(20) NOT NULL,
		Passaporte varchar(20),
		ValidadeDocIdent date NOT NULL,
		CatProf varchar(7) references CATEGORIAS_PROFISSIONAIS(codigo) NOT NULL,
		NIF varchar(15) primary key, 
		NISS varchar(15) NOT NULL,
		Morada varchar(200) NOT NULL,
		ContratoInicio date NOT NULL,
		ContratoFim date NOT NULL,
		VencimentoBase decimal(8, 2) NOT NULL,
		TipoSalario	varchar NOT NULL,
		SalarioReal	decimal(8, 2) NOT NULL,
		Calcado	decimal(3, 1),
		CartaConducao boolean NOT NULL,
		IBAN varchar(30) NOT NULL,
		deleted date default null,

		constraint chk_TipoSalario CHECK(TipoSalario IN('horario', 'fixo'))
);

CREATE TABLE OBRA (
		CodigoInterno varchar(20) primary key,
        Designacao varchar(20) NOT NULL,
        Cliente varchar(20) NOT NULL,
        DataInicio date NOT NULL,
        DataFim date,
        Mercado varchar(40) references MERCADO(MercadoName),
        AutosDeMedicao varchar(100) NOT NULL,
		deleted date default null
);

CREATE TABLE FUNCIONARIOS_OBRAS(
		Funcionario varchar(15) references Funcionario(NIF),
		Obra varchar(20) references Obra(CodigoInterno),
		DataComeco date NOT NULL,
		DataFim date,  /* se a data estiver a null sinaliza que é a obra onde o funcionário se encontra atualmente.*/
		primary key(Funcionario, Obra, DataComeco)
);

CREATE TABLE DIA_TRABALHO(
		Funcionario varchar(15) references Funcionario(NIF),
        CodigoObra varchar(20)references Obra(CodigoInterno),
        Dia int NOT NULL,
		Horas decimal(3, 1) NOT NULL,
        Mes varchar(9) NOT NULL, 
        Ano varchar(4) NOT NULL,
        Valor decimal(8, 2) NOT NULL,
		constraint chk_Mes CHECK(Mes IN('01', '02', 
        '03', '04', '05', '06', '07', '08', 
        '09', '10', '11', '12')),
		primary key(Funcionario, CodigoObra, Dia, Mes, Ano)
);

CREATE TABLE SALARIO_FINAL(
		Id INT UNIQUE GENERATED ALWAYS AS IDENTITY, 
		Funcionario varchar(15) references Funcionario(NIF),
		Mes varchar(9) NOT NULL, 
        Ano varchar(4) NOT NULL,
        ValorFinal decimal(8, 2) NOT NULL,
		ValorAPagar decimal(8, 2),
		primary key(Funcionario, Mes, Ano)
);

CREATE TABLE FOLHA_DE_PONTO(
		Id INT UNIQUE GENERATED ALWAYS AS IDENTITY,
		Mes varchar(9) NOT NULL, 
        Ano varchar(4) NOT NULL,
		Obra varchar(20) references Obra(CodigoInterno),
		Mercado varchar(40) references MERCADO(mercadoName),
		primary key(Mes,Ano,Obra)
);

CREATE TABLE FOLHAS_SALARIO(
		Id_salario int references SALARIO_FINAL(Id),
		Id_folha_de_ponto int references FOLHA_DE_PONTO(Id),
		primary key(Id_salario,Id_folha_de_ponto)
);

CREATE TABLE CONTA(
		Username varchar(40) primary key,
		Pwd varchar(64)
);


INSERT INTO CATEGORIAS_PROFISSIONAIS
(codigo,nomenclatura) values
('CA1','Carpinteiro de primeira'),
('CA2','Carpinteiro de segunda'),
('PE1', 'Pedreiro de primeira');

INSERT INTO TIPO_DOC
(sigla, designacao) values
('CC', 'Cartão de Cidadão'),
('TR', 'Título de Residência'),
('MI', 'Manifestação de Interesse');

INSERT INTO MERCADO
(mercadoName,sigla,dia_inicio,dia_fim) values
('portugal','PT',21,20),
('espanha','ES',26,25),
('franca','FR',21,20);

INSERT INTO FUNCIONARIO 
(nome,dtnascimento,telemovel,contactoemergencia,nacionalidade,mercado,
tipodocident,docident,
validadedocident,catprof,nif,niss,morada,contratoinicio,
contratofim,vencimentobase,tiposalario,salarioreal,calcado,
cartaconducao,iban, passaporte) values
('Francisco Martins','1999-03-20',
'916705652','214439239','Portuguesa',
'portugal','CC','14627570',
'2025-09-19','CA1','255896379',
'12345678910','Rua Leandro Bolota n420',
'2021-03-09','2023-03-09',800.0,
'fixo',800.0,null,true,
'0000000000000000000000', null),
('Afonso Ramos','1999-05-30',
'919929349','214456789','Portuguesa',
'portugal','TR','13456234',
'2027-08-29','CA2','234567899',
'10987654321','Rua Antonio Silva n14 3Esq',
'2020-05-30','2022-05-30',900.0,
'fixo',900.0,null,true,
'111111111111111111111', null),
('Joao Filipe','1985-06-07',
'967899876','214498672','Espanhola',
'espanha','MI','195345543',
'2023-09-09','CA2','244555678',
'12436587091','Rua Umberto Delgado n66',
'2019-08-20','2022-12-31',900.0,
'horario',900.0,null,true,
'22222222222222222222', 'BA03923'),
('Andre Ferro','1999-03-04',
'914324322','214455444','Espanhola',
'espanha','CC','123321111',
'2025-03-03','PE1','321311322',
'12333221222','Rua Joao Andrade 520',
'2021-05-06','2023-05-06',900.0,
'horario',900.0,null,false,
'12312232132113211133',null);

INSERT INTO OBRA
(codigointerno,designacao,cliente,
datainicio,datafim,mercado,autosdemedicao) values
('OB22ES01','Obra em Espanha','FCBarcelona',
'2022-08-09','2026-09-08','espanha',
'Autos de medicao'),
('OB22PT01','Obra de um edificio','ISEL',
'2022-05-09','2025-05-09','portugal',
'Autos de medicao'),
('OB21PT01','Obra de uma escola','ESEL',
'2021-06-30','2024-06-30','portugal',
'Autos de medicao'),
('OB22ES02','Obra de um estadio','Real Madrid',
'2022-07-09','2026-09-08','espanha',
'Autos de medicao'),
('OB22FR01','Obra de um estadio','PSG',
'2022-07-09','2026-09-08','franca',
'Autos de medicao');

INSERT INTO FUNCIONARIOS_OBRAS
(funcionario,obra,datacomeco,datafim) values
('234567899','OB22PT01','2022-05-21',null),
('255896379','OB22PT01','2022-05-21',null);


INSERT INTO DIA_TRABALHO
(funcionario,codigoobra,dia,horas,mes,ano,valor) values
('234567899','OB22PT01',21,8,'06','2022',56),
('234567899','OB22PT01',22,8,'06','2022',56),
('234567899','OB22PT01',23,8,'06','2022',56),
('234567899','OB22PT01',24,8,'06','2022',56),
('234567899','OB22PT01',25,8,'06','2022',56),
('234567899','OB22PT01',26,8,'06','2022',56),
('234567899','OB22PT01',27,8,'06','2022',56),
('234567899','OB22PT01',28,8,'06','2022',56),
('234567899','OB22PT01',29,8,'06','2022',56),
('234567899','OB22PT01',30,8,'06','2022',56),
('234567899','OB22PT01',1,8,'06','2022',56),
('234567899','OB22PT01',2,8,'06','2022',56),
('234567899','OB22PT01',3,8,'06','2022',56),
('234567899','OB22PT01',4,8,'06','2022',56),
('234567899','OB22PT01',5,8,'06','2022',56),
('234567899','OB22PT01',6,8,'06','2022',56),
('234567899','OB22PT01',7,8,'06','2022',56),
('234567899','OB22PT01',8,8,'06','2022',56),
('234567899','OB22PT01',9,8,'06','2022',56),
('234567899','OB22PT01',10,8,'06','2022',56),
('234567899','OB22PT01',11,8,'06','2022',56),
('234567899','OB22PT01',12,8,'06','2022',56),
('234567899','OB22PT01',13,8,'06','2022',56),
('234567899','OB22PT01',14,8,'06','2022',56),
('234567899','OB22PT01',15,8,'06','2022',56),
('234567899','OB22PT01',16,8,'06','2022',56),
('234567899','OB22PT01',17,8,'06','2022',56),
('234567899','OB22PT01',18,8,'06','2022',56),
('234567899','OB22PT01',19,8,'06','2022',56),
('234567899','OB22PT01',20,8,'06','2022',56);

INSERT INTO SALARIO_FINAL
(funcionario,mes,ano,valorfinal,valorapagar) values
('234567899','06','2022',999,999);

INSERT INTO FOLHA_DE_PONTO
(mes,ano,obra,mercado) values
('01','2022','OB22PT01','portugal'),
('02','2022','OB22PT01','portugal'),
('03','2022','OB22PT01','portugal'),
('04','2022','OB22PT01','portugal'),
('05','2022','OB22PT01','portugal'),
('06','2022','OB22PT01','portugal'),
('07','2022','OB22PT01','portugal'),
('08','2022','OB22PT01','portugal'),
('09','2022','OB22PT01','portugal'),
('09','2022','OB22ES01','espanha');

INSERT INTO FOLHAS_SALARIO
(id_salario,id_folha_de_ponto) values
(1,6);

INSERT INTO CONTA
(username,pwd) values
('afonso','afonso123');