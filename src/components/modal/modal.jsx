/* eslint-disable react/jsx-pascal-case */
import { Component } from 'react';
import { Modal__backdrop, Modal__content } from './modal.styled';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

const modalRoot = document.querySelector('#modal-root');

export class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = e => {
    if (e.code === 'Escape') {
      console.log('Нажали Esc');
      this.props.onCloseModal();
    }
  };

  handleBackdropClick = e => {
    if (e.currentTarget === e.target) {
      this.props.onCloseModal();
    }
  };

  render() {
    return createPortal(
      <Modal__backdrop onClick={this.handleBackdropClick}>
        <Modal__content>{this.props.largeURL}</Modal__content>
      </Modal__backdrop>,
      modalRoot
    );
  }
}

Modal.propTypes = {
  largeURL: PropTypes.object.isRequired,
};
