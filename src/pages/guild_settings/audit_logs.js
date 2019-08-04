import React, {Component} from "react";
import connect from "react-redux/es/connect/connect";
import Long from "long";

import {Container, Header, Placeholder, Feed, Pagination, Grid} from 'semantic-ui-react';

import {fetchGuildLogs} from "../../actions/guild";
import './audit_logs.css';

const EPOCH = 1420070400000;
const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric', hour: "numeric", minute: "numeric" };

function pad(v, n, c = '0') {
  return String(v).length >= n ? String(v) : (String(c).repeat(n) + v).slice(-n);
}

class AuditLogs extends Component {
  componentDidMount() {
    const guild = this.props.guilds[this.props.guildID];
    if (!guild.auditLog) {
      this.props.fetchGuildLogs(this.props.guildID, 0);
    }
  }

  renderPlaceholders() {
    return Array.from(Array(5).keys()).map(i => (
      <Placeholder key={i}>
        <Placeholder.Header image>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Header>
      </Placeholder>
    ));
  }

  parseSnowflake(snowflake) {
    const BINARY = pad(Long.fromString(snowflake).toString(2), 64);
    const timestamp = parseInt(BINARY.substring(0, 42), 2) + EPOCH;
    return new Date(timestamp);
  }

  renderAuditLog() {
    const logs = this.props.guilds[this.props.guildID].auditLog;
    return (
      <Feed>
        {logs.messages.map(({channel, author, id, content}) => (
          <Feed.Event key={id}>
            <Feed.Label image={author.avatar} />
            <Feed.Content>
              <Feed.Date>{author.name} at {this.parseSnowflake(id).toLocaleDateString(undefined, dateOptions)}</Feed.Date>
              <Feed.Summary>{channel}</Feed.Summary>
              <Feed.Extra text>{content}</Feed.Extra>
            </Feed.Content>
          </Feed.Event>
        ))}
      </Feed>
    );
  }

  renderNavigationButtons() {
    const guild = this.props.guilds[this.props.guildID];
    return (
      <Grid centered>
        <Grid.Row>
          <Pagination
            activePage={guild.auditLog.page + 1}
            boundaryRange={1}
            onPageChange={(event) => {
              const pageNo = parseInt(event.target.innerText);
              this.props.fetchGuildLogs(this.props.guildID, pageNo-1);
            }}
            size='mini'
            siblingRange={2}
            totalPages={Math.ceil(guild.auditLog.no_results / 20)}
            firstItem={null}
            lastItem={null}
            prevItem={null}
            nextItem={null}
          />
        </Grid.Row>
      </Grid>
    );
  }

  render() {
    const guild = this.props.guilds[this.props.guildID];
    return (
      <Container>
        <Header as="h3">
          Audit logs for {guild.name}
        </Header>
        {!guild.auditLog && this.renderPlaceholders()}
        {guild.auditLog && this.renderAuditLog()}
        {guild.auditLog && this.renderNavigationButtons()}
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    guilds: state.user.guilds
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchGuildLogs: (guildID, page) => dispatch(fetchGuildLogs(guildID, page))
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuditLogs);