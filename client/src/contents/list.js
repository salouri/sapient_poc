import React, { Component } from 'react';
import Social from '../components/social';
import CardsTable from '../components/cardsTable';
import axios from 'axios';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
    };
    axios
      .get(process.env.SERVER_URL || 'http://localhost:8080/api/cards')
      .then((response) => {
        localStorage.setItem(
          'Cards',
          JSON.stringify(response.data?.data?.cards || [])
        );

        this.state.cards = response.data?.data.cards;
      })
      .catch((error) => console.log(error));
  }

  render() {
    console.log(`cards: ${JSON.stringify(this.state.cards, null, 2)}`);

    return (
      <div className='condiv'>
        <h2 className='subtopic'>{'List all createed cards:'}</h2>
        <CardsTable cards={this.state.cards} />
        <br />
        <br />
        <Social />
      </div>
    );
  }
}
export default List;
