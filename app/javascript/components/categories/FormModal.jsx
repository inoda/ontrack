import React from 'react'
import PropTypes from 'prop-types'
import Modal from '../shared/Modal'
import ColorPicker from '../shared/ColorPicker'
import CurrencyInput from '../shared/CurrencyInput'
import { Categories } from '../../api/main'

class FormModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colorPickerOpen: false,
      color: this.props.category.color,
      name: this.props.category.name,
      goal: this.props.category.annual_goal || 0,
    };
  }

  handleNameChange = (e) => { this.setState({ name: e.target.value }); }
  handleGoalChange = (num) => { this.setState({ goal: num }) }
  handleColorChange = (color) => { this.setState({ color: color }); }
  handleSubmit = (e) => {
    e.preventDefault();

    let apiCall = null;
    if (this.props.category.id) {
      apiCall = Categories.update(this.props.category.id, { color: this.state.color, name: this.state.name.trim(), goal: this.state.goal })
    } else {
      apiCall = Categories.create({ color: this.state.color, name: this.state.name.trim(), goal: this.state.goal })
    }

    apiCall.then(
      (resp) => { this.props.onSave(resp) },
      (error) => { console.log(error); },
    )
  }

  action() {
    if (!this.props.category.id) { return 'Create'; }
    return 'Update';
  }

  render() {
    return (
      <Modal title={`${this.action()} Category`} onClose={this.props.onClose}>
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="input-group nine columns">
              <label className="required">Name</label>
              <input type="text" value={this.state.name} onChange={this.handleNameChange}></input>
            </div>

            <div className="input-group three columns">
              <label className="required">Color</label>
              <ColorPicker onChange={this.handleColorChange} initialColor={this.state.color} omitColors={this.props.colorsToSkip} />
            </div>
          </div>

          <div className="row">
            <div className="input-group">
              <label>Annual Goal</label>
              <CurrencyInput initialValue={this.state.goal} onChange={this.handleGoalChange} />
            </div>
          </div>

          <div className="form-actions">
            <a onClick={this.props.onClose}>Cancel</a>
            <button type="submit" className="btn btn-dark">Save</button>
          </div>
        </form>
      </Modal>
    );
  }
}

FormModal.defaultProps = {
  colorsToSkip: [],
  category: {
    color: '',
    name: '',
    annual_goal: 0,
  }
}

FormModal.propTypes = {
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  category: PropTypes.object,
  colorsToSkip: PropTypes.array
}

export default FormModal;
