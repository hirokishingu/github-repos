import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo'
import { Query } from 'react-apollo'
import client from './client'
import { SEARCH_REPOSITORIES } from './graphql'

const PER_PAGE = 5
const DEFAULT_STATE = {
  first: PER_PAGE,
  after: null,
  last: null,
  before: null,
  query: "フロントエンドエンジニア"
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = DEFAULT_STATE

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.setState({
      ...DEFAULT_STATE,
      query: event.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  goNext(search) {
    this.setState({
      first: PER_PAGE,
      after: search.pageInfo.endCursor,
      last: null,
      before: null
    })
  }

  render() {
    const { query, first, last, before, after } = this.state
    console.log({ query })
    return (
      <ApolloProvider client={client}>
        <form>
          <input value={query} onChange={this.handleChange} />
        </form>

        <Query
          query={SEARCH_REPOSITORIES}
          variables={{ query, first, last, before, after }}
        >
          {
            ({ loading, error, data }) => {
              if (loading) return 'Loading...'
              if (error) return 'Error ${error.message}'

              console.log({ data })

              const search = data.search
              const repositoryCount = search.repositoryCount
              const repositoryUnit = repositoryCount === 1 || repositoryCount === 0 ? "レポ" : "レポす"
              const title = `レポれぽす - ${repositoryCount} ${repositoryUnit}`
              return (
                <React.Fragment>
                  <h3>{title}</h3>
                  <ul>
                    {
                      search.edges.map(edge => {
                        const node = edge.node;
                        return (
                          <li key={node.id}>
                            <a href={node.url} target="_blank" rel="noopener noreferrer">{node.name}</a>
                          </li>
                        )
                      })
                    }
                  </ul>

                  {
                    search.pageInfo.hasNextPage === true ?
                      <button
                        onClick={this.goNext.bind(this, search)}
                      >
                        次へ
                      </button>
                      :
                      null
                  }
                </React.Fragment>
              )
            }
          }
        </Query>
      </ApolloProvider >
    )
  }
}

export default App;
