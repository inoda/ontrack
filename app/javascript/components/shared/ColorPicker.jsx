import React from 'react';
import PropTypes from 'prop-types';

const QUICK_COLORS = [
  '#899b9c',
  '#88b779',
  '#0d947a',
  '#248ed5',
  '#9053ad',
  '#ffda7d',
  '#f49119',
  '#e64637',
  '#dd5e8e',
  '#ba3427',
  '#b3b3b3',
  '#c5e276',
  '#0ab191',
  '#95dce8',
  '#c67171',
  '#8e5b4c',
  '#e9eeef',
  '#9ad8a9',
  '#c7f4f9',
  '#d9c3ea',
  '#fffacf',
  '#ffcea6',
  '#f9b6b6',
  '#c7b299',
  '#2d4053',
  '#141516',
  '#603813',
];

class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { initialColor: this.props.initialColor, color: this.props.initialColor, useTextField: false };
  }

  componentDidMount() {
    if (!this.state.initialColor.length) {
      this.setState({ color: this.colors()[0] });
      this.props.onChange(this.colors()[0]);
    }
  }

  handleChange = (color) => {
    this.setState({ color });
    this.props.onChange(color);
  }

  useTextField = () => {
    this.setState({ useTextField: true });
  }

  colors() {
    const availColors = [];
    if (this.state.initialColor.length) { availColors.push(this.state.initialColor); }
    for (const color of QUICK_COLORS) {
      if (availColors.map((el) => el.toLowerCase()).includes(color.toLowerCase())) { continue; }
      if (this.props.omitColors.length && this.props.omitColors.map((el) => el.toLowerCase()).includes(color.toLowerCase())) { continue; }
      if (availColors.length >= 15) { break; }

      availColors.push(color);
    }

    return availColors;
  }

  renderSwatches() {
    return this.colors().map((color, idx) => (
      <div
        onClick={() => this.handleChange(color)}
        key={idx}
        className={`sample hover-pointer ${color.toLowerCase() == this.state.color.toLowerCase() ? 'active' : ''}`}
        style={{ backgroundColor: color }}
      />
    ));
  }

  render() {
    return (
      <div className="color-picker">
        {!this.state.useTextField && (
          <>
            {this.renderSwatches()}
            <div className="mr-10 mt-5">
              <button onClick={this.useTextField} type="button" className="btn btn-sm btn-full">Enter hex instead</button>
            </div>
          </>
        )}

        {this.state.useTextField && (
          <input
            type="text"
            placeholder="#fff"
            value={this.state.color}
            onChange={e => this.handleChange(e.target.value)}
          />
        )}
      </div>
    );
  }
}

ColorPicker.defaultProps = {
  omitColors: [],
  initialColor: '',
};

ColorPicker.propTypes = {
  initialColor: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  omitColors: PropTypes.array,
};

export default ColorPicker;
