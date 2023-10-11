document.addEventListener('DOMContentLoaded', () => {
    // Select the button element
    const addEducationButton = document.getElementById('addEducationButton');

    // Add a click event listener to the button
    addEducationButton.addEventListener('click', () => {
        // Create a hidden form element
        const form = document.createElement('form');
        form.action = '/cv/education/add';
        form.method = 'POST';

        // Create input fields for the data
        const fields = [
            { name: 'institution', value: document.querySelector('[name=educationInstitution]').value },
            { name: 'degree', value: document.querySelector('[name=educationDegree]').value },
            { name: 'major', value: document.querySelector('[name=educationMajor]').value },
            { name: 'startDate', value: document.querySelector('[name=educationStartDate]').value },
            { name: 'endDate', value: document.querySelector('[name=educationEndDate]').value },
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