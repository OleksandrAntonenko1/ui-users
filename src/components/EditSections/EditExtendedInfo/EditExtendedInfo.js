import React from 'react';
import PropTypes from 'prop-types';

import { Field } from 'redux-form';
import {
  injectIntl,
  intlShape,
} from 'react-intl';

import {
  TextField,
  Row,
  Col,
  Accordion,
  KeyValue,
  Datepicker,
  Headline
} from '@folio/stripes/components';

import PasswordControl from './PasswordControl';
import ResetPasswordControl from './ResetPasswordControl';

const EditExtendedInfo = (props) => {
  const {
    expanded,
    onToggle,
    accordionId,
    userId,
    userFirstName,
    userEmail,
    intl,
  } = props;

  const AccordionHeader = (
    <Headline
      size="large"
      tag="h3"
    >
      {intl.formatMessage({ id: 'ui-users.extended.extendedInformation' })}
    </Headline>
  );

  return (
    <Accordion
      open={expanded}
      id={accordionId}
      onToggle={onToggle}
      label={AccordionHeader}
    >
      <Row>
        <Col
          xs={12}
          md={3}
        >
          <Field
            component={Datepicker}
            label={intl.formatMessage({ id: 'ui-users.extended.dateEnrolled' })}
            dateFormat="YYYY-MM-DD"
            name="enrollmentDate"
            id="adduser_enrollmentdate"
          />
        </Col>
        <Col
          xs={12}
          md={3}
        >
          <Field
            label={intl.formatMessage({ id: 'ui-users.extended.externalSystemId' })}
            name="externalSystemId"
            id="adduser_externalsystemid"
            component={TextField}
            fullWidth
          />
        </Col>
        <Col
          xs={12}
          md={3}
        >
          <Field
            component={Datepicker}
            label={intl.formatMessage({ id: 'ui-users.extended.birthDate' })}
            dateFormat="YYYY-MM-DD"
            name="personal.dateOfBirth"
            id="adduser_dateofbirth"
            timeZone="UTC"
            backendDateStandard="YYYY-MM-DD"
          />
        </Col>
        <Col
          xs={12}
          md={3}
        >
          <KeyValue label={intl.formatMessage({ id: 'ui-users.extended.folioNumber' })}>
            {userId || '-'}
          </KeyValue>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          md={3}
        >
          <Field
            label={`${intl.formatMessage({ id: 'ui-users.information.username' })}`}
            name="username"
            id="adduser_username"
            component={TextField}
            fullWidth
            validStylesEnabled
          />
        </Col>
        {
          userId
            ? (
              <ResetPasswordControl
                email={userEmail}
                name={userFirstName}
              />
            )
            : <PasswordControl />
        }
      </Row>
      <br />
    </Accordion>
  );
};

EditExtendedInfo.propTypes = {
  expanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  accordionId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  userFirstName: PropTypes.string.isRequired,
  userEmail: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(EditExtendedInfo);
