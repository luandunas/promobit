import React, { Component, SyntheticEvent } from "react";
import process from "../process.json";
import closeSVG from "../img/close.svg";
import "../css/filmes.css";
import { Link } from 'react-router-dom'
import MovieDetails from '../componentes/MoviesDetails'

interface IProps {
    allFilter: Array<any>,
    setFilters: Function
}

interface IState {
    generos: Array<object>,
    pages: number,
}

//Interface para outros objetos

//Interface para requisição de Generos na API TMDB
interface generoRequest {
    id: number,
    name: string
}

class Generos extends Component<IProps, IState>{
    constructor(props: IProps) {
        super(props);

        this.state = {
            generos: [],
            pages: 0,
        };

        this.selecionarFiltro = this.selecionarFiltro.bind(this);
    }

    pegarGeneros() {
        console.log("[TODOS GENEROS] REQUESTING...");
        fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.ENV.API_KEY}&language=pt-BR`).then(res => {
            return res.json();
        }).then(data => {
            let novaArray = [];
            for (let item of data.genres) {
                let itemFilme = item as generoRequest
                novaArray.push({ "id": itemFilme.id, "name": itemFilme.name });
            }
            this.setState({ generos: novaArray });
        });
    }

    //adicionar estilização ao selecionar filtro
    selecionarFiltro(event: object) {
        let evento = event as Event;
        evento.stopPropagation();
        let elementClicked = evento.currentTarget as HTMLElement
        let closeButton = elementClicked.getElementsByClassName("closeButton")[0] as HTMLElement;
        if (!elementClicked.classList.contains("selected")) {
            console.log(`[Component GENERO] ADICIONAR FILTRO ${elementClicked.dataset.id}`);
            elementClicked.classList.add("selected");
            closeButton.style.display = "flex";
            let numberID = Number(elementClicked.dataset.id)
            let newFilter = this.props.allFilter.concat(numberID)
            this.props.setFilters(newFilter)
        } else {
            console.log(`[Component GENERO] REMOVER FILTRO ${elementClicked.dataset.id}`);
            closeButton.style.display = "none";
            elementClicked.classList.remove("selected");
            let newFilter = this.props.allFilter
            let numberID = Number(elementClicked.dataset.id)
            let index = this.props.allFilter.indexOf(numberID);
            if (index > -1) {
                newFilter.splice(index, 1); // 2nd parameter means remove one item only
                this.props.setFilters(newFilter)
            }
        }
    }

    //Retornando divs para cada genero presento no state;
    todosGeneros() {
        return this.state.generos.map(data => {
            let itemGenero = data as generoRequest;
            return (<div data-id={itemGenero.id} key={itemGenero.id} className="Header-genero" onClick={this.selecionarFiltro}><p className="Header-generoTexto">{itemGenero.name}</p><div className="closeButton"><img src={closeSVG} alt="" /></div></div>);
        });
    }

    componentDidMount() {
        this.pegarGeneros();
    }

    render(): React.ReactNode {
        return (
            <div className="Header-todosGeneros">
                {this.todosGeneros()}
            </div>
        )
    }
}


interface IPropsMovies {
    setMovies: Function;
    movieList: Array<object>
}

interface Movie {
    id: number,
}

interface MovieData {
    poster_path: string,
    id: number,
    title: string,
    release_date: string
}

class Movies extends Component<IPropsMovies, IState>{
    constructor(props: IPropsMovies) {
        super(props);

        this.state = {
            generos: [],
            pages: 0,
        };
    }

    pegarFilmes(page: number) {
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.ENV.API_KEY}&language=pt-BR&page=${page}`).then(res => {
            return res.json();
        }).then(data => {
            this.props.setMovies({ movies: data.results, pages: data.total_pages });
            // console.log(data);
        });
    }

    todosFilmes() {
        console.log("[FILMES] Listando...");
        return this.props.movieList.map(data => {
            let itemFilme = data as MovieData;
            return (
                    <Link to={`movie/${itemFilme.id}`} className="Link" key={itemFilme.id}>
                        <div key={itemFilme.id} className="filmeDiv">
                            <img src={`https://image.tmdb.org/t/p/w200/${itemFilme.poster_path}`} alt="" />
                            <div className="textos">
                                <p>{itemFilme.title}</p>
                                <p className="data">{itemFilme.release_date}</p>
                            </div>
                        </div>
                    </Link>
            );
        });
    }

    componentDidMount() {
        this.pegarFilmes(1);
        window.addEventListener("beforeunload", (e) => {
            sessionStorage.clear();
        });
    }

    render(): React.ReactNode {
        return (
            <div id="container">
                <div className="allMovies">{this.todosFilmes()}</div>
            </div>
        )
    }
}

interface IPropsPage {
    totalPages: number,
    pageObj: Object,
    setPageInfo: Function,
    setMovies: Function
}

interface pageProps {
    anchorPage: number,
    currentUserPage: number
}

class Pages extends Component<IPropsPage, IState>{
    constructor(props: IPropsPage) {
        super(props);

        this.state = {
            generos: [],
            pages: 0,
        };
        this.listarPaginas = this.listarPaginas.bind(this);
    }

    componentDidMount(){
        
    }

    novaPagina(anchorPageHandle: number, event: SyntheticEvent) {
        document.getElementsByClassName("selectedPage")[0].classList.remove("selectedPage");
        event.currentTarget.classList.add("selectedPage");

        let currentPage = Number(event.currentTarget.getAttribute("data-page"));

        if (anchorPageHandle == currentPage) {
            console.log("listando novas paginas");
            anchorPageHandle = anchorPageHandle + 4;
            this.props.setPageInfo({ anchorPage: anchorPageHandle, currentUserPage: currentPage });
            this.listarPaginas();
        }

        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.ENV.API_KEY}&language=pt-BR&page=${event.currentTarget.getAttribute("data-page")}`).then(res => {
            return res.json();
        }).then(data => {
            this.props.setMovies({ movies: data.results, pages: data.total_pages });
            // console.log(data);
        });
    }

    listarPaginas() {
        let pagesTotal = this.props.pageObj as pageProps;
        let anchorPageHandle = pagesTotal.anchorPage;
        var elements = []
        // if (pagesTotal.anchorPage == pagesTotal.currentUserPage) {
        for (let i = pagesTotal.currentUserPage - 1; i < pagesTotal.anchorPage;) {
            if (i == pagesTotal.currentUserPage - 1 && pagesTotal.currentUserPage - 1 != 0) {
                elements.push(<p className="page previousPage" key={"previousPage"}>&lt;</p>)
            }
            if (i < this.props.totalPages || this.props.totalPages == 0) {
                i++
                // console.log(i)
                elements.push(<p key={i} data-page={i} className={i == 1 ? "page selectedPage" : "page"} onClick={(e) => { this.novaPagina(anchorPageHandle, e) }}>{i}</p>);
            } else {
                break;
            }
        }
        elements.push(<p className="page nextPage" key={"nexPage"}>&gt;</p>, <p className="page lastPage" key={"lastPage"}>Última Página</p>);
        // anchorPageHandle = pagesTotal.anchorPage + 4;
        // }
        console.log(elements)
        return elements
    }

    render(): React.ReactNode {
        return (
            <div className="pages">
                {this.listarPaginas()}
            </div>
        )
    }
}

export { Generos, Movies, Pages, MovieDetails }