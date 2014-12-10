var React = require('react');
var assert = require('assert');
var Textarea = require('react-textarea-autosize');
var objectAssign = require("object-assign");


var strs = ["Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."];


/**
 * Makes a valid block state.
 * Really just gives unique key to block.
 * Every time a block mutates, it needs to get a new block state.
 */
var genBlock = (function (){
    var counter = 0;

    function nextKey() {
        var output = "key_" + counter;
        counter += 1;
        return output;
    }
    return function(object) {
        if (object){
            return objectAssign({}, object, {"key": nextKey()});
        }
        //else throw error!
    }
})();

var Doc = React.createClass({
    getInitialState: function() {
        return {
            blocks: strs.map(function(str) {
                return genBlock({
                    "author": "original",
                    "value": str 
                });
            })
        };
    },
    splitFn: function(strIndex, blockIndex) {
        //TODO:check for cases on splitting for nothing! (eg at the beginning/end
        //also make sure no invisible divs sneaking out, while checking for this
        
        console.log("Split!", strIndex, blockIndex);
        var blocks = this.state.blocks;

        var original = blocks[blockIndex];
        var origstr = blocks[blockIndex].value;

        var left = objectAssign({}, original, {value: origstr.slice(0, strIndex)});

        var mid = {
            author: "me",
            value: "poop"
        };

        var right = objectAssign({}, original, {value: origstr.slice(strIndex)});

        blocks.splice(blockIndex, 1, genBlock(left), genBlock(mid), genBlock(right));
        this.replaceState({blocks: blocks});
    },
    deleteFn: function(blockIndex) {
        var blocks = this.state.blocks;
        blocks.splice(blockIndex,1);
        this.setState({blocks: blocks});
    },
    updateFn: function(value, blockIndex) {
        var blocks = this.state.blocks;
        var block = blocks[blockIndex];
        objectAssign(block, {"value": value});

        this.setState({blocks: blocks});
    },
    render: function() {
        var items = [];
        this.state.blocks.forEach(function(block, blockIndex){
            var blockIndex = blockIndex;
            items.push(<Block 
                    key={block.key}
                    value={block.value}
                    splitFn={this.splitFn}
                    deleteFn={this.deleteFn}
                    blockIndex={blockIndex}
                    updateFn={this.updateFn}
                    ref={block + blockIndex}
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
    onKeyPress: function(event) {
        //event.preventDefault();
        if (event.which == 13) { //enter
            var strIndex = this.refs["child"].refs.textarea.getDOMNode().selectionStart;
            this.props.splitFn(strIndex, this.props.blockIndex);
        }
    },
    delete: function() {
        this.props.deleteFn(this.props.blockIndex);
    },
    onChange: function(event) {
        this.props.updateFn(event.target.value, this.props.blockIndex);
    },
    render: function() {
        return  <Textarea
            className={"Textarea"}
        onKeyPress={this.onKeyPress}
        onChange={this.onChange}
        value={this.props.value}
        ref="child"
            />
    }
});

React.render(
        <Doc/>,
        document.getElementById('content'));
