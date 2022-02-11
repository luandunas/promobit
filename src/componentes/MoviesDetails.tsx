import React, { Component } from "react"

class MovieDetails extends Component {

    componentDidMount(){
        console.log(window.location.pathname.replace("/movie/", ""));
    }

    render(): React.ReactNode {
        return (
            <div><p>teste</p></div>
        )
    }
}

export default MovieDetails