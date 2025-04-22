// JavaScript-Funktionen fu00fcr den Webblog

document.addEventListener('DOMContentLoaded', function() {
    // Hier ku00f6nnen Sie JavaScript-Code hinzufu00fcgen, der ausgefu00fchrt wird,
    // wenn das DOM vollstu00e4ndig geladen ist
    
    // Beispiel: Formularvalidierung
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (!isValid) {
                event.preventDefault();
                alert('Bitte fu00fcllen Sie alle erforderlichen Felder aus.');
            }
        });
    });
});