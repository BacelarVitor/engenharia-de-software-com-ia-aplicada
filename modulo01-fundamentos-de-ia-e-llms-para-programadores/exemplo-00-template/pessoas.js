// Cores do arco-íris, na ordem usual.
export const CORES = ['vermelho', 'laranja', 'amarelo', 'verde', 'azul', 'anil', 'violeta']

// Capitais e cidades principais do Brasil.
export const CIDADES = [
    'São Paulo',
    'Rio de Janeiro',
    'Brasília',
    'Salvador',
    'Fortaleza',
    'Belo Horizonte',
    'Manaus',
    'Curitiba',
    'Recife',
    'Porto Alegre',
    'Belém',
    'Goiânia',
    'Florianópolis',
]

// Ordem das colunas da resposta: premium, medium, basic.
export const CATEGORIAS = ['premium', 'medium', 'basic']

const NOMES = [
    'Ana', 'Bruno', 'Carla', 'Diego', 'Elena', 'Felipe', 'Gabriela', 'Henrique',
    'Isabela', 'João', 'Karen', 'Lucas', 'Marina', 'Nicolas', 'Olívia', 'Pedro',
    'Rafaela', 'Sofia', 'Tiago', 'Úrsula', 'Vanessa', 'Wagner', 'Yasmin', 'Caio',
]

// 120 fica no intervalo pedido (100 a 150). Mude este número para gerar outro tamanho.
export const QUANTIDADE_PESSOAS = 120
export const IDADE_MIN = 18
export const IDADE_MAX = 70

// A categoria sai da soma de três parcelas. A posição na lista só define o peso
// de cada opção: cor e cidade empurram a soma, então a mesma idade pode cair
// em categorias diferentes.
// Idade entra como está (18 a 70).
// Cor entra pelo índice no arco-íris (0 a 6), vezes 4.
// Cidade entra pelo índice na lista (0 a 12), vezes 3.
// Até 68 é basic, de 69 a 83 é medium, de 84 em diante é premium.
function pontuacao(pessoa) {
    const pontosIdade = pessoa.idade
    const pontosCor = CORES.indexOf(pessoa.cor) * 4
    const pontosCidade = CIDADES.indexOf(pessoa.localizacao) * 3
    return pontosIdade + pontosCor + pontosCidade
}

function categoriaDaPessoa(pessoa) {
    const pontos = pontuacao(pessoa)
    if (pontos <= 68) return 'basic'
    if (pontos <= 83) return 'medium'
    return 'premium'
}

// Mesma semente gera sempre as mesmas 120 pessoas.
function criarAleatorio(semente) {
    let estado = semente >>> 0
    return () => {
        estado = (Math.imul(estado, 1664525) + 1013904223) >>> 0
        return estado / 4294967296
    }
}

function escolher(aleatorio, opcoes) {
    const indice = Math.floor(aleatorio() * opcoes.length)
    return opcoes[indice]
}

export function gerarPessoas(quantidade) {
    const aleatorio = criarAleatorio(42)
    const pessoas = []

    for (let i = 0; i < quantidade; i++) {
        const pessoa = {
            idade: IDADE_MIN + Math.floor(aleatorio() * (IDADE_MAX - IDADE_MIN + 1)),
            nome: escolher(aleatorio, NOMES),
            cor: escolher(aleatorio, CORES),
            localizacao: escolher(aleatorio, CIDADES),
        }
        pessoa.categoria = categoriaDaPessoa(pessoa)
        pessoas.push(pessoa)
    }

    return pessoas
}

// Idade 18 vira 0 e idade 70 vira 1. Cor e cidade viram one-hot na ordem das listas.
// O nome não entra no vetor: a rede só recebe números.
export function vetorDaPessoa(pessoa) {
    const idadeNormalizada = (pessoa.idade - IDADE_MIN) / (IDADE_MAX - IDADE_MIN)
    const cores = CORES.map(cor => pessoa.cor === cor ? 1 : 0)
    const cidades = CIDADES.map(cidade => pessoa.localizacao === cidade ? 1 : 0)
    return [idadeNormalizada, ...cores, ...cidades]
}

export function vetorDaCategoria(categoria) {
    return CATEGORIAS.map(nome => nome === categoria ? 1 : 0)
}
