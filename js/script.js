class TextCorrector {
    constructor(text) {
        this.text = text;
        this.errors = this.findErrors();
    }

    findErrors() {
        const punctuationRegex = /([.,:;!?])\s{2,}/g;
        const veteranRegex = /\bveteran\b/g;

        let errors = [];
        let match;

        // Find spacing issues after punctuation marks
        while ((match = punctuationRegex.exec(this.text)) !== null) {
            errors.push({
                index: match.index,
                length: match[0].length,
                type: 'spacing',
                correct: `${match[1]} `
            });
        }

        // Find uncapitalized "veteran"
        while ((match = veteranRegex.exec(this.text)) !== null) {
            errors.push({
                index: match.index,
                length: match[0].length,
                type: 'capitalization',
                correct: 'Veteran'
            });
        }

        return errors;
    }

    correctNextError() {
        if (this.errors.length === 0) {
            return this.text;
        }

        const error = this.errors.shift();
        this.text = this.text.slice(0, error.index) + error.correct + this.text.slice(error.index + error.length);

        // Update the positions of subsequent errors
        this.errors = this.errors.map(e => {
            if (e.index > error.index) {
                e.index += error.correct.length - error.length;
            }
            return e;
        });

        return this.text;
    }

    correctAllErrors() {
        while (this.errors.length > 0) {
            this.correctNextError();
        }
        return this.text;
    }

    getErrors() {
        return this.errors;
    }
}

const textInput = document.getElementById('textInput');
const checkErrorsButton = document.getElementById('checkErrorsButton');
const nextErrorButton = document.getElementById('nextErrorButton');
const correctAllErrorsButton = document.getElementById('correctAllErrorsButton');
const errorDisplay = document.getElementById('errorDisplay');

let textCorrector;

checkErrorsButton.addEventListener('click', () => {
    textCorrector = new TextCorrector(textInput.value);
    displayErrors();
});

nextErrorButton.addEventListener('click', () => {
    if (textCorrector && textCorrector.errors.length > 0) {
        textInput.value = textCorrector.correctNextError();
        displayErrors();
        highlightNextError();
    }
});

correctAllErrorsButton.addEventListener('click', () => {
    if (textCorrector) {
        if (confirm("Do you want to correct all errors?")) {
            textInput.value = textCorrector.correctAllErrors();
            displayErrors();
        }
    }
});

function displayErrors() {
    if (textCorrector.errors.length > 0) {
        errorDisplay.textContent = `${textCorrector.errors.length} errors found. Click "Next Error" to correct one by one or "Correct All Errors" to fix all at once.`;
    } else {
        errorDisplay.textContent = "No errors found.";
    }
}

function highlightNextError() {
    if (textCorrector.errors.length > 0) {
        const error = textCorrector.errors[0];
        const beforeError = textInput.value.substring(0, error.index);
        const errorText = textInput.value.substring(error.index, error.index + error.length);
        const afterError = textInput.value.substring(error.index + error.length);

        textInput.value = beforeError + errorText + afterError;
        textInput.setSelectionRange(beforeError.length, beforeError.length + errorText.length);
        textInput.focus();
    }
}
