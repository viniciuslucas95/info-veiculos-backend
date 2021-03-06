import axios from 'axios'
import { Veiculo, VeiculoRepositorio } from "../../dominio/veiculos";
import { Veiculo as DadosDoVeiculo } from './Veiculo'
import { MapeadorDeDados } from "../configuracoes/MapeadorDeDados";

export class VeiculoNoJsonServerRepositorio implements VeiculoRepositorio {
    private readonly url = 'http://localhost:3002/veiculos'

    constructor(private readonly mapeadorDeDados: MapeadorDeDados<DadosDoVeiculo, Veiculo>) { }

    async adicionarOuAtualizar(valor: Veiculo): Promise<void> {
        const dados = new DadosDoVeiculo(valor.id, valor.placa, valor.chassi, valor.renavam, valor.modelo, valor.marca, valor.ano)
        const resultado = await this.pegarUm(valor.id)

        if (resultado) {
            await axios.put(`${this.url}/${valor.id}`, dados)

            return
        }

        await axios.post(this.url, dados)
    }

    async deletar(id: string): Promise<void> {
        await axios.delete(`${this.url}/${id}`)
    }

    async pegarTodos(): Promise<Veiculo[]> {
        const resultado = await axios.get<DadosDoVeiculo[]>(this.url)

        return resultado.data.map(veiculo => this.mapeadorDeDados.mapear(veiculo))
    }

    async pegarUm(id: string): Promise<Veiculo | undefined> {
        try {
            const resultado = await axios.get<DadosDoVeiculo>(`${this.url}/${id}`)

            return this.mapeadorDeDados.mapear(resultado.data)
        } catch (erro) {
            return undefined
        }
    }

    async pegarUmPelaPlaca(placa: string): Promise<Veiculo | undefined> {
        const resultado = await axios.get<DadosDoVeiculo[]>(`${this.url}?placa=${placa}&_limit=1`)
        const dados: DadosDoVeiculo | undefined = resultado.data[0]

        return dados !== undefined ? this.mapeadorDeDados.mapear(resultado.data[0]) : dados
    }

    async pegarUmPeloChassi(chassi: string): Promise<Veiculo | undefined> {
        const resultado = await axios.get<DadosDoVeiculo[]>(`${this.url}?chassi=${chassi}&_limit=1`)
        const dados: DadosDoVeiculo | undefined = resultado.data[0]

        return dados !== undefined ? this.mapeadorDeDados.mapear(resultado.data[0]) : dados
    }

    async pegarUmPeloRenavam(renavam: string): Promise<Veiculo | undefined> {
        const resultado = await axios.get<DadosDoVeiculo[]>(`${this.url}?renavam=${renavam}&_limit=1`)
        const dados: DadosDoVeiculo | undefined = resultado.data[0]

        return dados !== undefined ? this.mapeadorDeDados.mapear(resultado.data[0]) : dados
    }
}