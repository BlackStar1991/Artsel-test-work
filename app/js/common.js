window.onload = function () {
    let w_width = window.innerWidth;


    const swiper = new Swiper('.swiper', {

        slidesPerView: 1,
        spaceBetween: 10,
        autoHeight: true,

        breakpoints: {
            490: {
                slidesPerView: 2,
                spaceBetween: 20
            },

            1100: {
                slidesPerView: 3,
                spaceBetween: 30
            },

            1300: {
                slidesPerView: 4,
                spaceBetween: 40
            }
        }
    })


    let fan = document.querySelector(".aboutUs_fan-min")

    function scrollRotate() {
        fan.style.transform = "rotate(" + window.scrollY / 2 + "deg)";
    }

    if (w_width >= 768) {
        window.addEventListener('scroll', function () {
            scrollRotate();
        })
    }

    //// FORM
    const form = document.querySelector(".form_box");

    const formName = document.querySelector("#form_name");
    const formEmail = document.querySelector("#form_email");
    const formMessage = document.querySelector("#form_message");


    const btnSubmit = document.querySelector(".form_submit");

    let validationConditions = {
        notEmptyName: false,
        notEmptyEmail: false,
        correctEmail: false,
        notEmptyMessage: false,

        validCapcha: true,
    }

    const errorMessage = {
        notEmptyName: "The field name can't be empty",
        notEmptyEmail: "The email name can't be empty",
        notEmptyMessage: "Please write some message",
        correctEmail: "You have entered an invalid email",

        validCapcha: 'Capcha do not valid',
    }

    function addError(elem, textError) {
        let label = elem.parentNode
        label.classList.add('error');

        let spanErr = document.createElement('span');
        spanErr.classList.add('form_error')
        spanErr.textContent = textError;
        label.append(spanErr);
    }

    function removeError(elem) {
        let label = elem.parentNode
        label.classList.remove('error');
        let errorSpan = document.querySelectorAll(".form_error");
        for (let i = 0; i < errorSpan.length; i++) {
            errorSpan[i].remove()
        }
    }

    function showError (input, textError){
        addError(input, textError)
        setTimeout(() => removeError(input), 3000);
    }


    function validateEmptyField(input, valitationField, textError) {
        const val = input.value;
        if ((val === "") || (val.length === 0)) {
            showError(input, textError);
            validationConditions[valitationField] = false;
        } else {
            validationConditions[valitationField] = true;
        }
    }

    function validateEmail(input, valitationField, textError){
        const reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        if (reg.test(String(input.value).toLowerCase()) ){
            validationConditions[valitationField] = true;
        } else{
            showError(input, textError);
            validationConditions[valitationField] = false;
        }
    }


    form.addEventListener("submit", formSend)

    async function formSend(e) {
        e.preventDefault();

        validateEmptyField(formName, "notEmptyName", errorMessage.notEmptyName);
        validateEmptyField(formEmail, "notEmptyEmail", errorMessage.notEmptyEmail);
        validateEmail(formEmail,'correctEmail', errorMessage.correctEmail)
        validateEmptyField(formMessage, 'notEmptyMessage', errorMessage.notEmptyMessage)

        // console.log("validationConditions = ", validationConditions)

        const arrValidation = Object.values(validationConditions);
        /// console.log(arrValidation);
        let checker = arr => arr.every(Boolean);

        /// Check Capcha
        // let captcha = grecaptcha.getResponse();
        // if(!captcha.length){
        //    document.getElementById("recaptchaError").textContent=  errorMessage.validCapcha;
        // } else {
        //      console.log("Capcha valided continue loading");
        // }



        if(checker(arrValidation)){
            //// Validation ok

            btnSubmit.classList.add("preload");
            form.classList.add("_sending");


            let formData = new FormData(form);
            console.log(formData)

            let response = await fetch('sendmail.php', {
                method: 'POST',
                body: formData
            });
            if(response.ok){
                let result = await response.json();
                alert(result.message);
                form.reset();
                form.classList.remove("_sending");
                btnSubmit.classList.remove("preload");


                // grecaptcha.reset();
            } else {
                alert("ERROR");
                form.classList.remove("_sending");
                btnSubmit.classList.remove("preload");

                // grecaptcha.reset();

            }

        } else{
            console.log("Our validation false")
        }

    }


}

