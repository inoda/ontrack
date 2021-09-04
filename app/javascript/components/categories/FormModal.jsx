import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../shared/Modal';
import ColorPicker from '../shared/ColorPicker';
import CurrencyInput from '../shared/CurrencyInput';
import FieldErrors from '../shared/FieldErrors';
import { Categories } from '../../api/main';
import { Alerts } from '../../helpers/main';

class FormModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: this.props.category.color,
      errors: {},
      goal: this.props.category.monthly_goal || 0,
      name: this.props.category.name,
      submitted: false,
    };
  }

  componentDidMount() {
    this.nameInput.focus();
  }

  handleNameChange = (e) => { this.setState({ name: e.target.value }); }
  handleGoalChange = (num) => { this.setState({ goal: num }); }
  handleColorChange = (color) => { this.setState({ color }); }
  handleErrors = (key, errs) => { this.setState({ errors: Object.assign(this.state.errors, { [key]: errs }) }); }
  handleDelete = () => {
    Alerts.genericDelete('category').then((result) => {
      if (!result.value) { return; }
      Categories.delete(this.props.category.id).then(
        (resp) => { this.props.onSave(resp); },
        (error) => { error.status == 409 ? Alerts.genericConflict('All expenses must be assigned to a new category first.') : Alerts.genericError(); },
      );
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ submitted: true });
    if (Object.values(this.state.errors).flat().length) { return; }

    let apiCall = null;
    if (this.props.category.id) {
      apiCall = Categories.update(this.props.category.id, { color: this.state.color, monthly_goal: this.state.goal, name: this.state.name.trim() });
    } else {
      apiCall = Categories.create({ color: this.state.color, monthly_goal: this.state.goal, name: this.state.name.trim() });
    }

    apiCall.then(
      (resp) => { this.props.onSave(resp); },
      () => { Alerts.genericError(); },
    );
  }

  action() {
    if (!this.props.category.id) { return 'Create'; }
    return 'Update';
  }

  renderDelete() {
    if (!this.props.category.id) { return ''; }
    return <a className="link-danger" onClick={this.handleDelete}>Delete</a>;
  }

  render() {
    return (
      <Modal onClose={this.props.onClose} title={`${this.action()} Category`}>
        <form onSubmit={this.handleSubmit}>
          <div className="row row-flex">
            <div className="input-group eight columns">
              <label className="required">Name</label>
              <input
                onChange={this.handleNameChange}
                ref={(input) => { this.nameInput = input; }}
                type="text"
                value={this.state.name}
              />
              <FieldErrors
                handleErrors={this.handleErrors}
                label="Name"
                show={this.state.submitted}
                val={this.state.name.trim()}
                validations={{ required: true }}
              />
            </div>

            <div className="input-group ml-auto">
              <label className="required">Color</label>
              <ColorPicker initialColor={this.state.color} omitColors={this.props.colorsToSkip} onChange={this.handleColorChange} />
            </div>
          </div>

          <div className="row">
            <div className="input-group">
              <label>Monthly goal</label>
              <CurrencyInput initialValue={this.state.goal} onChange={this.handleGoalChange} />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-dark" type="submit">Save</button>
            {this.renderDelete()}
          </div>
        </form>
      </Modal>
    );
  }
}

FormModal.defaultProps = {
  category: {
    color: '',
    monthly_goal: 0,
    name: '',
  },
  colorsToSkip: [],
};

FormModal.propTypes = {
  category: PropTypes.object,
  colorsToSkip: PropTypes.array,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default FormModal;
