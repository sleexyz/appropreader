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
        }else {
            if (event.which == 13) { //enter
                this.refs.child.recalculateSize();
            }
        }
    },
    shouldComponentUpdate: function(nextProps, nextState) {
     //   return (nextProps.value !== this.props.value);
        return true;
    },
    componentDidMount: function() {
        //window.addEventListener("resize", this.forceUpdate);
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
        if (this.props.belongsToCurrentVoice){
            this.props.updateFn(event.target.value, this.props.blockIndex);
        }
    },
    componentWillUpdate: function() {
        var node = this.refs.child.getDOMNode();
        this.scrollHeight = node.scrollHeight;
        this.scrollTop = node.scrollTop;
    },
    componentDidUpdate: function() {
        //scrolling stuff 
        var node = this.getDOMNode();
        console.log({
            "tagname": node.tagName,
            "node.scrollTop": node.scrollTop,
            "node.scrollHeight": node.scrollHeight,
            "this.scrollTop": this.scrollTop,
            "this.scrollHeight": this.scrollHeight});
//        node.scrollTop = node.scrollHeight;
    },
    render: function() {
        return <Textarea
            className={"Textarea"}
        onKeyPress={this.onKeyPress}
        onKeyUp={this.onKeyUp}
        onKeyDown={this.onKeyDown}
        onChange={this.onChange}
        value={this.props.value}
        rows={1}
        {...this.props.toTextarea}
        ref="child"
            />
    }
});
module.exports = Block;
