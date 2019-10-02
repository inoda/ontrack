import React from 'react'
import PropTypes from 'prop-types'

class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { initialColor: this.props.initialColor, color: this.props.initialColor };
  }

  componentDidMount() {
    if (!this.state.initialColor.length) {
      this.setState({ color: this.colors()[0] })
      this.props.onChange(this.colors()[0]);
    }
  }

  handleClick = (color) => {
    this.setState({ color: color });
    this.props.onChange(color);
  }

  colors() {
    if (this.props.colors.length) { return this.props.colors; }
    let allColors = ['#899b9c', '#88b779', '#0d947a', '#248ed5', '#9053ad', '#ffda7d', '#f49119', '#e64637', '#dd5e8e', '#ba3427', '#b3b3b3', '#c5e276', '#0ab191', '#95dce8', '#c67171', '#8e5b4c', '#e9eeef', '#9ad8a9', '#c7f4f9', '#d9c3ea', '#fffacf', '#ffcea6', '#f9b6b6', '#c7b299', '#2d4053', '#141516', '#603813'];

    let availColors = []
    if (this.state.initialColor.length) { availColors.push(this.state.initialColor); }
    for (let color of allColors) {
      if (availColors.length == this.props.colorsToShow) { break; }
      if (availColors.map((el) => { return el.toLowerCase() }).includes(color.toLowerCase())) { continue; }
      if (this.props.omitColors.length && this.props.omitColors.map((el) => { return el.toLowerCase() }).includes(color.toLowerCase())) { continue;}
      availColors.push(color);
    }

    return availColors;
  }

  renderSwatches() {
    return this.colors().map((color, idx) => {
      return <div onClick={() => this.handleClick(color)} key={idx} className={`sample hover-pointer ${color.toLowerCase() == this.state.color.toLowerCase() ? 'active' : ''}`} style={{ backgroundColor: color }}></div>
    })
  }

  render() {
    return (
      <div className="color-picker">
        {this.renderSwatches()}
      </div>
    );
  }
}

ColorPicker.defaultProps = {
  colors: [],
  omitColors: [],
  initialColor: '',
  colorsToShow: 8,
}

ColorPicker.propTypes = {
  initialColor: PropTypes.string,
  onChange: PropTypes.func,
  colors: PropTypes.array,
  omitColors: PropTypes.array,
  colorsToShow: PropTypes.number,
}

export default ColorPicker;
