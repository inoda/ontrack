import React from 'react'
import PropTypes from 'prop-types'
import Modal from '../shared/Modal'
import ColorPicker from '../shared/ColorPicker'
import { Categories } from '../../api/main'

class FormModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colorPickerOpen: false,
      color: this.props.category.color,
      name: this.props.category.name,
      goal: this.props.category.annual_goal,
    };
  }

  handleNameChange = (e) => { this.setState({ name: e.target.value }); }
  handleGoalChange = (e) => { this.setState({ goal: e.target.value.trim() }); }
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
          <div className="input-group">
            <label>Name</label>
            <input type="text" value={this.state.name} onChange={this.handleNameChange}></input>
          </div>

          <div className="input-group">
            <label>Color</label>
            <ColorPicker onChange={this.handleColorChange} initialColor={this.state.color} />
          </div>

          <div className="input-group">
            <label>Annual Goal</label>
            <input type="text" value={this.state.goal} onChange={this.handleGoalChange}></input>
          </div>

          <div className="form-actions">
            <button type="button" className="btn" onClick={this.props.onClose}>Cancel</button>
            <button type="submit" className="btn btn-dark">Save</button>
          </div>
        </form>
      </Modal>
    );
  }
}

FormModal.defaultProps = {
  category: {
    color: '#fffff',
    name: '',
    annual_goal: '',
  }
}

FormModal.propTypes = {
  onClose: PropTypes.func,
  onSave: PropTypes.func,
}

export default FormModal;
