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
      color: '',
      name: '',
      goal: ''
    };
  }

  handleNameChange = (e) => { this.setState({ name: e.target.value.trim() }); }
  handleGoalChange = (e) => { this.setState({ goal: e.target.value.trim() }); }
  handleColorChange = (color) => { this.setState({ color: color }); }
  handleSubmit = (e) => {
    e.preventDefault();

    Categories.create({ color: this.state.color, name: this.state.name, goal: this.state.goal }).then(
      (resp) => { console.log(resp) },
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
            <ColorPicker onChange={this.handleColorChange} />
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
  category: {}
}

FormModal.propTypes = {
  onClose: PropTypes.func,
}

export default FormModal;
