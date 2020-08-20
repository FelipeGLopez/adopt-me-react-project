import React from "react";
import pet from "@frontendmasters/pet";
import { navigate } from "@reach/router";
import Modal from "./Modal.js";
import Carousel from "./Carousel";
import ErrorBoundary from "./ErrorBoudary";
import ThemeContext from "./ThemeContext";

class Details extends React.Component {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     // Este state es self-contained, es decir, lo maneja esta clase y ninguna otra.
  //     loading: true
  //   };
  // }
  state = { loading: true, showModal: false }; // puedo usar este state luego de instalar babel con parcel.
  componentDidMount() {
    pet
      .animal(this.props.id) //obtiene el id (variable) del path. Las props son read-only y vienen del parent
      .then(({ animal }) => {
        this.setState({
          url: animal.url,
          name: animal.name,
          animal: animal.type,
          location: `${animal.contact.address.city}, ${animal.contact.address.state}`,
          description: animal.description,
          media: animal.photos,
          breed: animal.breeds.primary,
          loading: false
        });
      }, console.error);
  }
  toggleModal = () => this.setState({ showModal: !this.state.showModal });
  adopt = () => navigate(this.state.url);
  render() {
    if (this.state.loading) {
      return <h1>loading ...</h1>;
    }

    const {
      animal,
      breed,
      location,
      description,
      name,
      media,
      showModal
    } = this.state;

    return (
      <div className="details">
        <Carousel media={media} />
        <div onClick={console.log}>
          <h1>{name}</h1>
          <h2>{`${animal} - ${breed} - ${location}`}</h2>
          <ThemeContext.Consumer>
            {([theme]) => (
              // Hace como pattern matching en el argumento de la funcion para tomar solo el primer elemento
              // La otra forma es hace (themeHook) => backgrounColor: themeHook[0]
              <button
                onClick={this.toggleModal}
                style={{ backgroundColor: theme }}
              >
                Adopt {name}
              </button>
            )}
          </ThemeContext.Consumer>
          <p>{description}</p>
          {showModal ? (
            <Modal>
              <div>
                <h1>Would you like to adopt {name}?</h1>
                <div className="buttons">
                  <button onClick={this.adopt}>Yes</button>
                  <button onClick={this.toggleModal}>No, I am a monster</button>
                </div>
              </div>
            </Modal>
          ) : null}
        </div>
      </div>
    );
  }
}

export default function DetailsWithErrorBoundary(props) {
  return (
    <ErrorBoundary>
      <Details {...props} />
    </ErrorBoundary>
  );
}
