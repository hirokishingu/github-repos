import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo'
import client from './client'

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div>hi, GraphQL</div>
      </ApolloProvider>
    )
  }
}

export default App;
