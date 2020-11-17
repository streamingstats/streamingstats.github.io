class Quiz {
    constructor() {
        
    }

    submit(form) {
        console.log(form);
    }
}

const quiz = new Quiz();

function submit(form) {
    quiz.submit(form);
}  