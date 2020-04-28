// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import compose from 'lodash/fp/compose';
import { Grid, Header, Icon, Message, Segment, Table } from 'semantic-ui-react';

import PromptStageCallback from './Callback';
import ExplorerLink from '../../../../shared/containers/Global/Blockchain/ExplorerLink';

class PromptStageSuccess extends Component<Props> {
  render() {
    const {
      blockchain,
      callbacking,
      hasBroadcast,
      hasForegroundCallback,
      prompt,
      settings,
    } = this.props;
    const {
      response,
      signed,
    } = prompt;
    const tx = response || signed;
    // Remove any UUID from callback URL
    const callbackURL = (prompt && prompt.callbackURL)
      ? prompt.callbackURL.replace(/[0-9a-f]{8}-?[0-9a-f]{4}-?[1-5][0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}/ig, '')
      : '';
    // Retrieve block number and transaction ID
    let block_num;
    let transaction_id;
    if (prompt.callbackPayload) {
      block_num = prompt.callbackPayload.bn;
      transaction_id = prompt.callbackPayload.tx;
    } else if (tx && tx.processed) {
      block_num = tx.processed.block_num;
      transaction_id = tx.transaction_id;
    }
    return (
      <Grid>
        {(hasForegroundCallback)
          ? (
            <Grid.Column width={hasBroadcast ? 7 : 16}>
              <PromptStageCallback
                blockchain={blockchain}
                callbacking={callbacking}
                prompt={prompt}
                settings={settings}
                singleColumn
              />
            </Grid.Column>
          )
          : false
        }
        {(hasBroadcast || !hasForegroundCallback)
          ? (
            <Grid.Column width={hasForegroundCallback ? 9 : 16}>
              <Header
                size="huge"
              >
                <Icon color="green" name="check circle outline" />
                <Header.Content>
                  Transaction Submitted
                  <Header.Subheader>
                    The transaction was successfuly sent to the
                    {(response && response.processed)
                      ? ' blockchain.'
                      : ' callback service.'
                    }
                  </Header.Subheader>
                </Header.Content>
              </Header>
              <Table
                definition
                style={{
                  display: 'block',
                  overflowX: 'scroll',
                }}
              >
                <Table.Body>
                  {(transaction_id)
                    ? (
                      <Table.Row>
                        <Table.Cell collapsing>Transaction ID</Table.Cell>
                        <Table.Cell>
                          <ExplorerLink
                            content={transaction_id}
                            linkData={transaction_id}
                            linkBlockId={(block_num) ? block_num : false}
                            linkType="txid"
                          />
                        </Table.Cell>
                      </Table.Row>
                    )
                    : false
                  }
                  <Table.Row>
                    <Table.Cell collapsing>Submitted via</Table.Cell>
                    <Table.Cell>
                      {(response && response.processed)
                        ? prompt.endpoint
                        : callbackURL
                      }
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
              <Message
                color="grey"
                content={(
                  <React.Fragment>
                    <p>
                      The Transaction ID listed above can be used to monitor this transaction. The service it was submitted to is responsible for ensuring the transaction makes it into the greater blockchain network.
                    </p>
                  </React.Fragment>
                )}
                header="Monitor your Transaction"
                icon="info circle"
                size="large"
              />
            </Grid.Column>
          )
          : false
        }
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    prompt: state.prompt,
  };
}

export default compose(
  withTranslation('global'),
  connect(mapStateToProps)
)(PromptStageSuccess);
