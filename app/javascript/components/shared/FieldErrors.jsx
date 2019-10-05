import React from 'react'
import PropTypes from 'prop-types'

class FieldErrors extends React.Component {
  constructor(props) {
    super(props);
    this.state = { errors: [] };
  }

  componentDidMount() {
    this.buildErrorMessages();
  }

  componentDidUpdate(prevProps) {
    if (this.props.show != prevProps.show) { this.buildErrorMessages(); }
    if (this.props.val != prevProps.val) { this.buildErrorMessages(); }
    if (JSON.stringify(this.props.validations) != JSON.stringify(prevProps.validations)) { this.buildErrorMessages(); }
  }

  valRequired() {
    const val = this.props.val;
    if (typeof val == "number") {
      if (val == undefined || val == null || isNaN(parseInt(val.toString()))) { return false; }
    } else {
      if (!val) { return false; }
    }

    return true;
  }

  valGreaterThan() {
    const val = this.props.val;
    if (parseFloat(val.toString()) <= this.props.validations.greaterThan) { return false; }
    return true;
  }

  buildErrorMessages() {
    const val = this.props.val;
    let errs = [];

    if (this.props.validations.required && !this.valRequired()) { errs.push(`${this.props.label} is required`); }
    if (this.props.validations.greaterThan != undefined && !this.valGreaterThan()) { errs.push(`${this.props.label} must be greater than ${this.props.validations.greaterThan}`); }

    this.setState({ errors: errs });
    if (this.props.handleErrors) { this.props.handleErrors(this.props.label, errs) }
  }

  renderError(e, idx) {
    return <li key={idx}>{e}</li>
  }

  render() {
    if (!this.props.show || !this.state.errors.length) { return ''; }

    return (
      <ul className="errors">
        {this.state.errors.map((e, idx) => { return this.renderError(e, idx) })}
      </ul>
    );
  }
}

FieldErrors.defaultProps = {
  val: null,
  validations: {},
  show: false,
  handleErrors: null,
}

FieldErrors.propTypes = {
  val: PropTypes.any,
  validations: PropTypes.object,
  show: PropTypes.bool,
  handleErrors: PropTypes.func,
  label: PropTypes.string,
}

export default FieldErrors;
