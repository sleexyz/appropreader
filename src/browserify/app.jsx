var React = require('react');
var assert = require('assert');
var Textarea = require('react-textarea-autosize');


var str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nLorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.\n\nDonec nec justo eget felis facilisis fermentum. Aliquam porttitor mauris sit amet orci. Aenean dignissim pellentesque felis.\n\nMorbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.\n\nPraesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.\n\nPhasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.\n\nPellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.\n\nSed adipiscing ornare risus. Morbi est est, blandit sit amet, sagittis vel, euismod vel, velit. Pellentesque egestas sem. Suspendisse commodo ullamcorper magna.";

var Doc = React.createClass({
    getInitialState: function() {
        return {
            value: str,
            editing: true
        };
    },
    handleChange: function(event) {
        console.log(event.target.value);
        this.setState({value: event.target.value});
    },
    noneditableClick: function(event) {
        assert(this.state.editing == false);
        console.log("Clicked!");
        this.setState({editing: true});
    },
    editableClick: function(event) {
        assert(this.state.editing == true);
        console.log("Double Clicked!");
        this.setState({editing: false});
    },
    render: function() {
        var stuff = this.state.editing
                        ?
                        <Textarea
                        value={this.state.value}
                        className="editable"
                        onChange={this.handleChange}
                        onDoubleClick={this.editableClick}/>
                        :
                        <p 
                        className="noneditable"
                        onDoubleClick={this.noneditableClick}>
                        {this.state.value}
                        </p>

        return <div>
            

            {stuff}
        </div>
    }
})

React.render(
        <Doc/>,
        document.getElementById('content'));
