import React from 'react'
import PropTypes from 'prop-types'

class Modal extends React.Component {
  componentDidMount() {
    document.body.className += ' modal-open';
  }

  componentWillUnmount() {
    const openModals = document.querySelectorAll('.modal').length;
    if (openModals == 1) {
      document.body.className = document.body.className.replace('modal-open', '');
    }
  }

  render() {
    return (
      <div className="modal-mask modal">
        <div className="modal-wrapper">
          <div className="modal-container">
            <div className="modal-header">
              <h3>{this.props.title}</h3>

              <a className="close" onClick={this.props.onClose}>
                <i className="fa fa-times"></i>
              </a>
            </div>

            <div className="modal-body">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Modal.defaultProps = {
  title: '',
}

Modal.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func,
}

export default Modal;
