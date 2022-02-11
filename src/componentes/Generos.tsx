import React, { Component } from "react";
import process from "../process.json"; //importando API KEY
import closeSVG from "../img/close.svg";
import Movies from "./Movies";

interface DataGenero {
    id: number,
    name: string,
}

interface Props {
}

interface state {
    generos: Array<object>;
}

interface Event {
    currentTarget: HTMLDivElement,
    stopPropagation: Function,
}

class Generos extends Component<Props, state> {
    constructor(props: Props) {
        super(props);

        this.state = {
            generos: [],
        };

        this.selecionarFiltro = this.selecionarFiltro.bind(this);
    }

    //Função para requisitar e retornar todos os generos disponiveis na API TMDB
    pegarData() {
        fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.ENV.API_KEY}&language=pt-BR`).then(res => {
            return res.json();
        }).then(data => {
            for (let item of data.genres) {
                let genero = item as DataGenero;
                let novaArray = this.state.generos.concat({ "id": genero.id, "name": genero.name });
                this.setState({ generos: novaArray });
            }
        });
    }

    componentDidMount() {
        this.pegarData();
    }

    selecionarFiltro(event: object) {
        let evento = event as Event;
        evento.stopPropagation();
        let closeButton = evento.currentTarget.getElementsByClassName("closeButton")[0] as HTMLElement;
        if (!evento.currentTarget.classList.contains("selected")) {
            console.log(`[ADICIONAR FILTRO] ${evento.currentTarget.dataset.id}`);
            evento.currentTarget.classList.add("selected");
            closeButton.style.display = "flex";
        } else {
            console.log(`[REMOVER FILTRO] ${evento.currentTarget.dataset.id}`);
            closeButton.style.display = "none";
            evento.currentTarget.classList.remove("selected");
        }
    }

    //Retornando divs para cada genero presento no state;
    todosGeneros() {
        return this.state.generos.map(data => {
            let itemGenero = data as DataGenero;
            return (<div data-id={itemGenero.id} key={itemGenero.id} className="Header-genero" onClick={this.selecionarFiltro}><p className="Header-generoTexto">{itemGenero.name}</p><div className="closeButton"><img src={closeSVG} alt="" /></div></div>);
        });
    }

    render(): React.ReactNode {

        return (
            <div className="Header-todosGeneros">
                {this.todosGeneros()}
            </div>
        )
    }
}

export default Generos;