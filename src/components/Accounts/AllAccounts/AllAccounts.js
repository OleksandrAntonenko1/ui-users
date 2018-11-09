import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Button,
  MultiColumnList,
  UncontrolledDropdown,
  DropdownMenu,
  Popover,
  MenuItem,
} from '@folio/stripes/components';

import { formatDate, formatDateTime } from '../../../util';

class AllAccounts extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      intl: PropTypes.object.isRequired,
    }),
    resources: PropTypes.shape({
      comments: PropTypes.object,
    }),
    user: PropTypes.object,
    mutator: PropTypes.shape({
      activeRecord: PropTypes.object,
    }),
    onChangeSelected: PropTypes.func.isRequired,
    visibleColumns: PropTypes.arrayOf(PropTypes.string),
    loans: PropTypes.arrayOf(PropTypes.object),
    onClickViewAccountActionsHistory: PropTypes.func.isRequired,
    onClickViewLoanActionsHistory: PropTypes.func.isRequired,
    accounts: PropTypes.arrayOf(PropTypes.object),
    onChangeActions: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.onSort = this.onSort.bind(this);
    this.toggleAll = this.toggleAll.bind(this);
    this.handleOptionsChange = this.handleOptionsChange.bind(this);
    this.comments = this.comments.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.getLoan = this.getLoan.bind(this);

    const { stripes } = props;

    this.sortMap = {
      [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.created' })]: f => (f.metadata || {}).createdDate,
      [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.updated' })]: f => (f.metadata || {}).updatedDate,
      [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.type' })]: f => f.feeFineType,
      [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.amount' })]: f => f.amount,
      [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.remaining' })]: f => f.remaining,
      [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.status' })]: f => (f.paymentStatus || {}).name,
      [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.owner' })]: f => f.feeFineOwner,
      [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.title' })]: f => f.title,
      [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.barcode' })]: f => f.barcode,
      [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.number' })]: f => f.callNumber,
      [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.due' })]: f => f.dueDate,
      [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.returned' })]: f => f.returnedDate,

    };

    this.state = {
      checkedAccounts: {},
      allChecked: false,
      sortOrder: [
        stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.created' }),
        stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.updated' }),
        stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.type' }),
        stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.amount' }),
        stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.remaining' }),
        stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.status' }),
        stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.owner' }),
        stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.title' }),
        stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.barcode' }),
        stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.number' }),
        stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.due' }),
        stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.returned' }),
      ],
      sortDirection: ['desc', 'desc'],
    };
  }

  componentDidMount() {
    const user = this.props.user || {};
    this.props.mutator.activeRecord.update({ userId: user.id });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const props = this.props;
    const comments = _.get(props.resources, ['comments', 'records'], []);
    const nextComments = _.get(nextProps.resources, ['comments', 'records'], []);
    const visibleColumns = this.props.visibleColumns;
    const nextVisibleColumns = nextProps.visibleColumns;
    return visibleColumns !== nextVisibleColumns || comments !== nextComments ||
      props.accounts !== nextProps.accounts ||
      this.state !== nextState;
  }

  onRowClick(e, row) {
    if ((e.target.type !== 'button') && (e.target.tagName !== 'IMG')) {
      this.props.onClickViewAccountActionsHistory(e, row);
    }
  }

  onSort(e, meta) {
    if (!this.sortMap[meta.alias]) return;

    let { sortOrder, sortDirection } = this.state;

    if (sortOrder[0] !== meta.alias) {
      sortOrder = [meta.alias, sortOrder[1]];
      sortDirection = ['asc', sortDirection[1]];
    } else {
      const direction = (sortDirection[0] === 'desc') ? 'asc' : 'desc';
      sortDirection = [direction, sortDirection[1]];
    }

    this.setState({ sortOrder, sortDirection });
  }

  comments(f) {
    const t = f.feeFineType ? f.feeFineType : '';
    const comments = _.get(this.props.resources, ['comments', 'records'], []);
    const actions = _.orderBy(comments.filter(c => c.accountId === f.id), ['dateAction'], ['asc']);
    const myComments = actions.filter(a => a.comments !== undefined).map(a => a.comments);
    const n = myComments.length;
    return (
      <div>
        <Row>
          <Col>{t}</Col>
          {(n > 0) ?
            <Col style={{ marginLeft: '5px' }}>
              <Popover>
                <div data-role="target">
                  <img src="https://png.icons8.com/color/18/000000/note.png" alt="" />
                </div>
                <p data-role="popover">
                  <b>
                    {this.props.stripes.intl.formatMessage({ id: 'ui-users.accounts.history.comment' })}
                    {' '}
                    {n}
                    {' '}
                    {this.props.stripes.intl.formatMessage({ id: 'ui-users.accounts.history.of' })}
                    {' '}
                    {n}
                    :
                  </b>
                  {' '}
                  {myComments[n - 1]}
                  {' '}
                  <a href="/users/123" className="active">Go to details</a>
                </p>
              </Popover>
            </Col>
            : ' '}
        </Row>
      </div>
    );
  }

  getLoan(f) {
    const loan = this.props.loans.find(l => l.id === f.loanId) || {};
    return loan;
  }

  getAccountsFormatter() {
    const checkedAccounts = this.state.checkedAccounts;
    const { stripes } = this.props;

    return {
      '  ': f => (
        <input
          checked={!!(checkedAccounts[f.id])}
          onClick={e => this.toggleItem(e, f)}
          type="checkbox"
        />
      ),
      [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.created' })]: f => (f.metadata ? formatDate(f.metadata.createdDate) : '-'),
      [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.updated' })]: f => (f.metadata && f.metadata.createdDate !== f.metadata.updatedDate ? formatDate(f.metadata.updatedDate) : '-'),
      [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.type' })]: f => (f.feeFineType ? this.comments(f) : '-'),
      [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.amount' })]: f => (f.amount ? parseFloat(f.amount).toFixed(2) : '-'),
      [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.remaining' })]: f => parseFloat(f.remaining).toFixed(2) || '0.00',
      [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.status' })]: f => (f.paymentStatus || {}).name || '-',
      [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.owner' })]: f => (f.feeFineOwner ? f.feeFineOwner : '-'),
      [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.title' })]: f => (f.title ? `${f.title} (${f.materialType})` : '-'),
      [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.barcode' })]: f => (f.barcode ? f.barcode : '-'),
      [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.number' })]: f => (f.callNumber ? f.callNumber : '-'),
      [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.due' })]: f => (f.dueDate ? formatDateTime(f.dueDate) : '-'),
      [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.returned' })]: f => (f.returnedDate ? formatDateTime(f.returnedDate) : formatDateTime(this.getLoan(f).returnDate) || '-'),
      ' ': f => this.renderActions(f),
    };
  }

  toggleItem(e, account) {
    e.stopPropagation();
    const id = account.id;
    const accounts = this.state.checkedAccounts;
    const checkedAccounts = (accounts[id])
      ? _.omit(accounts, id)
      : { ...accounts, [id]: account };
    const allChecked = _.size(checkedAccounts) === this.props.accounts.length;
    this.setState({ checkedAccounts, allChecked });

    const values = Object.values(checkedAccounts) || [];
    let selected = 0;
    values.forEach((v) => {
      selected += v.remaining;
    });

    this.props.onChangeSelected(parseFloat(selected).toFixed(2), values);
    const closed = values.filter(v => (v.status || {}).name === 'Closed');
    const open = values.filter(v => (v.status || {}).name === 'Open');

    if (closed.length > 0 && open.length === 0) {
      this.props.onChangeActions({
        waive: false,
        transfer: false,
        refund: true,
        regularpayment: false,
      });
    } else if (values.length !== 0) {
      this.props.onChangeActions({
        waive: true,
        transfer: true,
        refund: true,
        regularpayment: true,
      });
    } else {
      this.props.onChangeActions({
        waive: false,
        transfer: false,
        refund: false,
        regularpayment: false,
      });
    }
  }

  toggleAll(e) {
    const accounts = this.props.accounts;
    const checkedAccounts = (e.target.checked)
      ? accounts.reduce((memo, a) => (Object.assign(memo, { [a.id]: a })), {})
      : {};

    const values = Object.values(checkedAccounts) || [];
    let selected = 0;
    values.forEach((v) => {
      selected += v.remaining;
    });

    this.props.onChangeSelected(parseFloat(selected).toFixed(2), values);

    if (values.length !== 0) {
      this.props.onChangeActions({
        waive: true,
        transfer: true,
        refund: true,
        regularpayment: true,
      });
    } else {
      this.props.onChangeActions({
        waive: false,
        transfer: false,
        refund: false,
        regularpayment: false,
      });
    }

    this.setState(({ allChecked }) => ({
      allChecked: !allChecked,
      checkedAccounts
    }));
  }

  handleOptionsChange(itemMeta, e) {
    e.preventDefault();
    e.stopPropagation();

    const { a, action } = itemMeta;

    if (action && this[action]) {
      this[action](a);
    }
  }

  loanDetails(a, e) {
    this.props.onClickViewLoanActionsHistory(e, { id: a.loanId });
  }

  pay(a, e) {
    if (e) e.preventDefault();
    this.props.onChangeActions({
      pay: true,
    }, [a]);
  }

  cancel(a, e) {
    if (e) e.preventDefault();
    this.props.onChangeActions({
      cancellation: true,
    }, [a]);
  }

  waive(a, e) {
    if (e) e.preventDefault();
    this.props.onChangeActions({
      waiveModal: true,
    }, [a]);
  }

  renderActions(a) {
    const disabled = (a.status.name === 'Closed');
    const elipsis = {
      pay: disabled,
      waive: disabled,
      transfer: disabled,
      error: disabled,
      loan: (a.loanId === '0' || !a.loanId),
    };
    return (
      <UncontrolledDropdown
        onSelectItem={this.handleOptionsChange}
      >
        <Button data-role="toggle" buttonStyle="hover dropdownActive"><strong>•••</strong></Button>
        <DropdownMenu data-role="menu" overrideStyle={{ padding: '6px 0' }}>
          <MenuItem itemMeta={{ a, action: 'pay' }}>
            <Button disabled={elipsis.pay} buttonStyle="dropdownItem">{this.props.stripes.intl.formatMessage({ id: 'ui-users.accounts.history.button.pay' })}</Button>
          </MenuItem>
          <MenuItem itemMeta={{ a, action: 'waive' }}>
            <Button disabled={elipsis.waive} buttonStyle="dropdownItem">{this.props.stripes.intl.formatMessage({ id: 'ui-users.accounts.history.button.waive' })}</Button>
          </MenuItem>
          <MenuItem>
            <Button disabled buttonStyle="dropdownItem">{this.props.stripes.intl.formatMessage({ id: 'ui-users.accounts.history.button.refund' })}</Button>
          </MenuItem>
          <MenuItem>
            <Button disabled buttonStyle="dropdownItem">{this.props.stripes.intl.formatMessage({ id: 'ui-users.accounts.history.button.transfer' })}</Button>
          </MenuItem>
          <MenuItem itemMeta={{ a, action: 'cancel' }}>
            <Button disabled={elipsis.error} buttonStyle="dropdownItem">{this.props.stripes.intl.formatMessage({ id: 'ui-users.accounts.button.error' })}</Button>
          </MenuItem>
          <hr />
          <MenuItem itemMeta={{ a, action: 'loanDetails' }}>
            <Button disabled={elipsis.loan} buttonStyle="dropdownItem">{this.props.stripes.intl.formatMessage({ id: 'ui-users.accounts.history.button.loanDetails' })}</Button>
          </MenuItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }

  render() {
    const { sortOrder, sortDirection, allChecked } = this.state;
    const props = this.props;
    const { stripes } = props;

    const fees = _.orderBy(props.accounts, [this.sortMap[sortOrder[0]], this.sortMap[sortOrder[1]]], sortDirection);
    const columnMapping = {
      '  ': (<input type="checkbox" checked={allChecked} name="check-all" onChange={this.toggleAll} />),
    };

    return (
      <div>
        <MultiColumnList
          id="list-accountshistory"
          formatter={this.getAccountsFormatter()}
          columnMapping={columnMapping}
          columnWidths={{
            '  ': 28,
            [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.created' })] : 110,
            [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.type' })]: 200,
            [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.updated' })]: 110,
            [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.barcode' })]: 120,
            [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.due' })]: 110,
            [stripes.intl.formatMessage({ id: 'ui-users.accounts.history.columns.returned' })]: 110
          }}
          visibleColumns={this.props.visibleColumns}
          fullWidth
          contentData={fees}
          onHeaderClick={this.onSort}
          onRowClick={this.onRowClick}
          sortOrder={sortOrder[0]}
          sortDirection={`${sortDirection[0]}ending`}
        />
      </div>
    );
  }
}

export default AllAccounts;
