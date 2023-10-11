document.addEventListener('DOMContentLoaded', () => {
    // Select the button element
    const addworkButton = document.getElementById('addworkButton');

    // Add a click event listener to the button
    addworkButton.addEventListener('click', () => {
        // Create a hidden form element
        const form = document.createElement('form');
        form.action = '/cv/work/add';
        form.method = 'POST';

        // Create input fields for the data
        const fields = [
            { name: 'company', value: document.querySelector('[name=workCompany]').value },
            { name: 'position', value: document.querySelector('[name=workPosition]').value },
            { name: 'description', value: document.querySelector('[name=workDescription]').value },
            { name: 'startDate', value: document.querySelector('[name=workStartDate]').value },
            { name: 'endDate', value: document.querySelector('[name=workEndDate]').value },
        ];

        // Append input fields to the form
        fields.forEach((field) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = field.name;
            input.value = field.value;
            form.appendChild(input);
        });

        // Append the form to the document body and submit it
        document.body.appendChild(form);
        form.submit();
    });
});