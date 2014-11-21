var React = require('react');

var HelloMessage = React.createClass({
    getInitialState: function() {
        return {
            seconds: 0
        };
    },
    incrementTimer: function() {
        this.setState({
            seconds: this.state.seconds + 1
        });
    },
    componentDidMount: function() {
        setInterval(this.incrementTimer, 1000);
    },
    render: function() {
        return <div> Hello {this.props.name}. {this.state.seconds} seconds have elapsed. </div>;
    }
})

React.render(
    <HelloMessage name="Sean" />,
    document.getElementById('name'));
