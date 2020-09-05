import React from 'react'
import PropTypes from 'prop-types'
import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

class CurrencyInput extends React.Component {
  handleChange = (e) => {
    if (!this.props.onChange) { return; }
    const num = e.target.value.replace(/\$|,/g, '');
    const cents = parseInt(parseFloat(num).toFixed(2).replace(/\./g, ""))
    const normalized = isNaN(cents) ? 0 : cents;
    this.props.onChange(normalized);
  }

  handleBlur = (e) => {
    if (!this.props.onBlur) { return; }
    const num = e.target.value.replace(/\$|,/g, '');
    const cents = parseInt(parseFloat(num).toFixed(2).replace(/\./g, ""))
    const normalized = isNaN(cents) ? 0 : cents;
    this.props.onBlur(normalized);
  }

  render() {
    const defaultMaskOptions = {
      prefix: '$',
      includeThousandsSeparator: true,
      thousandsSeparatorSymbol: ',',
      allowDecimal: true,
      decimalSymbol: '.',
      decimalLimit: 2,
      integerLimit: 7,
      allowLeadingZeroes: false,
      allowNegative: this.props.allowNegative,
    }
    const currencyMask = createNumberMask(defaultMaskOptions);

    return (
      <MaskedInput
        placeholder="$0.00"
        inputMode="decimal"
        mask={currencyMask}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        defaultValue={this.props.initialValue ? (this.props.initialValue / 100).toFixed(2) : ''}
        className={this.props.className}
      />
    )
  }
}

CurrencyInput.defaultProps = {
  initialValue: 0,
  allowNegative: false,
  className: '',
}

CurrencyInput.propTypes = {
  initialValue: PropTypes.number,
  allowNegative: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
}

export default CurrencyInput;
