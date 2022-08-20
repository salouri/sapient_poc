import React, { Component } from 'react';

import Social from '../components/social';
import CardForm from '../components/cardForm';

class Create extends Component {
  render() {
    return (
      <div className='condiv'>
        <h2 className='subtopic'>{'Create a new card:'}</h2>
        <CardForm />
        <br /> <br />
        <Social />
      </div>
    );
  }
}

export default Create;
