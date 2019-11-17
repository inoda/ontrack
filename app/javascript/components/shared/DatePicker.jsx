import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from "react-datepicker";

class Picker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { startDate: this.props.value };
  }

  handleChange = (val) => {
    this.setState({ startDate: val });
    this.props.onChange(val);
  }

  render() {
    return (
      <DatePicker onChange={this.handleChange} selected={this.state.startDate} className={this.props.className} />
    );
  }
}

Picker.defaultProps = {
  value: new Date(),
  className: '',
}

Picker.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.object,
  className: PropTypes.string,
}

export default Picker;
