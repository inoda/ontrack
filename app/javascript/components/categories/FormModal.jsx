import React from 'react'
import PropTypes from 'prop-types'
import Modal from '../shared/Modal'
import ColorPicker from '../shared/ColorPicker'
import CurrencyInput from '../shared/CurrencyInput'
import FieldErrors from '../shared/FieldErrors'
import { Categories } from '../../api/main'
import { Alerts } from '../../helpers/main'

class FormModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colorPickerOpen: false,
      color: this.props.category.color,
      name: this.props.category.name,
      goal: this.props.category.monthly_goal || 0,
      errors: {},
      submitted: false,
    };
  }

  componentDidMount() {
    this.nameInput.focus();
  }

  handleNameChange = (e) => { this.setState({ name: e.target.value }); }
  handleGoalChange = (num) => { this.setState({ goal: num }) }
  handleColorChange = (color) => { this.setState({ color: color }); }
  handleErrors = (key, errs) => { this.setState({ errors: Object.assign(this.state.errors, { [key]: errs }) }); }
  handleDelete = () => {
    Alerts.genericDelete('category').then((result) => {
      if (!result.value) { return; }
      Categories.delete(this.props.category.id).then(
        (resp) => { this.props.onSave(resp) },
        (error) => { error.status == 409 ? Alerts.genericConflict("All expenses must be assigned to a new category first.") : Alerts.genericError() },
      )
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ submitted: true });
    if (Object.values(this.state.errors).flat().length) { return; }

    let apiCall = null;
    if (this.props.category.id) {
      apiCall = Categories.update(this.props.category.id, { color: this.state.color, name: this.state.name.trim(), monthly_goal: this.state.goal })
    } else {
      apiCall = Categories.create({ color: this.state.color, name: this.state.name.trim(), monthly_goal: this.state.goal })
    }

    apiCall.then(
      (resp) => { this.props.onSave(resp) },
      (error) => { Alerts.genericError(); },
    )
  }

  action() {
    if (!this.props.category.id) { return 'Create'; }
    return 'Update';
  }

  renderDelete() {
    if (!this.props.category.id) { return ''; }
    return <a onClick={this.handleDelete} className="link-danger">Delete</a>;
  }

  render() {
    return (
      <Modal title={`${this.action()} Category`} onClose={this.props.onClose}>
        <form onSubmit={this.handleSubmit}>
          <div className="row row-flex">
            <div className="input-group eight columns">
              <label className="required">Name</label>
              <input type="text" value={this.state.name} onChange={this.handleNameChange} ref={(input) => { this.nameInput = input; }} />
              <FieldErrors label="Name" val={this.state.name.trim()} validations={{ required: true }} show={this.state.submitted} handleErrors={this.handleErrors} />
            </div>

            <div className="input-group ml-auto">
              <label className="required">Color</label>
              <ColorPicker onChange={this.handleColorChange} initialColor={this.state.color} omitColors={this.props.colorsToSkip} colorsToShow={5} />
            </div>

            <div className="clearfix"></div>
          </div>

          <div className="row">
            <div className="input-group">
              <label>Monthly Goal</label>
              <CurrencyInput initialValue={this.state.goal} onChange={this.handleGoalChange} />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-dark">Save</button>
            {this.renderDelete()}
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
    monthly_goal: 0,
  }
}

FormModal.propTypes = {
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  category: PropTypes.object,
  colorsToSkip: PropTypes.array
}

export default FormModal;
