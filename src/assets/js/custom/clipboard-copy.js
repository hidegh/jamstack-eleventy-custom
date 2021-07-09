// Based on: https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
class ClipboardCopy {

    static copy(text, successFn, errorFn) {

        successFn = successFn || function () { };
        errorFn = errorFn || function () { };

        const hasNavigatorClipboard = navigator && navigator.clipboard;

        if (hasNavigatorClipboard) ClipboardCopy._copyViaNavigatorApiClipboard(text, successFn, errorFn)
        else ClipboardCopy._copyOldSchool(text, successFn, errorFn)
    }

    static _copyViaNavigatorApiClipboard(text, successFn, errorFn) {
        navigator.clipboard.writeText(text).then(
            function () {
                successFn();
            },
            function (err) {
                errorFn(err);
            }
        );
    }

    static _copyOldSchool(text, successFn, errorFn) {
        const textArea = document.createElement("textarea");

        // avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        // extras
        textArea.style.height = 0;
        textArea.style.width = 0;
        textArea.style.overflow = "hidden"

        // prepare for copy
        textArea.value = text;

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        let success = false;
        let error;

        try {
            success = document.execCommand('copy');
        } catch (err) {
            success = false;
            error = err;
        }

        // cleanup
        document.body.removeChild(textArea);

        // handle result
        if (success) successFn()
        else errorFn(error);
    }

}
