import React, { Component, Props } from 'react';
import logo from '../img/TMDB.svg';
import '../css/headerSection.css';
// import Generos from "./Generos";
// import Movies from './Movies';
import { Movies, Generos, Pages } from './Api';

interface IProps {

}

interface IState {
  generos: Array<object>;
  movies: Array<object>,
  movieFilters: Array<Number>,
  pages: number,
  listPage: Object
}

interface MovieInfo {
  movies: Array<object>,
  id: number,
  movieFilters: Array<Number>,
  pages: number,
}

class App extends Component<IProps, IState>{

  constructor(props: IProps) {
    super(props);

    this.state = {
      generos: [],
      movies: [],
      movieFilters: [],
      pages: 0,
      listPage: {
        anchorPage: 5,
        currentUserPage: 1
      }
    };
  }

  handleMovies = (movieObj: MovieInfo) => {
    this.setState({ movies: movieObj.movies, pages: movieObj.pages });
  }

  handleFilters = (filter: Array<Number>) => {
    this.setState({ movieFilters: filter });
  }

  handlePageInfo = (pageOBJ: Object) => {
    this.setState({ listPage: pageOBJ });
  }

  render(): React.ReactNode {
    console.log(this.state);
    return (
      <div className="Header">
        <header className="Header-section">
          <nav className="Header-nav">
            <img className="Header-logo" src={logo} alt="" />
          </nav>

          <div className="Header-principal">
            <p className="Header-texto">Milhões de filmes, séries e pessoas para descobrir. Explore já.</p>

            <p className="Hearder-filtroTexto">FILTRE POR:</p>
            {/* Componente listagem de generos */}
            <Generos allFilter={this.state.movieFilters} setFilters={this.handleFilters}></Generos>
          </div>
        </header>

        <main>
          <Movies setMovies={this.handleMovies} movieList={this.state.movies}></Movies>
          <Pages totalPages={this.state.pages} pageObj={this.state.listPage} setPageInfo={this.handlePageInfo} setMovies={this.handleMovies}></Pages>
        </main>
      </div>
    );
  }
}

export default App;
