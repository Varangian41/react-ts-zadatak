import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';

interface AppProps {}
interface AppState {
  results: string[];
  bandAlbums: string[];
}

const initialResults = ['A', 'B', 'C', 'D', 'E'];

class App extends Component<AppProps, AppState> {
  interval;

  constructor(props) {
    super(props);
    this.state = {
      results: [...initialResults],
      bandAlbums: [],
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState((prevState) => {
        let title = prevState.results.shift();

        let bandAlbums = prevState.bandAlbums;
        if (bandAlbums.length) {
          title = bandAlbums.shift();
          bandAlbums = [...bandAlbums, title];
        }

        const results = [...prevState.results, title];
        return {
          results,
          bandAlbums,
        };
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  readonly queryChanged = (event) => {
    const query = event.target.value;

    if (!query) {
      this.setState({ bandAlbums: [...initialResults] });
    } else {
      fetch(`https://itunes.apple.com/search?term=${query}&entity=album`)
        .then((res) => res.json())
        .then((res) => {
          const albumNames = (res.results as any[])
            ?.sort((a, b) =>
              (a.collectionName as string).localeCompare(b.collectionName)
            )
            .slice(0, 5)
            .map((album) => album.collectionName);
          this.setState({ bandAlbums: albumNames });
        })
        .catch((err) => {
          console.error(err);
          this.setState({ bandAlbums: [] });
        });
    }
  };

  render() {
    return (
        <div className="results-form">
          <input
            className="search-input border"
            placeholder="Search Band"
            type="text"
            onChange={this.queryChanged}
          />

          <div className="results border">
            {this.state.results.map((result) => (
              <div className="result border">{result}</div>
            ))}
          </div>
        </div>
    );
  }
}

render(<App />, document.getElementById('root'));
