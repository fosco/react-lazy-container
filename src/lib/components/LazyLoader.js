import React from 'react';
import PropTypes from 'prop-types';

const SCROLL_OFFSET = 100;

class LazyLoader extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      page: 0,
      loading: false,
    };

    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    this.props.fetchMore();
  }

  componentWillReceiveProps(nextProps) {
    // If optional parameters/filters change, reset page number
    if (JSON.stringify(this.props.optionalParams) !== JSON.stringify(nextProps.optionalParams)) {
      this.setState({
        page: 0,
      });
    }

    if (nextProps.children.length !== this.props.children.length || !nextProps.hasMore) {
      this.setState({
        loading: false,
      });
    }
  }

  handleScroll() {
    const scrollingNode = this.scrollingNode;
    if (scrollingNode.offsetHeight + scrollingNode.scrollTop >= scrollingNode.scrollHeight - SCROLL_OFFSET && this.props.hasMore) {
      const page = this.state.page;
      this.props.fetchMore({ page });
      scrollingNode.scrollTop = scrollingNode.scrollHeight;
      this.setState({
        page: page + 1,
        loading: true,
      });
    }
  }

  render() {
    const ref = (el) => { this.scrollingNode = el; };

    if (this.props.error) {
      return (
        <div>{this.props.errorMessage}</div>
      );
    }
    return (
      <div
        onScroll={this.handleScroll}
        ref={ref}
      >
        {this.props.children}

        {this.state.loading &&
          this.props.loader
        }
      </div>
    );
  }
}

LazyLoader.propTypes = {
  fetchMore: PropTypes.func.isRequired,
  children: PropTypes.array.isRequired,
  loader: PropTypes.object,
  hasMore: PropTypes.bool,
  error: PropTypes.bool,
  optionalParams: PropTypes.object,
  errorMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
};

LazyLoader.defaultProps = {
  loader: <div>Loading...</div>,
  hasMore: true,
  error: false,
  errorMessage: 'Error fetching data',
  optionalParams: {},
};

export default LazyLoader;
