import { ChangeEvent, Component } from "react";
import axios from "axios";
import { debounce } from "lodash";

interface State {
  pi: string | null;
  start: string;
  end: string;
}

export default class App extends Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      pi: null,
      start: "0",
      end: "10",
    };
  }

  componentDidMount() {
    this.reload();
  }

  reload = debounce(() => {
    const inputStart = parseInt(this.state.start);
    const inputEnd = parseInt(this.state.end);

    const start = inputStart + 1;
    const digits = inputEnd - start;

    axios(
      `https://api.pi.delivery/v1/pi?start=${start}&numberOfDigits=${digits}`
    ).then(({ data: { content } }) => this.setState({ pi: content }));
  }, 500);

  onChangeStart = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ start: e.target.value }, this.reload);
  };

  onChangeEnd = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ end: e.target.value }, this.reload);
  };

  render() {
    return (
      <>
        {this.state.pi === null ? (
          <h2>Aucune valeur disponible</h2>
        ) : (
          <p>
            {this.state.start === "0" ? "3," : "..."}
            {this.state.pi}...
          </p>
        )}

        <label htmlFor="start">Commencer à : </label>
        <input
          type="number"
          id="start"
          min={0}
          value={this.state.start}
          onChange={this.onChangeStart}
        />

        <br />

        <label htmlFor="end">Finir à : </label>
        <input
          type="number"
          id="end"
          min={this.state.start}
          value={this.state.end}
          onChange={this.onChangeEnd}
        />
      </>
    );
  }
}
