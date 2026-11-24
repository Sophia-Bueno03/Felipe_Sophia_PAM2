import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { consultarPokemon } from './rsc/funcoe';
import styles from './rsc/estilo';

export default function App() {
  const [busca, setBusca] = useState('');
  const [pokemon, setPokemon] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  async function pesquisar() {
    if (carregando) return;

    Keyboard.dismiss();
    setMensagem('');
    setPokemon(null);
    setCarregando(true);

    try {
      const dados = await consultarPokemon(busca);
      setPokemon(dados);
    } catch (erro) {
      setMensagem(erro.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Pokédex</Text>
        <Text style={styles.subtitulo}>
          Pesquise um Pokémon pelo nome ou número.
        </Text>
      </View>

      <ScrollView
        style={styles.conteudo}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>Nome ou número</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: pikachu ou 25"
          value={busca}
          onChangeText={setBusca}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={pesquisar}
        />

        <TouchableOpacity
          style={[styles.botao, carregando && styles.botaoDesabilitado]}
          onPress={pesquisar}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.textoBotao}>Pesquisar Pokémon</Text>
          )}
        </TouchableOpacity>

        {mensagem !== '' && <Text style={styles.mensagem}>{mensagem}</Text>}

        {pokemon && (
          <View style={styles.card}>
            <Image source={{ uri: pokemon.imagem }} style={styles.imagem} />
            <Text style={styles.numero}>#{pokemon.id}</Text>
            <Text style={styles.nome}>{pokemon.nome}</Text>

            <View style={styles.tipos}>
              {pokemon.tipos.map((tipo) => (
                <Text key={tipo} style={styles.tipo}>
                  {tipo}
                </Text>
              ))}
            </View>

            <Text style={styles.textoCard}>Altura: {pokemon.altura} m</Text>
            <Text style={styles.textoCard}>Peso: {pokemon.peso} kg</Text>
            <Text style={styles.textoCard}>
              Habilidades: {pokemon.habilidades.join(', ')}
            </Text>

            <Text style={styles.secao}>Atributos base</Text>
            {pokemon.stats.map((stat) => (
              <View key={stat.nome} style={styles.linhaStat}>
                <Text style={styles.nomeStat}>{stat.nome}</Text>
                <View style={styles.barraFundo}>
                  <View
                    style={[
                      styles.barra,
                      { width: `${Math.min(stat.valor / 2, 100)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.valorStat}>{stat.valor}</Text>
              </View>
            ))}
          </View>
        )}

        {!pokemon && !carregando && mensagem === '' && (
          <Text style={styles.vazio}>Informe um Pokémon para pesquisar.</Text>
        )}
      </ScrollView>
    </View>
  );
}