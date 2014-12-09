var React = require('react');
var assert = require('assert');
var Textarea = require('react-textarea-autosize');


var str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
var str2="1 2 3 4 5 6 7 8 9";

var Doc = React.createClass({
    getInitialState: function() {
        return {
            lastkey: 1,
            blocks: [
                {
                    //"key": 0,
                    "author": "original",
                    "editable": true,
                    "value": str
                },
                {
                    //"key": 1,
                    "author": "original",
                    "editable": true,
                    "value": str2
                }
            ]
        };
    },
    splitFn: function(strIndex, blockIndex) {
            console.log("Split!", strIndex, blockIndex);
            //var key = this.state.lastKey + 1;

            //this.setState({lastKey: key});
            var blocks = this.state.blocks;

            var origstr = blocks[blockIndex].value;
            blocks[blockIndex].value = origstr.slice(0, strIndex);

            var newblock = {
             //   key: key,
                author: "original",
                editable: true,
                value: origstr.slice(strIndex)
            };

            blocks.splice(blockIndex + 1, 0, newblock);
            this.setState({blocks: blocks});
    },
    render: function() {
        var items = [];
        this.state.blocks.forEach(function(block, blockIndex){
            var blockIndex = blockIndex;
            items.push(<Block 
                       // key={block.key}
                        editable={block.editable}
                        value={block.value}
                        splitFn={this.splitFn}
                        blockIndex={blockIndex}
                    />);
        }.bind(this));
        return (
                <div>
                {items}
                </div>
        );
    }
});
var Block = React.createClass({
    propTypes: {
        splitFn: React.PropTypes.func
    },
    yeah: function() {
        console.log(this.getDOMNode().selectionStart);
    },
    onKeyPress: function() {
        console.log(event.which);
        if (event.which == 13) { //enter
            var strIndex = this.getDOMNode().selectionStart;
            this.props.splitFn(strIndex, this.props.blockIndex);
        }
    },
    render: function() {
        return this.props.editable
            ?
                <Textarea
                className="editable"
                onClick={this.yeah}
                onKeyPress={this.onKeyPress}
                value={this.props.value}/>
            :
                <p
                className="noneditable">
                {this.props.value}
                </p>
    }

});

React.render(
        <Doc/>,
        document.getElementById('content'));
