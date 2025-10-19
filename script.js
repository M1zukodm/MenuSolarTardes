document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const dateInput = document.getElementById('menuDate');
    const dayTypeSelect = document.getElementById('dayType');
    const generateBtn = document.getElementById('generateBtn');
    const whatsappOutput = document.getElementById('whatsappOutput');
    const facebookOutput = document.getElementById('facebookOutput');
    const copyWhatsappBtn = document.getElementById('copyWhatsappBtn');
    const copyFacebookBtn = document.getElementById('copyFacebookBtn');
    const historyContainer = document.getElementById('historyContainer');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const addIngredientBtn = document.getElementById('addIngredientBtn');
    const addDrinkBtn = document.getElementById('addDrinkBtn');
    const customIngredientsContainer = document.getElementById('customIngredientsContainer');
    const customDrinksContainer = document.getElementById('customDrinksContainer');
    
    // Nuevas referencias para especialidades
    const individualTab = document.getElementById('individualTab');
    const listTab = document.getElementById('listTab');
    const individualSpecialties = document.getElementById('individual-specialties');
    const listSpecialties = document.getElementById('list-specialties');
    const specialtiesList = document.getElementById('specialtiesList');
    const processListBtn = document.getElementById('processListBtn');

    let menuHistory = [];

    // Configurar pestañas de salida
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Remover clase active de todos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Agregar clase active al seleccionado
            button.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });

    // Configurar pestañas de especialidades
    individualTab.addEventListener('click', () => {
        individualTab.classList.add('active');
        listTab.classList.remove('active');
        individualSpecialties.classList.add('active');
        listSpecialties.classList.remove('active');
    });

    listTab.addEventListener('click', () => {
        listTab.classList.add('active');
        individualTab.classList.remove('active');
        listSpecialties.classList.add('active');
        individualSpecialties.classList.remove('active');
    });

    // Procesar lista de especialidades
    processListBtn.addEventListener('click', function() {
        const listText = specialtiesList.value.trim();
        if (!listText) {
            alert('Por favor, ingresa una lista de especialidades.');
            return;
        }

        // Dividir por líneas y limpiar cada elemento
        const specialties = listText.split('\n')
            .map(item => item.trim())
            .filter(item => item !== '');

        if (specialties.length === 0) {
            alert('No se encontraron especialidades válidas en la lista.');
            return;
        }

        // Limpiar solo los campos variables (1, 2, 5, 6) - las fijas 3 y 4 no se tocan
        document.getElementById('special1').value = '';
        document.getElementById('special2').value = '';
        document.getElementById('special5').value = '';
        document.getElementById('special6').value = '';

        // Llenar los campos variables con las especialidades procesadas
        const variableFields = ['special1', 'special2', 'special5', 'special6'];
        for (let i = 0; i < Math.min(specialties.length, variableFields.length); i++) {
            document.getElementById(variableFields[i]).value = specialties[i];
        }

        // Si hay más especialidades que campos variables, mostrar alerta
        if (specialties.length > variableFields.length) {
            alert(`Se procesaron ${specialties.length} especialidades, pero solo se pueden mostrar ${variableFields.length} variables. Mulitas de Cecina y Quesadillas de Masa Frita siempre estarán incluidas.`);
        } else {
            alert(`Se procesaron ${specialties.length} especialidades correctamente. Mulitas de Cecina y Quesadillas de Masa Frita siempre estarán incluidas.`);
        }

        // Cambiar a la vista individual
        individualTab.click();
    });

    // Funciones para ingredientes personalizados
    function addCustomIngredient() {
        const div = document.createElement('div');
        div.className = 'custom-ingredient-group';
        div.innerHTML = `
            <input type="text" class="custom-ingredient" placeholder="Ej: Cecina, Pastor, Carnitas...">
            <button type="button" class="remove-ingredient" onclick="removeIngredient(this)">✕</button>
        `;
        customIngredientsContainer.appendChild(div);
    }

    function addCustomDrink() {
        const div = document.createElement('div');
        div.className = 'custom-drink-group';
        div.innerHTML = `
            <input type="text" class="custom-drink" placeholder="Ej: Michelada, Horchata...">
            <button type="button" class="remove-drink" onclick="removeDrink(this)">✕</button>
        `;
        customDrinksContainer.appendChild(div);
    }

    // Funciones globales para remover (necesarias para los onclick)
    window.removeIngredient = function(button) {
        button.parentElement.remove();
    }

    window.removeDrink = function(button) {
        button.parentElement.remove();
    }

    // Event listeners para botones de agregar
    addIngredientBtn.addEventListener('click', addCustomIngredient);
    addDrinkBtn.addEventListener('click', addCustomDrink);

    // Generar mensaje para WhatsApp
    function generateWhatsAppMessage() {
        const date = new Date(dateInput.value + 'T12:00:00');
        const dayName = date.toLocaleDateString('es-MX', { weekday: 'long' });
        const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
        const dayType = dayTypeSelect.value;

        // Configuración según tipo de día
        const dayConfigs = {
            'domingo': {
                saludo: '🌞 ¡Buenas tardes! 🙌🏻\nEste domingo es perfecto para darte un gustito especial… 😋🍲',
                titulo: '✨ ¡Mira nuestro delicioso menú del domingo! ✨'
            },
            'tarde': {
                saludo: '🌅 ¡Buenas tardes! 🙌🏻\nEsta tarde es perfecta para consentirte con unos auténticos antojitos mexicanos… 😋🌮',
                titulo: '✨ ¡Mira nuestro delicioso menú de la tarde! ✨'
            },
            'especial': {
                saludo: '🎉 ¡Buenas tardes! 🙌🏻\n¡Hoy es un día especial para disfrutar de los mejores antojitos mexicanos! 😋🍽️',
                titulo: '✨ ¡Mira nuestro delicioso menú especial de hoy! ✨'
            }
        };

        const config = dayConfigs[dayType];

        // Obtener especialidades (variables + fijas siempre)
        const specials = [];

        // Especialidades variables (1, 2, 5, 6)
        const variableFields = ['special1', 'special2', 'special5', 'special6'];
        variableFields.forEach(fieldId => {
            const special = document.getElementById(fieldId).value.trim();
            if (special) {
                specials.push(special);
            }
        });

        // Especialidades fijas que siempre están (3 y 4)
        specials.push("Mulitas de Cecina");
        specials.push("Quesadillas de Masa Frita");

        // Obtener ingredientes base seleccionados
        const baseIngredientCheckboxes = document.querySelectorAll('.ingredients-preset input[type="checkbox"]:checked');
        const baseIngredients = Array.from(baseIngredientCheckboxes).map(cb => {
            return cb.parentElement.textContent.trim();
        });

        // Obtener ingredientes personalizados
        const customIngredientInputs = document.querySelectorAll('.custom-ingredient');
        const customIngredients = Array.from(customIngredientInputs)
            .map(input => input.value.trim())
            .filter(ingredient => ingredient !== '');

        // Combinar todos los ingredientes
        const allIngredients = [...baseIngredients, ...customIngredients];

        // Obtener bebidas base seleccionadas
        const baseDrinkCheckboxes = document.querySelectorAll('.drinks-grid input[type="checkbox"]:checked');
        const baseDrinks = Array.from(baseDrinkCheckboxes).map(cb => {
            return cb.parentElement.textContent.trim();
        });

        // Obtener bebidas personalizadas
        const customDrinkInputs = document.querySelectorAll('.custom-drink');
        const customDrinks = Array.from(customDrinkInputs)
            .map(input => input.value.trim())
            .filter(drink => drink !== '');

        // Combinar todas las bebidas
        const allDrinks = [...baseDrinks, ...customDrinks];

        // Validar que haya al menos ingredientes o especialidades
        if (allIngredients.length === 0 && specials.length === 0) {
            alert('Por favor, ingresa al menos una especialidad o selecciona ingredientes para sopes y huaraches.');
            return '';
        }

        // Construir mensaje WhatsApp
        let message = `${config.saludo}\n\n${config.titulo}\n\n`;

        // Agregar especialidades si existen
        if (specials.length > 0) {
            message += `🍽 *Especialidades:*\n`;
            specials.forEach(special => {
                message += `✅ ${special}\n`;
            });
            message += `\n`;
        }

        // Agregar ingredientes si existen
        if (allIngredients.length > 0) {
            message += `🌮 *Sopes y Huaraches con:*\n`;
            allIngredients.forEach((ingredient, index) => {
                const emojis = ['🔵', '🟢', '🟡', '🟠', '🔴', '🟣', '⚫', '⚪', '🟤', '🔶'];
                message += `${emojis[index] || '✅'} ${ingredient}\n`;
            });
            message += `\n`;
        }

        // Agregar bebidas si existen
        if (allDrinks.length > 0) {
            message += `🥤 *Bebidas:*\n`;
            allDrinks.forEach(drink => {
                message += `➡ ${drink}\n`;
            });
            message += `\n`;
        }

        message += `📍 *Ubicación:* Coyuca de Benítez (zona centro y colonias cercanas)\n` +
                   `🛵 *Servicio a domicilio*\n` +
                   `📲 *Haz tu pedido al:* 781 100 3796\n\n` +
                   `🎉 ¡Dale sabor a tu ${dayType === 'domingo' ? 'tarde de domingo' : 'tarde'} con nosotros! 🤩🔥`;

        return message;
    }

    // Generar mensaje para Facebook
    function generateFacebookMessage() {
        const date = new Date(dateInput.value + 'T12:00:00');
        const dayName = date.toLocaleDateString('es-MX', { weekday: 'long' });
        const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
        const dayType = dayTypeSelect.value;

        const dayConfigs = {
            'domingo': {
                saludo: '🌞 ¡Buenas tardes a todos! 🙌🏻\nEste domingo es perfecto para darse un gustito especial… 😋🍲',
                titulo: '✨ ¡Miren nuestro delicioso menú del domingo! ✨'
            },
            'tarde': {
                saludo: '🌅 ¡Buenas tardes! 🙌🏻\nEsta tarde es perfecta para consentirse con unos auténticos antojitos mexicanos… 😋🌮',
                titulo: '✨ ¡Miren nuestro delicioso menú de la tarde! ✨'
            },
            'especial': {
                saludo: '🎉 ¡Buenas tardes a todos! 🙌🏻\n¡Hoy es un día especial para disfrutar de los mejores antojitos mexicanos! 😋🍽️',
                titulo: '✨ ¡Miren nuestro delicioso menú especial de hoy! ✨'
            }
        };

        const config = dayConfigs[dayType];

        // Obtener especialidades (variables + fijas siempre)
        const specials = [];

        // Especialidades variables (1, 2, 5, 6)
        const variableFields = ['special1', 'special2', 'special5', 'special6'];
        variableFields.forEach(fieldId => {
            const special = document.getElementById(fieldId).value.trim();
            if (special) {
                specials.push(special);
            }
        });

        // Especialidades fijas que siempre están (3 y 4)
        specials.push("Mulitas de Cecina");
        specials.push("Quesadillas de Masa Frita");

        // Obtener ingredientes base seleccionados
        const baseIngredientCheckboxes = document.querySelectorAll('.ingredients-preset input[type="checkbox"]:checked');
        const baseIngredients = Array.from(baseIngredientCheckboxes).map(cb => cb.parentElement.textContent.trim());

        // Obtener ingredientes personalizados
        const customIngredientInputs = document.querySelectorAll('.custom-ingredient');
        const customIngredients = Array.from(customIngredientInputs)
            .map(input => input.value.trim())
            .filter(ingredient => ingredient !== '');

        // Combinar todos los ingredientes
        const allIngredients = [...baseIngredients, ...customIngredients];

        // Obtener bebidas base seleccionadas
        const baseDrinkCheckboxes = document.querySelectorAll('.drinks-grid input[type="checkbox"]:checked');
        const baseDrinks = Array.from(baseDrinkCheckboxes).map(cb => cb.parentElement.textContent.trim());

        // Obtener bebidas personalizadas
        const customDrinkInputs = document.querySelectorAll('.custom-drink');
        const customDrinks = Array.from(customDrinkInputs)
            .map(input => input.value.trim())
            .filter(drink => drink !== '');

        // Combinar todas las bebidas
        const allDrinks = [...baseDrinks, ...customDrinks];

        if (allIngredients.length === 0 && specials.length === 0) {
            return '';
        }

        // Construir mensaje Facebook (sin formato bold con *)
        let message = `${config.saludo}\n\n${config.titulo}\n\n`;

        if (specials.length > 0) {
            message += `🍽 Especialidades:\n`;
            specials.forEach(special => {
                message += `✅ ${special}\n`;
            });
            message += `\n`;
        }

        if (allIngredients.length > 0) {
            message += `🌮 Sopes y Huaraches con:\n`;
            allIngredients.forEach((ingredient, index) => {
                const emojis = ['🔵', '🟢', '🟡', '🟠', '🔴', '🟣', '⚫', '⚪', '🟤', '🔶'];
                message += `${emojis[index] || '✅'} ${ingredient}\n`;
            });
            message += `\n`;
        }

        if (allDrinks.length > 0) {
            message += `🥤 Bebidas:\n`;
            allDrinks.forEach(drink => {
                message += `➡ ${drink}\n`;
            });
            message += `\n`;
        }

        message += `📍 Ubicación: Coyuca de Benítez (solo zona centro)\n` +
                   `🛵 Servicio a domicilio\n` +
                   `📲 Haz tu pedido al: 781 100 3796\n\n` +
                   `🎉 ¡Dale sabor a tu ${dayType === 'domingo' ? 'tarde de domingo' : 'tarde'} con nosotros! 🤩🔥`;

        return message;
    }

    // Generar menú
    generateBtn.addEventListener('click', function() {
        if (!dateInput.value) {
            alert('Por favor, selecciona una fecha.');
            return;
        }

        const whatsappMessage = generateWhatsAppMessage();
        const facebookMessage = generateFacebookMessage();

        if (whatsappMessage === '') {
            return; // Ya se mostró el alert en generateWhatsAppMessage
        }

        whatsappOutput.value = whatsappMessage;
        facebookOutput.value = facebookMessage;

        // Guardar en historial
        const menuData = {
            date: dateInput.value,
            dayType: dayTypeSelect.value,
            specials: [],
            ingredients: [],
            drinks: []
        };

        // Guardar especialidades variables
        const variableFields = ['special1', 'special2', 'special5', 'special6'];
        variableFields.forEach(fieldId => {
            const special = document.getElementById(fieldId).value.trim();
            if (special) {
                menuData.specials.push(special);
            }
        });

        // Siempre incluir las fijas al final
        menuData.specials.push("Mulitas de Cecina");
        menuData.specials.push("Quesadillas de Masa Frita");

        // Guardar ingredientes
        const baseIngredientCheckboxes = document.querySelectorAll('.ingredients-preset input[type="checkbox"]:checked');
        baseIngredientCheckboxes.forEach(cb => {
            menuData.ingredients.push(cb.parentElement.textContent.trim());
        });

        const customIngredientInputs = document.querySelectorAll('.custom-ingredient');
        customIngredientInputs.forEach(input => {
            if (input.value.trim()) {
                menuData.ingredients.push(input.value.trim());
            }
        });

        // Guardar bebidas
        const baseDrinkCheckboxes = document.querySelectorAll('.drinks-grid input[type="checkbox"]:checked');
        baseDrinkCheckboxes.forEach(cb => {
            menuData.drinks.push(cb.parentElement.textContent.trim());
        });

        const customDrinkInputs = document.querySelectorAll('.custom-drink');
        customDrinkInputs.forEach(input => {
            if (input.value.trim()) {
                menuData.drinks.push(input.value.trim());
            }
        });

        saveMenuToHistory(menuData);
    });

    // Funciones de copiado
    copyWhatsappBtn.addEventListener('click', function() {
        if (whatsappOutput.value === '') {
            alert('Primero genera un menú para poder copiarlo.');
            return;
        }
        navigator.clipboard.writeText(whatsappOutput.value).then(() => {
            copyWhatsappBtn.textContent = '¡Copiado! ✓';
            setTimeout(() => {
                copyWhatsappBtn.textContent = '📋 Copiar WhatsApp';
            }, 2000);
        });
    });

    copyFacebookBtn.addEventListener('click', function() {
        if (facebookOutput.value === '') {
            alert('Primero genera un menú para poder copiarlo.');
            return;
        }
        navigator.clipboard.writeText(facebookOutput.value).then(() => {
            copyFacebookBtn.textContent = '¡Copiado! ✓';
            setTimeout(() => {
                copyFacebookBtn.textContent = '📋 Copiar Facebook';
            }, 2000);
        });
    });

    // Funciones de historial
    function saveMenuToHistory(menuData) {
        // Verificar si ya existe un menú para esta fecha
        const existingIndex = menuHistory.findIndex(item => item.date === menuData.date);
        
        if (existingIndex !== -1) {
            menuHistory[existingIndex] = menuData;
        } else {
            menuHistory.push(menuData);
        }

        // Ordenar por fecha (más reciente primero)
        menuHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Guardar en localStorage
        localStorage.setItem('menuHistory', JSON.stringify(menuHistory));

        // Actualizar vista
        renderHistory();
    }

    function renderHistory() {
        historyContainer.innerHTML = '';
        
        if (menuHistory.length === 0) {
            historyContainer.innerHTML = '<p>No hay menús anteriores guardados.</p>';
            return;
        }

        menuHistory.forEach((menu, index) => {
            const date = new Date(menu.date + 'T12:00:00');
            const formattedDate = date.toLocaleDateString('es-MX', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
            
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div>
                    <div class="history-item-date">${capitalizedDate}</div>
                    <div class="history-item-content">
                        ${menu.specials.length > 0 ? 'Especialidades: ' + menu.specials.join(', ') : 'Sin especialidades'}
                    </div>
                </div>
                <button class="delete-btn" data-index="${index}">✕</button>
            `;
            
            historyItem.addEventListener('click', (e) => {
                if (!e.target.classList.contains('delete-btn')) {
                    loadMenuFromHistory(menu);
                }
            });
            
            const deleteBtn = historyItem.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteMenuFromHistory(index);
            });
            
            historyContainer.appendChild(historyItem);
        });
    }

    function loadMenuFromHistory(menu) {
        // Establecer fecha
        dateInput.value = menu.date;
        
        // Establecer tipo de día
        dayTypeSelect.value = menu.dayType;
        
        // Limpiar campos variables (las fijas 3 y 4 no se tocan)
        document.getElementById('special1').value = '';
        document.getElementById('special2').value = '';
        document.getElementById('special5').value = '';
        document.getElementById('special6').value = '';

        // Llenar especialidades variables (excluyendo las 2 últimas que son las fijas)
        const variableFields = ['special1', 'special2', 'special5', 'special6'];
        let variableIndex = 0;

        menu.specials.forEach((special, index) => {
            // Excluir las últimas 2 que son las fijas
            if (index < menu.specials.length - 2 && variableIndex < variableFields.length) {
                document.getElementById(variableFields[variableIndex]).value = special;
                variableIndex++;
            }
        });
        
        // Limpiar y llenar ingredientes base
        const baseIngredientCheckboxes = document.querySelectorAll('.ingredients-preset input[type="checkbox"]');
        baseIngredientCheckboxes.forEach(cb => {
            const ingredientText = cb.parentElement.textContent.trim();
            cb.checked = menu.ingredients.includes(ingredientText);
        });
        
        // Limpiar ingredientes personalizados
        const customIngredientGroups = document.querySelectorAll('.custom-ingredient-group');
        customIngredientGroups.forEach(group => {
            if (group !== customIngredientGroups[0]) {
                group.remove();
            }
        });
        
        // Limpiar el primer campo de ingredientes personalizados
        const firstCustomIngredient = document.querySelector('.custom-ingredient');
        if (firstCustomIngredient) {
            firstCustomIngredient.value = '';
        }
        
        // Agregar ingredientes personalizados que no están en la lista base
        const baseIngredients = Array.from(document.querySelectorAll('.ingredients-preset input[type="checkbox"]'))
            .map(cb => cb.parentElement.textContent.trim());
            
        menu.ingredients.forEach(ingredient => {
            if (!baseIngredients.includes(ingredient)) {
                addCustomIngredient();
                const customInputs = document.querySelectorAll('.custom-ingredient');
                const lastInput = customInputs[customInputs.length - 1];
                lastInput.value = ingredient;
            }
        });
        
        // Limpiar y llenar bebidas base
        const baseDrinkCheckboxes = document.querySelectorAll('.drinks-grid input[type="checkbox"]');
        baseDrinkCheckboxes.forEach(cb => {
            const drinkText = cb.parentElement.textContent.trim();
            cb.checked = menu.drinks.includes(drinkText);
        });
        
        // Limpiar bebidas personalizadas
        const customDrinkGroups = document.querySelectorAll('.custom-drink-group');
        customDrinkGroups.forEach(group => {
            if (group !== customDrinkGroups[0]) {
                group.remove();
            }
        });
        
        // Limpiar el primer campo de bebidas personalizadas
        const firstCustomDrink = document.querySelector('.custom-drink');
        if (firstCustomDrink) {
            firstCustomDrink.value = '';
        }
        
        // Agregar bebidas personalizadas que no están en la lista base
        const baseDrinks = Array.from(document.querySelectorAll('.drinks-grid input[type="checkbox"]'))
            .map(cb => cb.parentElement.textContent.trim());
            
        menu.drinks.forEach(drink => {
            if (!baseDrinks.includes(drink)) {
                addCustomDrink();
                const customInputs = document.querySelectorAll('.custom-drink');
                const lastInput = customInputs[customInputs.length - 1];
                lastInput.value = drink;
            }
        });
        
        alert('Menú cargado desde el historial. Ahora puedes generar el menú o hacer modificaciones.');
    }

    function deleteMenuFromHistory(index) {
        if (confirm('¿Estás seguro de que quieres eliminar este menú del historial?')) {
            menuHistory.splice(index, 1);
            localStorage.setItem('menuHistory', JSON.stringify(menuHistory));
            renderHistory();
        }
    }

    // Inicializar
    function initialize() {
        // Establecer fecha actual como valor por defecto
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        dateInput.value = formattedDate;
        
        // Establecer especialidades fijas
        document.getElementById('special3').value = "Mulitas de Cecina";
        document.getElementById('special4').value = "Quesadillas de Masa Frita";
        
        // Cargar historial desde localStorage
        const savedHistory = localStorage.getItem('menuHistory');
        if (savedHistory) {
            menuHistory = JSON.parse(savedHistory);
            renderHistory();
        }
    }

    initialize();
});