import React, { Component } from 'react';
import { Card, Container, Table } from 'react-bootstrap';

class CardsTable extends Component {
  state = {
    cards: [],
  };

  renderTableData() {
    console.log(`this.props.cards: ${JSON.stringify(this.props.cards, null,2) }`);
    if (this.props.cards.length === 0)
      return (
        <tr>
          <td align='center' colSpan='6'>
            No cards available
          </td>
        </tr>
      );
    console.log(`state.cards: ${JSON.stringify(this.props.cards, null, 2)}`);
    let cards = this.props.cards;
    const result = cards.map((card) => {
      const { id, name, cardNo, limit } = card; //destructuring
      return (
        <tr key={id}>
          <td>{name}</td>
          <td>{cardNo}</td>
          <td>{limit}</td>
        </tr>
      );
    });
    return result;
  }

  render() {
    return (
      <Container>
        <Card className='cardsTableContainer'>
          <Card.Body>
            <Table
              responsive='sm'
              stripped='true'
              bordered
              hover
              size='sm'
              className='cardsTable'
            >
              <thead>
                <tr>
                  <th>{'Card Name'}</th>
                  <th>{'Card Number'}</th>
                  <th>{'Card Limit'}</th>
                </tr>
                {this.renderTableData()}
              </thead>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}

export default CardsTable;
