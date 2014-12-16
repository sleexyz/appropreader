var React = require('react/addons'),
    assert = require('assert'),
    Textarea = require('react-textarea-autosize'),
    objectAssign = require("object-assign"),
    myUtil = require("./MyUtil.js");

var Block = React.createClass({
    propTypes: {
        splitFn: React.PropTypes.func,
        blockIndex: React.PropTypes.number,
        belongsToCurrentVoice: React.PropTypes.bool
    },
    onKeyPress: function(event) {
        if (!this.props.belongsToCurrentVoice) {
            event.preventDefault();

            if (event.which == 13) { //enter
                var textarea = this.refs["child"].getDOMNode();
                var strIndex = textarea.selectionStart;
                this.props.splitFn(strIndex, this.props.blockIndex);
            }
        }
    },
    onKeyUp: function(event) {
        if (event.which == 8) { //backspace
            console.log(event);
            var textarea = this.refs["child"].getDOMNode();
            if(textarea.value.length == 0 ) {
                console.log("empty!");
            }
        }
    },
    onKeyDown: function(event) {
        console.log(event.which);
        var desiredKey = (event.which == 8) || //backspace
            (event.which == 46) || //delete
            (event.ctrlKey && event.which == 88); //ctrl-x
        if (desiredKey  && !this.props.belongsToCurrentVoice) {
            event.preventDefault();
        }
    },
    delete: function() {
        this.props.deleteFn(this.props.blockIndex);
    },
    onChange: function(event) {
        console.log(event);
        var html = this.getDOMNode().innerHTML;
        if (this.props.updateFn && html !== this.lastHtml) {
            this.props.updateFn(html, this.props.blockIndex);
        }
        this.lastHtml = html;
    },
    render: function() {
        return <span
            className={"Textarea"}
        contentEditable={true}
        onKeyPress={this.onKeyPress}
        onKeyUp={this.onKeyUp}
        onKeyDown={this.onKeyDown}
        onInput={this.onChange}
        onBlur={this.onChange}
        rows={1}
        {...this.props.toTextarea}
        ref="child"
        dangerouslySetInnerHTML={{__html: this.props.html}}
        />
    },
    shouldComponentUpdate: function(nextProps){
        return nextProps.html !== this.getDOMNode().innerHTML;
    },

    componentDidUpdate: function() {
        if ( this.props.html !== this.getDOMNode().innerHTML ) {
            this.getDOMNode().innerHTML = this.props.html;
        }
    },

    emitChange: function(){
    }
});

module.exports = Block;
