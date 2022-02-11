import React, { Component } from "react";
import process from "../process.json";

interface Props {
}

interface Istate {
    movies: Array<object>,
    movieLastID: number
}

interface Movie {
    id: number,
}


class Movies extends Component<Props, Istate>{

    constructor(props: Props) {
        super(props);

        this.state = {
            movies: [],
            movieLastID: 0
        };
    }

    pegarFilmes(page: number, lastID?: number) {
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.ENV.API_KEY}&language=pt-BR&page=${page}`).then(res => {
            return res.json();
        }).then(data => {
            if (lastID) {
                console.log("[LOGICA1]");
                let lastMovieIndex = data.results.findIndex((x: Movie) => x.id === lastID);
                data.results.splice(0, lastMovieIndex + 1);
            }
            data.results.forEach((movie: Movie) => {
                if (!(this.state.movies.length < 24)) return;
                let arrayAllMovies = this.state.movies.concat(movie);
                this.setState({ movies: arrayAllMovies, movieLastID: movie.id});
            });
            if (this.state.movies.length < 24) {
                this.pegarFilmes(page += 1);
            }
            console.log(data, this.state.movieLastID, this.state.movies);
        });
    }

    componentDidMount() {
        this.pegarFilmes(2, 566525);
    }

    render(): React.ReactNode {
        return (
        <div>{this.state.movies.length}</div>
        )
    }
}

export default Movies;