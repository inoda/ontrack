import React from 'react'
import PropTypes from 'prop-types'
import { GithubPicker } from 'react-color'

class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { colorPickerOpen: false, color: this.props.initialColor };
  }

  togglePicker = () => { this.setState({ colorPickerOpen: !this.state.colorPickerOpen }); }
  handleChange = (color) => {
    this.setState({ colorPickerOpen: false, color: color.hex });
    this.props.onChange(color.hex);
  }

  renderSwatches() {
    if (!this.state.colorPickerOpen) { return '' }
    return <GithubPicker onChange={this.handleChange} />
  }

  render() {
    return (
      <div className="color-picker">
        <div className="sample hover-pointer" style={{ backgroundColor: this.state.color }} onClick={this.togglePicker}></div>
        {this.renderSwatches()}
      </div>
    );
  }
}

ColorPicker.defaultProps = {
  initialColor: '#fff',
}

ColorPicker.propTypes = {
  initialColor: PropTypes.string,
  onChange: PropTypes.func,
}

export default ColorPicker;
