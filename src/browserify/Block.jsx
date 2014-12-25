var React = require('react/addons'),
    assert = require('assert'),
    Textarea = require('react-textarea-autosize'),
    objectAssign = require("object-assign"),
    myUtil = require("./MyUtil.js");

var Block = React.createClass({
    propTypes: {
        splitFn: React.PropTypes.func,
        blockIndex: React.PropTypes.number,
        editable: React.PropTypes.bool
    },
    onKeyDown: function(event) {
        console.log("keydown: ", event.which);
        var passchars = [33, 34, 35, 36, 37, 38, 39 ,40, 9]; //we allow arrow keys
        var pass = false;
        for (var i = 0; i < passchars.length; i++) {
            pass = pass || (passchars[i] === event.which);
            if (pass) break;
        }
        if (this.props.editable || pass) { 
            if (event.which === 8) { //backspace
                console.log(this.props.text.length);
                if ((this.props.text.length === 0) ||
                        ((this.props.text.length === 1) && this.props.text === "\n")) {
                    this.props.deleteFn(this.props.blockIndex);
                    event.preventDefault();
                } 
            }
        } else {
            if (event.which === 13) { //enter
                var caretPos = myUtil.getCaretCharacterOffsetWithin(this.refs.child.getDOMNode());
                this.props.splitFn(this.props.blockIndex, caretPos);
            }
            event.preventDefault();
        }
    },
    onKeyPress: function(event) {
        console.log("keypress: ", event.which);
    },
    onPaste: function(event) {
        console.log(event.clipboardData);
    },
        /**
         * Fired by parent node
         * @param id id of changed element
         */
    onChange: function(event) {
        if (this.props.editable) {
            var newText = this.refs.child.getDOMNode().textContent;
            if (newText!== this.lastText) {
                this.props.updateFn(this.props.blockIndex, newText);
            }
            this.lastText = newText; //update internal state
        } else {
            this.refreshDOM();
        }
    },
    refreshDOM: function() {
        this.refs.child.getDOMNode().textContent = this.lastText;
    },
    render: function() {
        var classes = React.addons.classSet({
            "block": true,
            "block-editable": this.props.editable,
            "block-noneditable": !this.props.editable
        });
        return <div
                className={classes}
            >
            <span
                contentEditable={true}
                id={this.props.id}
                className={"blockContents"}
                onInput={this.onChange}
                onKeyDown={this.onKeyDown}
                onKeyPress={this.onKeyPress}
                onPaste={this.onPaste}
                ref={"child"}
                >
                {this.props.text}
            </span>
        </div>
    },
    shouldComponentUpdate: function(nextProps){
        return ((nextProps.text !== this.refs.child.getDOMNode().textContent) ||
                (nextProps.editable !== this.props.editable));
    },
    componentDidMount: function() {
        this.lastText= this.refs.child.getDOMNode().textContent; //lastText is a non-react-state, object-specific state variable
    },

    componentDidUpdate: function() {
        if ( this.props.text !== this.refs.child.getDOMNode().textContent) {
            this.refs.child.getDOMNode().textContent = this.props.text;
        }
    },

});





module.exports = Block;
