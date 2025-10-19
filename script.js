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

    let menuHistory = [];

    // Configurar pestañas
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

        // Obtener especialidades (solo las que tienen contenido)
        const specials = [];
        for (let i = 1; i <= 4; i++) {
            const special = document.getElementById(`special${i}`).value.trim();
            if (special) {
                specials.push(special);
            }
        }

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

        // Obtener datos (misma lógica que WhatsApp)
        const specials = [];
        for (let i = 1; i <= 4; i++) {
            const special = document.getElementById(`special${i}`).value.trim();
            if (special) {
                specials.push(special);
            }
        }

        const baseIngredientCheckboxes = document.querySelectorAll('.ingredients-preset input[type="checkbox"]:checked');
        const baseIngredients = Array.from(baseIngredientCheckboxes).map(cb => cb.parentElement.textContent.trim());

        const customIngredientInputs = document.querySelectorAll('.custom-ingredient');
        const customIngredients = Array.from(customIngredientInputs)
            .map(input => input.value.trim())
            .filter(ingredient => ingredient !== '');

        const allIngredients = [...baseIngredients, ...customIngredients];

        const baseDrinkCheckboxes = document.querySelectorAll('.drinks-grid input[type="checkbox"]:checked');
        const baseDrinks = Array.from(baseDrinkCheckboxes).map(cb => cb.parentElement.textContent.trim());

        const customDrinkInputs = document.querySelectorAll('.custom-drink');
        const customDrinks = Array.from(customDrinkInputs)
            .map(input => input.value.trim())
            .filter(drink => drink !== '');

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

        // Guardar especialidades
        for (let i = 1; i <= 4; i++) {
            const special = document.getElementById(`special${i}`).value.trim();
            if (special) {
                menuData.specials.push(special);
            }
        }

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

    // Sistema de historial
    function saveMenuToHistory(menuData) {
        menuHistory = menuHistory.filter(menu => menu.date !== menuData.date);
        menuHistory.unshift(menuData);
        if (menuHistory.length > 10) {
            menuHistory.pop();
        }
        localStorage.setItem('menuHistoryAntojitos', JSON.stringify(menuHistory));
        renderHistory();
    }

    function deleteMenuFromHistory(event, index) {
        event.stopPropagation();
        menuHistory.splice(index, 1);
        localStorage.setItem('menuHistoryAntojitos', JSON.stringify(menuHistory));
        renderHistory();
    }

    function renderHistory() {
        historyContainer.innerHTML = '';
        if (menuHistory.length === 0) {
            historyContainer.innerHTML = '<p>No hay menús guardados.</p>';
            return;
        }
        menuHistory.forEach((menu, index) => {
            const item = document.createElement('div');
            item.className = 'history-item';
            
            const displayText = menu.specials.length > 0 ? 
                menu.specials[0] : 
                (menu.ingredients.length > 0 ? menu.ingredients[0] + '...' : 'Menú personalizado');
                
            item.innerHTML = `
                <div>
                    <div class="history-item-date">${menu.date} (${menu.dayType})</div>
                    <div class="history-item-content">${displayText}</div>
                </div>
                <button class="delete-btn" title="Eliminar menú">🗑️</button>
            `;
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('delete-btn')) {
                    loadMenuFromHistory(index);
                }
            });
            item.querySelector('.delete-btn').addEventListener('click', (event) => deleteMenuFromHistory(event, index));
            historyContainer.appendChild(item);
        });
    }

    function loadMenuFromHistory(index) {
        const menu = menuHistory[index];
        dateInput.value = menu.date;
        dayTypeSelect.value = menu.dayType;
        
        // Cargar especialidades
        for (let i = 1; i <= 4; i++) {
            const input = document.getElementById(`special${i}`);
            input.value = menu.specials[i - 1] || '';
        }

        // Cargar ingredientes base
        document.querySelectorAll('.ingredients-preset input[type="checkbox"]').forEach(cb => {
            const labelText = cb.parentElement.textContent.trim();
            cb.checked = menu.ingredients.includes(labelText);
        });

        // Limpiar y cargar ingredientes personalizados
        customIngredientsContainer.innerHTML = '';
        const customIngredients = menu.ingredients.filter(ingredient => {
            const baseIngredients = Array.from(document.querySelectorAll('.ingredients-preset input[type="checkbox"]'))
                .map(cb => cb.parentElement.textContent.trim());
            return !baseIngredients.includes(ingredient);
        });

        customIngredients.forEach(ingredient => {
            addCustomIngredient();
            const lastInput = customIngredientsContainer.lastElementChild.querySelector('.custom-ingredient');
            lastInput.value = ingredient;
        });

        // Cargar bebidas base
        document.querySelectorAll('.drinks-grid input[type="checkbox"]').forEach(cb => {
            const labelText = cb.parentElement.textContent.trim();
            cb.checked = menu.drinks.includes(labelText);
        });

        // Limpiar y cargar bebidas personalizadas
        customDrinksContainer.innerHTML = '';
        const customDrinks = menu.drinks.filter(drink => {
            const baseDrinks = Array.from(document.querySelectorAll('.drinks-grid input[type="checkbox"]'))
                .map(cb => cb.parentElement.textContent.trim());
            return !baseDrinks.includes(drink);
        });

        customDrinks.forEach(drink => {
            addCustomDrink();
            const lastInput = customDrinksContainer.lastElementChild.querySelector('.custom-drink');
            lastInput.value = drink;
        });
    }

    function loadHistoryFromStorage() {
        const storedHistory = localStorage.getItem('menuHistoryAntojitos');
        if (storedHistory) {
            menuHistory = JSON.parse(storedHistory);
            renderHistory();
        }
    }

    // Inicialización
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const todayLocal = new Date(today.getTime() - (offset * 60 * 1000));
    dateInput.value = todayLocal.toISOString().split('T')[0];

    loadHistoryFromStorage();
});