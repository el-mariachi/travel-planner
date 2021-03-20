const formSetup = () => {
    const form = document.forms.newtrip;
    console.log(form);
    document.addEventListener('load', () => {
        form.addEventListener('submit', Client.newTripSubmitHandler);
    });
};

export { formSetup };