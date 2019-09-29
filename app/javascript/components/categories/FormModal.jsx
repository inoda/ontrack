import React from 'react'
import PropTypes from 'prop-types'
import Modal from '../shared/Modal'
import ColorPicker from '../shared/ColorPicker'

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

  action() {
    if (!this.props.category.id) { return 'Create'; }
    return 'Update';
  }

  render() {
    return (
      <Modal title={`${this.action()} Category`} onClose={this.props.onClose}>
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
