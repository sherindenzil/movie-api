import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";

export class GenreView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { movies, genre } = this.props;

    if (!genre) return null;

    return (
      <div>
        <Container>
          <Card style={{ width: "32rem" }}>
            <Card.Body>
              <Card.Title>{genre.Name}</Card.Title>
              <Card.Text>Description: {genre.Description}</Card.Text>
              <Link to={`/`}>
                <Button variant="link">Back</Button>
              </Link>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }
}

/*GenreView.propTypes = {
  genre: PropTypes.shape({
    Name: PropTypes.string,
    Description: PropTypes.string,
  }).isRequired,
};*/
