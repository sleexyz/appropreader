exports.hsla = function(color, alpha) {
    return "hsla(" + color.h + "," + color.s + "," + color.l + "," + alpha + ")"
}

/**
 * Gets character after Caret
 * Derived From http://stackoverflow.com/questions/15157435/get-last-character-before-caret-position-in-javascript
 */
exports.getCharacterProcedingCaret = function(elem) {
    var range = window.getSelection().getRangeAt(0);
    var postCaretRange = range.cloneRange();
    postCaretRange.selectNodeContents(elem);
    console.log(range.endContainer, range.endContainer.length);
    postCaretRange.setStart(range.endContainer, range.endOffset);
    postCaretRange.setEnd(range.endContainer, range.endContainer.length);
    return postCaretRange.toString()[0];
}

/**
 * From http://stackoverflow.com/questions/4811822/get-a-ranges-start-and-end-offsets-relative-to-its-parent-container/4812022#4812022
 */
exports.getCaretCharacterOffsetWithin = function(element) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            var range = win.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        }
    } else if ( (sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}
