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
    let allColors = ['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB', '#EB9694', '#FAD0C3', '#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B'].slice(0, 10);
    if (this.state.initialColor.length) { allColors.unshift(this.state.initialColor); }

    let availColors = []
    for (let color of allColors) {
      if (availColors.length == this.props.colorsToShow) { break; }
      if (availColors.map((el) => { return el.toLowerCase(); }).includes(color.toLowerCase())) { continue; }
      if (this.props.omitColors.length) {
        if (this.props.omitColors.map((el) => { return el.toLowerCase(); }).includes(color.toLowerCase())) { continue;}
      }
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
  colorsToShow: 10,
}

ColorPicker.propTypes = {
  initialColor: PropTypes.string,
  onChange: PropTypes.func,
  colors: PropTypes.array,
  omitColors: PropTypes.array,
  colorsToShow: PropTypes.number,
}

export default ColorPicker;
