const cache = new Map();
let ultimaConsulta = 0;
const INTERVALO_MINIMO = 1000;

export async function consultarPokemon(termo) {
  const busca = termo.trim().toLowerCase();

  if (!busca) {
    throw new Error('Digite o nome ou o número do Pokémon.');
  }

  // Verifica se já existe resultado armazenado
  if (cache.has(busca)) {
    return cache.get(busca);
  }

  // Evita solicitações muito próximas
  const agora = Date.now();
  if (agora - ultimaConsulta < INTERVALO_MINIMO) {
    throw new Error('Aguarde um instante antes de realizar outra consulta.');
  }
  ultimaConsulta = agora;

  const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(busca)}`;

  let resposta;
  try {
    resposta = await fetch(url);
  } catch (erro) {
    throw new Error('Sem conexão. Verifique sua internet.');
  }

  if (resposta.status === 404) {
    throw new Error('Pokémon não encontrado.');
  }
  if (!resposta.ok) {
    throw new Error('Não foi possível acessar a API.');
  }

  const dados = await resposta.json();

  const pokemon = {
    id: dados.id,
    nome: dados.name,
    imagem:
      dados.sprites?.other?.['official-artwork']?.front_default ||
      dados.sprites?.front_default,
    altura: dados.height / 10, // decímetros -> metros
    peso: dados.weight / 10, // hectogramas -> kg
    tipos: dados.types.map((t) => t.type.name),
    habilidades: dados.abilities.map((a) => a.ability.name),
    stats: dados.stats.map((s) => ({
      nome: s.stat.name,
      valor: s.base_stat,
    })),
  };

  cache.set(busca, pokemon);
  return pokemon;
}