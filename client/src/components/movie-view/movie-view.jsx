import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import { Link } from "react-router-dom";

import "./movie-view.scss";

export class MovieView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { movie } = this.props;

    if (!movie) return null;

    return (
      <div>
        <Card style={{ width: "45rem" }}>
          <Card.Img variant="top" src={movie.ImagePath} />
          <Card.Body>
            <Card.Title>{movie.Title}</Card.Title>
            <Card.Text>Description: {movie.Description}</Card.Text>
            <Card.Text>Genre: {movie.Genre.Name}</Card.Text>
            <Card.Text>Director: {movie.Director.Name}</Card.Text>
            <Card.Text>Director Bio: {movie.Director.Bio}</Card.Text>
            <Link to={`/`}>
              <Button variant="link">Back</Button>
            </Link>
            <Link to={`/movies/director/${movie.Director.Name}`}>
              <Button variant="link">Director</Button>
            </Link>
            <Link to={`/movies/genres/${movie.Genre.Name}`}>
              <Button variant="link">Genre</Button>
            </Link>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

/*MovieView.propTypes = {
movie: PropTypes.shape({
  Title: PropTypes.string.isRequired,
  Description: PropTypes.string.isRequired,
  ImagePath: PropTypes.string.isRequired,
  Genre: PropTypes.shape({
    Name: PropTypes.string.isRequired,
  }),
  Director: PropTypes.shape({
    Name: PropTypes.string.isRequired,
  }),
}).isRequired,
};*/
