import React, { Component } from 'react';
import { Button, Form, Card, Row, Col, Container } from 'react-bootstrap';
import axios from 'axios';

export default class CardForm extends Component {
  constructor(props) {
    super(props);
    this.eventCurrentField = this.eventCurrentField.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.state = {
      card: {
        name: '',
        cardNo: '',
        limit: '',
      },
    };
  }
  // Event handlers
  eventCurrentField(field, event) {
    const cardTemp = { ...this.state.card };
    cardTemp[field] = event.target.value;
    this.setState({ card: cardTemp });
  }

  onFormSubmit(event) {
    event.preventDefault();
    const newCard = this.state.card;
    // trim the whitespace from the form fields
    Object.keys(newCard).forEach(
      (k) =>
        (newCard[k] = typeof newCard[k] == 'string' ? newCard[k].trim() : newCard[k])
    );
    localStorage.setItem('card_form', JSON.stringify(newCard));
    const serverUrl = process.env.SERVER_URL || 'http://localhost:8080/api/cards';
    const data = { ...newCard };
    data.limit = parseInt(data.limit, 10);
    axios
      .post(serverUrl, data)
      .then((response) => {
        this.setState({ cards: [response.data, ...this.state.cards] });
        this.setState({ name: '' });
        this.setState({ cardNo: '' });
        this.setState({ limit: '' });
      })
      .catch((error) => console.log(error));

    let cards = JSON.parse(localStorage.getItem('Cards')) || [];

    newCard.id = cards.length + 1;
    cards.push(newCard);
    localStorage.setItem('Cards', JSON.stringify(cards));

    this.divSuccess.insertAdjacentHTML(
      'beforeend',
      '<p class="submitSuccess">Card createed successfully!</p>'
    );
    setTimeout(() => {
      this.divSuccess.querySelector(':last-child').remove();
    }, 3000);
  }

  render() {
    return (
      <Card style={{ width: '45%', display: 'inline-block' }}>
        <Card.Body>
          <Container>
            <Form onSubmit={this.onFormSubmit.bind(this)} id='create-card-form'>
              <Row>
                <Col>
                  <Form.Group className='mb-3' controlId='formFname'>
                    <Form.Label>
                      <strong>Card Name</strong>
                    </Form.Label>
                    <Form.Control
                      type='text'
                      required={true}
                      value={this.state.card.name}
                      onChange={this.eventCurrentField.bind(this, 'name')}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className='mb-3' controlId='formCardNo'>
                    <Form.Label>
                      <strong>Card Number</strong>
                    </Form.Label>
                    <Form.Control
                      type='text'
                      required={true}
                      value={this.state.card.cardNo}
                      onChange={this.eventCurrentField.bind(this, 'cardNo')}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className='mb-3' controlId='formlimit'>
                    <Form.Label>
                      <strong>Card Limit</strong>
                    </Form.Label>
                    <Form.Control
                      type='number'
                      step='.01'
                      min='0'
                      value={this.state.card.limit}
                      onChange={this.eventCurrentField.bind(this, 'limit')}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button
                type='submit'
                className='btn btn-primary btn-block submitButton'
              >
                Submit
              </Button>
            </Form>
          </Container>
          <br />
          <div
            ref={(divElem) => {
              this.divSuccess = divElem;
            }}
          ></div>
        </Card.Body>
      </Card>
    );
  }
}
