const React = require('react')
const ReactDOM = require('react-dom')

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    console.log('submitted: ' + this.state.value)
    getAudio(this.state.value)
    event.preventDefault();
  }

  render() {
    return (
      <div id="main">
        <form onSubmit={ this.handleSubmit }>
          <div className="ui input">
            <input type="text" value={this.state.value} onChange={this.handleChange} />
            <button className="ui primary button">
              Save
            </button>
          </div>
        </form>
      </div>
    )
  }
}

ReactDOM.render(
  <div className="app">
    <App />
  </div>,
  document.getElementById('main')
)

let clipCount = 0

const getAudio = (value) => {
  const el = document.getElementById('audio')
  const clip = document.getElementById('clip' + clipCount)
  clip ? el.removeChild(clip) : console.log('none')
  clipCount += 1
  const audio = document.createElement('audio')
  audio.setAttribute('id', 'clip' + clipCount)
  fetch('/api/synthesize/' + value)
    .then(res => res.blob())
    .then(clip => {
      const url = window.URL.createObjectURL(clip)
      el.appendChild(audio)
      audio.src = `test${clipCount}.ogg`
      audio.autoplay = true
    })
}
