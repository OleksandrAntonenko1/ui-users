import React from 'react';
import PropTypes from 'prop-types';

import {
  injectIntl,
  intlShape,
  FormattedMessage,
} from 'react-intl';

import {
  Row,
  Col,
  Modal,
  Button,
} from '@folio/stripes/components';

import css from './ResetPasswordModal.css';

class ResetPasswordModal extends React.Component {
  constructor(props) {
    super(props);

    this.copyInput = React.createRef();
  }

  buildTextContent = () => {
    const {
      email,
      name,
    } = this.props;

    return (
      <React.Fragment>
        <FormattedMessage id="ui-users.extended.resetPasswordModal.linkWasSent" />
        <p className={css.email}>
          {email}
        </p>
        <FormattedMessage
          id="ui-users.extended.resetPasswordModal.linkInstructions"
          values={{ name }}
        />
      </React.Fragment>
    );
  }

  handleClick = () => {
    this.copyInput.current.select();
    document.execCommand('copy');
  }

  buildCopyLinkControl = () => {
    const {
      intl,
    } = this.props;

    return (
      <Row className={css.copyControl}>
        <Col xs={9}>
          <input
            className={css.textField}
            ref={this.copyInput}
            type="text"
            value="This text will be copied to the clipboard"
            readOnly
          />
        </Col>
        <Col xs={3}>
          <Button
            buttonStyle="primary"
            onClick={this.handleClick}
          >
            <strong>
              {intl.formatMessage({ id: 'ui-users.extended.resetPasswordModal.copyLink' })}
            </strong>
          </Button>
        </Col>
      </Row>
    );
  }

  render() {
    const {
      isOpen,
      onClose,
      intl,
    } = this.props;

    return (
      <Modal
        dismissible
        size="small"
        open={isOpen}
        label={intl.formatMessage({ id: 'ui-users.extended.resetPasswordModal.label' })}
        onClose={onClose}
      >
        {this.buildTextContent()}
        {this.buildCopyLinkControl()}
      </Modal>
    );
  }
}

ResetPasswordModal.propTypes = {
  intl: intlShape.isRequired,
  isOpen: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default injectIntl(ResetPasswordModal);
