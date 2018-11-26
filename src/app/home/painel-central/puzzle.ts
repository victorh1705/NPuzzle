import {Item} from './item';

export class Puzzle {
  linhas = 3;
  colunas = 3;
  nosExpandidos = 0;
  nosVisitados = 0;
  profundidadeAtual = 0;
  idPaiAtual = 0;
  indiceMenorDistManhattan = -1;
  valorMenorDistancia = 1000;
  qtdTrocasEmbaralhamento = 50;
  posicaoVazia = null;
  constanteDeSobra = 1000;
  passosSolucao = 0;
  passoAtual = 0;
  passosRestantes = 0;
  fatorMultiplicacao = 1;
  fatorRamificacao = 0.0;
  custoSolucao = 0.0;
  resultadoObtido = false;
  embaralhado = false;
  rodando = false;
  habilitarBotaoVParaCaminhar = false;
  voltouProPai = false;
  valores = new Array<number>(this.linhas * this.colunas);
  valoresBackup = new Array<number>(this.linhas * this.colunas);
  auxVerificaLoop = new Array<number>(this.linhas * this.colunas);
  estadosVisitados = new Array<Item>(this.linhas * this.colunas * this.constanteDeSobra * this.fatorMultiplicacao);
  caminhoSolucao = new Array<number>(this.constanteDeSobra);
  posicaoAtualVisitados = 0;
  tempoInicial: Date;
  tempoFinal: Date;
  private profundidade: number;


  backtracking(): void {
    this.idPaiAtual = 0;
    this.profundidade = 0;
    this.profundidadeAtual = 0;
    this.voltouProPai = false;
    console.log('Executando backtracking, aguarde...\n');
    // this.tempoInicial = clock();
    let movimentoRealizado: number;
    let fracasso = false;
    let sucesso = false;
    this.rodando = true;
    this.limpaEstadosVisitados();
    this.adicionaNovoEstadoVisitado(-1);
    if (this.verificaSolucao()) {
      sucesso = true;
    }
    while (!sucesso && !fracasso) {
      if ((this.posicaoAtualVisitados % 25000) === 0) {
        console.log('Aguarde mais um pouco...\n');
      }
      movimentoRealizado = this.escolherRegra();
      if (movimentoRealizado !== -1) {
        if (!this.voltouProPai) {
          this.idPaiAtual = this.posicaoAtualVisitados;
        } else {
          this.voltouProPai = false;
        }
        this.adicionaNovoEstadoVisitado(this.idPaiAtual);
        if (this.verificaSolucao()) {
          sucesso = true;
        }
      } else {
        if (this.verificaFracasso()) {
          fracasso = true;
        } else {
          this.voltaProPai();
        }
      }
    }
    // this.tempoFinal = clock();
    // const duracao = console.timeEnd('tempo');
    this.resultadoObtido = true;
    this.rodando = false;
    this.embaralhado = false;
    this.nosExpandidos = this.posicaoAtualVisitados;
    this.nosVisitados = this.posicaoAtualVisitados + 1;
    this.fatorRamificacao = 1.00;
    this.fatorMultiplicacao = 1;
    // this.tempoExecucao = (duracao) / 1000.0;
    // system("cls");
  }

  buscaLargura(largura: boolean): void {
    this.profundidade = 0;
    this.profundidadeAtual = 0;
    if (largura) {
      console.log('Executando busca em largura, aguarde...\n');
    } else {
      console.log('Executando busca ordenada, aguarde...\n');
    }
    // tempoInicial = clock();
    let fracasso = false, sucesso = false;
    this.rodando = true;
    this.limpaEstadosVisitados();
    this.adicionaPaiListaAbertos(-1, false);
    while (!sucesso && !fracasso) {
      if ((this.posicaoAtualVisitados % 25000) === 0) {
        console.log('Aguarde mais um pouco...\n');
      }
      if (this.verificaSolucao()) {
        sucesso = true;
      } else {
        if (!this.obterProximoEstado('F')) {
          fracasso = true;
        }
      }
    }
    this.resultadoObtido = true;
    this.rodando = false;
    this.embaralhado = false;
    this.nosExpandidos = this.posicaoAtualVisitados;
    this.nosVisitados = this.contaEstadosFechados() + 1;
// tempoExecucao=(tempoFinal-tempoInicial)/1000.0;
    this.fatorRamificacao = this.nosExpandidos / this.nosVisitados;
    this.fatorMultiplicacao = 1;
    this.profundidade--;
// system("cls");
  }


  buscaProfundidade(): void {
    this.profundidade = 0;
    this.profundidadeAtual = 0;
    console.log('Executando busca em profundidade, aguarde...\n');
    // tempoInicial = clock();
    let fracasso = false, sucesso = false;
    this.rodando = true;
    this.limpaEstadosVisitados();
    this.adicionaPaiListaAbertos(-1, true);
    while (!sucesso && !fracasso) {
      if ((this.posicaoAtualVisitados % 25000) === 0) {
        console.log('Aguarde mais um pouco...\n');
      }
      if (this.verificaSolucao()) {
        sucesso = true;
      } else {
        if (!this.obterProximoEstado('P')) {
          fracasso = true;
        }
      }
    }
    // tempoFinal = clock();
    this.resultadoObtido = true;
    this.rodando = false;
    this.embaralhado = false;
    this.nosExpandidos = this.posicaoAtualVisitados;
    this.nosVisitados = this.contaEstadosFechados() + 1;
    // this.tempoExecucao = (this.tempoFinal - this.tempoInicial) / 1000.0;
    this.fatorRamificacao = this.nosExpandidos / this.nosVisitados;
    this.fatorMultiplicacao = 1;
    this.profundidade--;
  }

  buscaOrdenada(): void {
    this.buscaLargura(false);
  }

  buscaGulosa(): void {
    this.profundidade = 0;
    this.profundidadeAtual = 0;
    this.indiceMenorDistManhattan = -1;
    this.valorMenorDistancia = 1000;
    console.log('Executando busca gulosa, aguarde...\n');
    // this.tempoInicial = clock();
    let fracasso = false, sucesso = false;
    this.rodando = true;
    this.limpaEstadosVisitados();
    this.adicionaPaiListaAbertos(-1, false);
    while (!sucesso && !fracasso) {
      if ((this.posicaoAtualVisitados % 25000) === 0) {
        console.log('Aguarde mais um pouco...\n');
      }
      if (this.verificaSolucao()) {
        sucesso = true;
      } else {
        if (!this.obterProximoEstado('M')) {
          fracasso = true;
        }
      }
    }
    // this.tempoFinal = clock();
    this.resultadoObtido = true;
    this.rodando = false;
    this.embaralhado = false;
    this.nosExpandidos = this.posicaoAtualVisitados;
    this.nosVisitados = this.contaEstadosFechados() + 1;
    // this.tempoExecucao = (this.tempoFinal - this.tempoInicial) / 1000.0;
    this.fatorRamificacao = this.nosExpandidos / this.nosVisitados;
    this.fatorMultiplicacao = 1;
    this.profundidade--;
    // system("cls");
  }


  aEstrela(): void {
    this.profundidade = 0;
    this.profundidadeAtual = 0;
    this.indiceMenorDistManhattan = -1;
    this.valorMenorDistancia = 1000;
    console.log('Executando A*, aguarde...\n');
    // this.tempoInicial = clock();
    let fracasso = false, sucesso = false;
    this.rodando = true;
    this.limpaEstadosVisitados();
    this.adicionaPaiListaAbertos(-1, false);
    while (!sucesso && !fracasso) {
      if ((this.posicaoAtualVisitados % 25000) === 0) {
        console.log('Aguarde mais um pouco...\n');
      }
      if (this.verificaSolucao()) {
        sucesso = true;
      } else {
        if (!this.obterProximoEstado('A')) {
          fracasso = true;
        }
      }
    }
    // this.tempoFinal = clock();
    this.resultadoObtido = true;
    this.rodando = false;
    this.embaralhado = false;
    this.nosExpandidos = this.posicaoAtualVisitados;
    this.nosVisitados = this.contaEstadosFechados() + 1;
    // this.tempoExecucao = (this.tempoFinal - this.tempoInicial) / 1000.0;
    this.fatorRamificacao = this.nosExpandidos / this.nosVisitados;
    this.fatorMultiplicacao = 1;
    this.profundidade--;
    // system("cls");
  }

  embaralhar(): void {
    this.limpaEstadosVisitados();
    this.ordenar();
    for (let j = 0; j < this.qtdTrocasEmbaralhamento; j++) {
      if (!this.realizaMovimento(Math.floor(Math.random() * 100) % 4)) {
        j--;
      }
    }
    if (this.verificaSolucao()) {
      while (!this.realizaMovimento(Math.floor(Math.random() * 100) % 4)) {
      }
    }
    /*valores[0]=4;
    valores[1]=-1;
    valores[2]=1;
    valores[3]=3;
    valores[4]=2;
    valores[5]=5;
    posicaoVazia=1;*/
    for (let i = 0; i < this.linhas * this.colunas; i++) {
      this.valoresBackup[i] = this.valores[i];
    }
    this.resultadoObtido = false;
    this.embaralhado = true;
  }

  prepararAnimacao(): void {
    let idCaminho: number;
    this.passosSolucao = 1;
    this.passoAtual = 0;
    const auxCaminhoSolucao = new Array<number>(this.constanteDeSobra);
    idCaminho = this.obterIdSolucao() - 1;
    auxCaminhoSolucao[0] = idCaminho;
    for (let i = 1; idCaminho !== -2; i++) {
      idCaminho = this.estadosVisitados[idCaminho].idPai - 1;
      if (idCaminho !== -2) {
        auxCaminhoSolucao[i] = idCaminho;
        this.passosSolucao++;
      }
    }
    this.caminhoSolucao = null;
    this.caminhoSolucao = new Array<number>(this.passosSolucao);
    for (let i = 0; i < this.passosSolucao; i++) {
      this.caminhoSolucao[i] = auxCaminhoSolucao[this.passosSolucao - 1 - i];
    }
    this.habilitarBotaoVParaCaminhar = true;
    this.realizarAnimacao();
  }

  escolherRegra(): number {
    const regras = [0, 2, 3, 1];
    for (let i = 0; i < 4; i++) {
      if (this.realizaMovimento(regras[i])) {
        return regras[i];
      }
    }
    return -1;
  }

  realizarAnimacao(): void {
    if (this.passoAtual < this.passosSolucao) {
      for (let i = 0; i < this.linhas * this.colunas; i++) {
        this.valores[i] = this.estadosVisitados[this.caminhoSolucao[this.passoAtual]].estado[i];
        if (this.valores[i] === -1) {
          this.posicaoVazia = i;
        }
      }
      this.passoAtual++;
      if (this.passoAtual === this.passosSolucao) {
        this.habilitarBotaoVParaCaminhar = false;
      }
    }
  }

  atualiza(): void {
    this.valores = new Array<number>(this.linhas * this.colunas);
    this.valoresBackup = new Array<number>(this.linhas * this.colunas);
    this.auxVerificaLoop = new Array<number>(this.linhas * this.colunas);
    this.estadosVisitados = new Array<Item>(this.linhas * this.colunas * this.constanteDeSobra * this.fatorMultiplicacao);
    this.caminhoSolucao = new Array<number>(this.constanteDeSobra);
  }

  ordenar(): void {
    this.resultadoObtido = false;
    this.habilitarBotaoVParaCaminhar = false;
    this.embaralhado = false;
    this.valores = new Array<number>(this.linhas * this.colunas);
    let i: number;
    for (i = 0; i < (this.linhas * this.colunas) - 1; i++) {
      this.valores[i] = i + 1;
    }
    this.valores[i] = -1;
    this.posicaoVazia = i;
  }

  realizaTroca(posicaoVazia: number, novaPosicaoVazia: number): boolean {
    if (this.verificaNaoGeraLoop(posicaoVazia, novaPosicaoVazia)) {
      this.valores[posicaoVazia] = this.valores[novaPosicaoVazia];
      this.valores[novaPosicaoVazia] = -1;
      return true;
    }
    return false;
  }

  contaEstadosFechados(): number {
    let contador = 0;
    for (let i = 0; i < this.posicaoAtualVisitados; i++) {
      if (!this.estadosVisitados[i].ativo) {
        contador++;
      }
    }
    return contador;
  }

  contaEstadosAbertos(): number {
    let contador = 0;
    for (let i = 0; i < this.posicaoAtualVisitados; i++) {
      if (this.estadosVisitados[i].ativo) {
        contador++;
      }
    }
    return contador;
  }

  limpaEstadosVisitados(): void {
    this.estadosVisitados = null;
    this.posicaoAtualVisitados = 0;
    this.estadosVisitados = new Array<Item>(this.linhas * this.colunas * this.constanteDeSobra);
  }

  private obterProximoEstado(tipoEscolha: string): boolean {
    if (tipoEscolha === 'F') {
      for (let i = 0; i < this.posicaoAtualVisitados; i++) {
        if (this.estadosVisitados[i].ativo) {
          for (let j = 0; j < (this.linhas * this.colunas); j++) {
            this.valores[j] = this.estadosVisitados[i].estado[j];
            if (this.valores[j] === -1) {
              this.posicaoVazia = j;
            }
          }
          this.estadosVisitados[i].ativo = false;
          this.profundidadeAtual = this.estadosVisitados[i].profundidade + 1;
          if (this.profundidade < this.profundidadeAtual) {
            this.profundidade = this.profundidadeAtual;
          }
          if ((this.posicaoAtualVisitados + 100) > (this.linhas * this.colunas * this.fatorMultiplicacao * this.constanteDeSobra)) {
            this.aumentaTamanhoVetorVisitados();
          }
          this.adicionaFilhosListaAbertos(this.estadosVisitados[i].id, false);
          return true;
        }
      }
      return false;
    } else if (tipoEscolha === 'P') {
      for (let i = this.posicaoAtualVisitados - 1; i >= 0; i--) {
        if (this.estadosVisitados[i].ativo) {
          for (let j = 0; j < (this.linhas * this.colunas); j++) {
            this.valores[j] = this.estadosVisitados[i].estado[j];
            if (this.valores[j] === -1) {
              this.posicaoVazia = j;
            }
          }
          this.estadosVisitados[i].ativo = false;
          this.profundidadeAtual = this.estadosVisitados[i].profundidade + 1;
          if (this.profundidade < this.profundidadeAtual) {
            this.profundidade = this.profundidadeAtual;
          }
          if ((this.posicaoAtualVisitados + 100) > (this.linhas * this.colunas * this.fatorMultiplicacao * this.constanteDeSobra)) {
            this.aumentaTamanhoVetorVisitados();
          }
          this.adicionaFilhosListaAbertos(this.estadosVisitados[i].id, true);
          return true;
        }
      }
      return false;
    } else if (tipoEscolha === 'M') {
      if (this.indiceMenorDistManhattan > -1) {
        for (let j = 0; j < (this.linhas * this.colunas); j++) {
          this.valores[j] = this.estadosVisitados[this.indiceMenorDistManhattan].estado[j];
          if (this.valores[j] === -1) {
            this.posicaoVazia = j;
          }
        }
        this.estadosVisitados[this.indiceMenorDistManhattan].ativo = false;
        this.profundidadeAtual = this.estadosVisitados[this.indiceMenorDistManhattan].profundidade + 1;
        if (this.profundidade < this.profundidadeAtual) {
          this.profundidade = this.profundidadeAtual;
        }
        if ((this.posicaoAtualVisitados + 100) > (this.linhas * this.colunas * this.fatorMultiplicacao * this.constanteDeSobra)) {
          this.aumentaTamanhoVetorVisitados();
        }
        const idAtual = this.estadosVisitados[this.indiceMenorDistManhattan].id;
        this.indiceMenorDistManhattan = -1;
        this.valorMenorDistancia = 1000;
        this.adicionaFilhosListaAbertos(idAtual, false);
        if (this.indiceMenorDistManhattan === -1) {
          for (let i = 0; i < this.posicaoAtualVisitados; i++) {
            if (this.estadosVisitados[i].ativo) {
              if (this.estadosVisitados[i].distManhattan < this.valorMenorDistancia) {
                this.valorMenorDistancia = this.estadosVisitados[i].distManhattan;
                this.indiceMenorDistManhattan = i;
              }
            }
          }
        }
        return true;
      }
      return false;
    } else {
      if (this.indiceMenorDistManhattan > -1) {
        for (let j = 0; j < (this.linhas * this.colunas); j++) {
          this.valores[j] = this.estadosVisitados[this.indiceMenorDistManhattan].estado[j];
          if (this.valores[j] === -1) {
            this.posicaoVazia = j;
          }
        }
        this.estadosVisitados[this.indiceMenorDistManhattan].ativo = false;
        this.profundidadeAtual = this.estadosVisitados[this.indiceMenorDistManhattan].profundidade + 1;
        if (this.profundidade < this.profundidadeAtual) {
          this.profundidade = this.profundidadeAtual;
        }
        if ((this.posicaoAtualVisitados + 100) > (this.linhas * this.colunas * this.fatorMultiplicacao * this.constanteDeSobra)) {
          this.aumentaTamanhoVetorVisitados();
        }
        const idAtual = this.estadosVisitados[this.indiceMenorDistManhattan].id;
        this.indiceMenorDistManhattan = -1;
        this.valorMenorDistancia = 1000;
        this.adicionaFilhosListaAbertos(idAtual, false);
        const indiceAtual = this.indiceMenorDistManhattan;
        this.indiceMenorDistManhattan = -1;
        this.valorMenorDistancia = 1000;
        for (let i = 0; i < this.posicaoAtualVisitados; i++) {
          if (this.estadosVisitados[i].ativo && this.estadosVisitados[i].profundidade < this.estadosVisitados[idAtual - 1].profundidade) {
            if (this.estadosVisitados[i].distManhattan < this.valorMenorDistancia) {
              this.valorMenorDistancia = this.estadosVisitados[i].distManhattan;
              this.indiceMenorDistManhattan = i;
            }
          }
        }
        if (this.indiceMenorDistManhattan === -1) {
          this.indiceMenorDistManhattan = indiceAtual;
        }
        if (this.indiceMenorDistManhattan === -1) {
          for (let i = 0; i < this.posicaoAtualVisitados; i++) {
            if (this.estadosVisitados[i].ativo
              && this.estadosVisitados[i].profundidade <= this.estadosVisitados[idAtual - 1].profundidade) {
              if (this.estadosVisitados[i].distManhattan < this.valorMenorDistancia) {
                this.valorMenorDistancia = this.estadosVisitados[i].distManhattan;
                this.indiceMenorDistManhattan = i;
              }
            }
          }
        }
        if (this.indiceMenorDistManhattan === -1) {
          for (let i = 0; i < this.posicaoAtualVisitados; i++) {
            if (this.estadosVisitados[i].ativo
              && this.estadosVisitados[i].profundidade <= this.estadosVisitados[idAtual - 1].profundidade + 1) {
              if (this.estadosVisitados[i].distManhattan < this.valorMenorDistancia) {
                this.valorMenorDistancia = this.estadosVisitados[i].distManhattan;
                this.indiceMenorDistManhattan = i;
              }
            }
          }
        }
        return true;
      }
      return false;
    }
  }

  private voltaProPai(): void {
    let idPai = -1;
    for (let i = this.posicaoAtualVisitados - 1; i >= 0 && idPai === -1; i--) {
      if (this.estadosVisitados[i].ativo) {
        idPai = this.estadosVisitados[i].idPai;
        this.estadosVisitados[i].ativo = false;
      }
    }
    for (let i = this.posicaoAtualVisitados - 1; i >= 0; i--) {
      if (this.estadosVisitados[i].id === idPai) {
        for (let j = 0; j < this.linhas * this.colunas; j++) {
          this.valores[j] = this.estadosVisitados[i].estado[j];
          if (this.valores[j] === -1) {
            this.posicaoVazia = j;
          }
        }
      }
    }
    this.idPaiAtual = idPai;
    this.voltouProPai = true;
  }

  private adicionaPaiListaAbertos(idPai: number, buscaProfundidade: boolean): void {
    const novoEstado = new Item();
    novoEstado.id = this.posicaoAtualVisitados + 1;
    novoEstado.idPai = idPai;
    novoEstado.estado = new Array<number>(this.linhas * this.colunas);
    for (let i = 0; i < this.linhas * this.colunas; i++) {
      novoEstado.estado[i] = this.valores[i];
    }
    novoEstado.profundidade = 0;
    novoEstado.ativo = false;
    this.estadosVisitados[this.posicaoAtualVisitados] = novoEstado;
    this.posicaoAtualVisitados++;
    this.profundidadeAtual = 1;
    this.adicionaFilhosListaAbertos(this.posicaoAtualVisitados, buscaProfundidade);
  }

  private adicionaFilhosListaAbertos(idPai: number, buscaProfundidade: boolean): void {
    const regras = [0, 2, 3, 1];
    if (buscaProfundidade) {
      regras[0] = 1;
      regras[1] = 3;
      regras[2] = 2;
      regras[3] = 0;
    }
    for (let i = 0; i < 4; i++) {
      this.geraFilho(regras[i], idPai);
    }
  }

  private adicionaNovoEstadoVisitado(idPai: number): void {
    const novoEstado = new Item();
    novoEstado.id = this.posicaoAtualVisitados + 1;
    novoEstado.idPai = idPai;
    if (idPai === -1) {
      novoEstado.profundidade = 0;
    } else {
      novoEstado.profundidade = this.estadosVisitados[idPai - 1].profundidade + 1;
    }
    novoEstado.ativo = true;
    this.estadosVisitados[this.posicaoAtualVisitados] = novoEstado;
    // prletf("id: %d , idPai: %d , profundidade: %d , estado : ",novoEstado.id,
    // novoEstado.idPai, novoEstado.profundidade);
    novoEstado.estado = new Array<number>(this.linhas * this.colunas);
    for (let i = 0; i < this.linhas * this.colunas; i++) {
      novoEstado.estado[i] = this.valores[i];
      // prletf("%d ",novoEstado.estado[i]);
    }
    this.posicaoAtualVisitados++;
    if (novoEstado.profundidade > this.profundidade) {
      this.profundidade = novoEstado.profundidade;
    }
    if ((this.posicaoAtualVisitados + 100) >
      (this.linhas * this.colunas * this.fatorMultiplicacao * this.constanteDeSobra)) {
      this.aumentaTamanhoVetorVisitados();
    }

  }

// -----------------------------FUNCOES AUXILIARES------------------
  private realizaMovimento(movimento: number): boolean {
    if (movimento === 0) {
      if (this.posicaoVazia + this.colunas < (this.linhas * this.colunas)) {
        if (this.realizaTroca(this.posicaoVazia, this.posicaoVazia + this.colunas)) {
          this.posicaoVazia = this.posicaoVazia + this.colunas;
          return true;
        }
      }
      return false;
    } else if (movimento === 1) {
      if (this.posicaoVazia - this.colunas > -1) {
        if (this.realizaTroca(this.posicaoVazia, this.posicaoVazia - this.colunas)) {
          this.posicaoVazia = this.posicaoVazia - this.colunas;
          return true;
        }
      }
      return false;
    } else if (movimento === 2) {
      if ((this.posicaoVazia % this.colunas) + 1 < this.colunas) {
        if (this.realizaTroca(this.posicaoVazia, this.posicaoVazia + 1)) {
          this.posicaoVazia = this.posicaoVazia + 1;
          return true;
        }
      }
      return false;
    } else if (movimento === 3) {
      if ((this.posicaoVazia % this.colunas) > 0) {
        if (this.realizaTroca(this.posicaoVazia, this.posicaoVazia - 1)) {
          this.posicaoVazia = this.posicaoVazia - 1;
          return true;
        }
      }
      return false;
    }
  }

  private geraFilho(movimento: number, idPai: number): void {
    if (movimento === 0) {
      if (this.posicaoVazia + this.colunas < (this.linhas * this.colunas)) {
        this.adicionaFilhoSeNaoGerarLoop(this.posicaoVazia, this.posicaoVazia + this.colunas, idPai);
      }
    } else if (movimento === 1) {
      if (this.posicaoVazia - this.colunas > -1) {
        this.adicionaFilhoSeNaoGerarLoop(this.posicaoVazia, this.posicaoVazia - this.colunas, idPai);
      }
    } else if (movimento === 2) {
      if ((this.posicaoVazia % this.colunas) + 1 < this.colunas) {
        this.adicionaFilhoSeNaoGerarLoop(this.posicaoVazia, this.posicaoVazia + 1, idPai);
      }
    } else if (movimento === 3) {
      if ((this.posicaoVazia % this.colunas) > 0) {
        this.adicionaFilhoSeNaoGerarLoop(this.posicaoVazia, this.posicaoVazia - 1, idPai);
      }
    }
  }

  private adicionaFilhoSeNaoGerarLoop(posicaoVazia: number, novaPosicaoVazia: number, idPai: number): void {
    let naoGera = false;
    let adiciona = true;
    for (let i = 0; i < this.linhas * this.colunas; i++) {
      this.auxVerificaLoop[i] = this.valores[i];
    }
    this.auxVerificaLoop[posicaoVazia] = this.auxVerificaLoop[novaPosicaoVazia];
    this.auxVerificaLoop[novaPosicaoVazia] = -1;
    for (let i = 0; i < this.posicaoAtualVisitados && adiciona; i++) {
      console.warn('visitado e Adicionado');
      if (!this.estadosVisitados[i].ativo) {
        naoGera = false;
        for (let j = 0; j < (this.linhas * this.colunas) && !naoGera; j++) {
          if (this.auxVerificaLoop[j] !== this.estadosVisitados[i].estado[j]) {
            naoGera = true;
          }
        }
        if (!naoGera) {
          adiciona = false;
        }
      }
    }
    if (adiciona) {
      const novoEstado = new Item();
      novoEstado.id = this.posicaoAtualVisitados + 1;
      novoEstado.idPai = idPai;
      novoEstado.ativo = true;
      novoEstado.profundidade = this.profundidadeAtual;
      novoEstado.distManhattan = this.calculaDistanciaManhattan();
      // printf("id: %d , idPai: %d, profundidade: %d , distancia: %d , :
      //  ",novoEstado.id, novoEstado.idPai, novoEstado.profundidade, novoEstado.distManhattan);
      novoEstado.estado = new Array<number>(this.linhas * this.colunas);
      for (let i = 0; i < this.linhas * this.colunas; i++) {
        novoEstado.estado[i] = this.auxVerificaLoop[i];
        // printf("%d ",novoEstado.estado[i]);
      }
      // printf("\n");
      if (this.valorMenorDistancia > novoEstado.distManhattan) {
        this.valorMenorDistancia = novoEstado.distManhattan;
        this.indiceMenorDistManhattan = this.posicaoAtualVisitados;
      }
      this.estadosVisitados[this.posicaoAtualVisitados] = novoEstado;
      this.posicaoAtualVisitados++;
    }
  }

  private calculaDistanciaManhattan(): number {
    const distanciaUnitaria = [];
    let soma = 0;
    for (let i = 0; i < this.linhas * this.colunas; i++) {
      distanciaUnitaria[i] = this.auxVerificaLoop[i] - (i + 1);
      if (distanciaUnitaria[i] < 0) {
        distanciaUnitaria[i] = distanciaUnitaria[i] * -1;
      }
      distanciaUnitaria[i] = distanciaUnitaria[i] - (this.colunas * (distanciaUnitaria[i] / this.colunas))
        + (distanciaUnitaria[i] / this.colunas);
      soma += distanciaUnitaria[i];
    }
    return soma;
  }

  private verificaNaoGeraLoop(posicaoVazia: number, novaPosicaoVazia: number): boolean {
    let naoGera = false;
    for (let i = 0; i < this.linhas * this.colunas; i++) {
      this.auxVerificaLoop[i] = this.valores[i];
    }
    this.auxVerificaLoop[posicaoVazia] = this.auxVerificaLoop[novaPosicaoVazia];
    this.auxVerificaLoop[novaPosicaoVazia] = -1;
    for (let i = 0; i < this.posicaoAtualVisitados; i++) {
      naoGera = false;
      for (let j = 0; j < (this.linhas * this.colunas) && !naoGera; j++) {
        if (this.auxVerificaLoop[j] !== this.estadosVisitados[i].estado[j]) {
          naoGera = true;
        }
      }
      if (!naoGera) {
        return false;
      }
    }
    return true;
  }

  private verificaSolucao(): boolean {
    for (let i = 0; i < (this.linhas * this.colunas) - 1; i++) {
      if (this.valores[i] !== i + 1) {
        return false;
      }
    }
    this.custoSolucao = this.estadosVisitados[this.obterIdSolucao() - 1].profundidade;
    this.passosRestantes = this.custoSolucao;
    return true;
  }

  obterIdSolucao(): number {
    let solucao = true;
    for (let i = this.posicaoAtualVisitados - 1; i >= 0; i--) {
      solucao = true;
      for (let j = 0; j < (this.linhas * this.colunas) - 1 && solucao; j++) {
        if (this.estadosVisitados[i].estado[j] !== (j + 1)) {
          solucao = false;
        }
      }
      if (solucao) {
        return i + 1;
      }
    }
  }

  aumentaTamanhoVetorVisitados(): void {
    this.fatorMultiplicacao++;
    let estadosVisitadosAumentarTamanho = new Array<Item>(this.linhas * this.colunas * this.constanteDeSobra * this.fatorMultiplicacao);
    for (let i = 0; i < this.posicaoAtualVisitados; i++) {
      estadosVisitadosAumentarTamanho[i] = this.estadosVisitados[i];
      for (let j = 0; j < this.linhas * this.colunas; j++) {
        estadosVisitadosAumentarTamanho[i].estado[j] = this.estadosVisitados[i].estado[j];
      }
    }
    this.estadosVisitados = new Array<Item>(this.linhas * this.colunas * this.constanteDeSobra * this.fatorMultiplicacao);
    for (let i = 0; i < this.posicaoAtualVisitados; i++) {
      this.estadosVisitados[i] = estadosVisitadosAumentarTamanho[i];
      for (let j = 0; j < this.linhas * this.colunas; j++) {
        this.estadosVisitados[i].estado[j] = estadosVisitadosAumentarTamanho[i].estado[j];
      }
    }
    estadosVisitadosAumentarTamanho = null;
  }

  private verificaFracasso(): boolean {
    for (let j = 0; j < (this.linhas * this.colunas); j++) {
      if (this.valoresBackup[j] !== this.valores[j]) {
        return false;
      }
    }
    return true;
  }
}
