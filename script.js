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

    // Generar mensaje base (sin variantes)
    function generateBaseMessage(platform) {
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

        // Construir mensaje base
        let message = '';

        // Agregar especialidades si existen
        if (specials.length > 0) {
            message += `🍽 ${platform === 'whatsapp' ? '*' : ''}Especialidades:${platform === 'whatsapp' ? '*' : ''}\n`;
            specials.forEach(special => {
                message += `✅ ${special}\n`;
            });
            message += `\n`;
        }

        // Agregar ingredientes si existen
        if (allIngredients.length > 0) {
            message += `🌮 ${platform === 'whatsapp' ? '*' : ''}Sopes y Huaraches con:${platform === 'whatsapp' ? '*' : ''}\n`;
            allIngredients.forEach((ingredient, index) => {
                const emojis = ['🔵', '🟢', '🟡', '🟠', '🔴', '🟣', '⚫', '⚪', '🟤', '🔶'];
                message += `${emojis[index] || '✅'} ${ingredient}\n`;
            });
            message += `\n`;
        }

        // Agregar bebidas si existen
        if (allDrinks.length > 0) {
            message += `🥤 ${platform === 'whatsapp' ? '*' : ''}Bebidas:${platform === 'whatsapp' ? '*' : ''}\n`;
            allDrinks.forEach((drink) => {
                message += `🧊 ${drink.replace(' 🧊', '')}\n`;
            });
            message += `\n`;
        }

        // Información de contacto
        message += `${platform === 'whatsapp' ? '*' : ''}📍 Ubicación:${platform === 'whatsapp' ? '*' : ''} Coyuca de Benítez en casa de Nini.\n` +
                   `${platform === 'whatsapp' ? '*' : ''}🛵 Servicio a domicilio${platform === 'whatsapp' ? '*' : ''} (zona centro y colonias cercanas)\n` +
                   `${platform === 'whatsapp' ? '*' : ''}📲 Pedidos con anticipación${platform === 'whatsapp' ? '*' : ''}\n` +
                   `   ${platform === 'whatsapp' ? '*' : ''}¡Todo fresco y al momento!${platform === 'whatsapp' ? '*' : ''}\n` +
                   `   ${platform === 'whatsapp' ? '*' : ''}Llama o escribe al:${platform === 'whatsapp' ? '*' : ''}\n` +
                   `📲 781 109 3796\n\n`;

        return {
            message: message,
            config: config,
            dayType: dayType
        };
    }

    // Generar mensaje para WhatsApp
    function generateWhatsAppMessage() {
        const baseData = generateBaseMessage('whatsapp');
        if (baseData === '') return '';

        const { message, config, dayType } = baseData;
        
        let fullMessage = `${config.saludo}\n\n${config.titulo}\n\n${message}`;
        fullMessage += `🎉 ¡Dale sabor a tu ${dayType === 'domingo' ? 'tarde de domingo' : 'tarde'} con nosotros! 🤩🔥`;

        return fullMessage;
    }

    // Generar mensaje para Facebook
    function generateFacebookMessage() {
        const baseData = generateBaseMessage('facebook');
        if (baseData === '') return '';

        const { message, config, dayType } = baseData;
        
        let fullMessage = `${config.saludo}\n\n${config.titulo}\n\n${message}`;
        fullMessage += `🎉 ¡Dale sabor a tu ${dayType === 'domingo' ? 'tarde de domingo' : 'tarde'} con nosotros! 🤩🔥`;

        return fullMessage;
    }

    // Función para generar variantes de mensajes
    function generateMessageVariants(baseMessage, platform, dayType) {
        const variants = [];
        
        // Extraer el contenido principal (sin saludo y título)
        const lines = baseMessage.split('\n');
        const saludoIndex = lines.findIndex(line => line.includes('¡Buenas tardes'));
        const tituloIndex = lines.findIndex(line => line.includes('✨ ¡'));
        
        let mainContent = '';
        let saludo = '';
        let titulo = '';
        
        if (saludoIndex !== -1 && tituloIndex !== -1) {
            saludo = lines[saludoIndex];
            titulo = lines[tituloIndex];
            mainContent = lines.slice(tituloIndex + 2).join('\n'); // +2 para saltar línea vacía después del título
        } else {
            mainContent = baseMessage;
        }
        
        // Variante 1: Mensaje estándar (el original)
        variants.push({
            name: "Versión 1 - Original",
            content: baseMessage
        });
        
        // Variante 2: Mensaje más emotivo y personal
        let saludo2, titulo2;
        if (dayType === 'domingo') {
            saludo2 = '🌞 ¡Feliz domingo! 🙌🏻\n¿Listo para consentirte con los sabores más auténticos? 😋🍲';
            titulo2 = '✨ ¡Descubre nuestro menú dominguero! ✨';
        } else if (dayType === 'tarde') {
            saludo2 = '🌅 ¡Qué tal la tarde! 🙌🏻\nPerfecta para disfrutar de antojitos que alegran el alma… 😋🌮';
            titulo2 = '✨ ¡Nuestro menú de hoy te va a encantar! ✨';
        } else {
            saludo2 = '🎉 ¡Hoy es día de celebrar! 🙌🏻\nDéjate consentir con nuestros platillos especiales… 😋🍽️';
            titulo2 = '✨ ¡Menú especial para un día especial! ✨';
        }
        
        const variant2 = `${saludo2}\n\n${titulo2}\n\n${mainContent}`;
        variants.push({
            name: "Versión 2 - Emotiva",
            content: variant2
        });
        
        // Variante 3: Mensaje con enfoque en Coyuca y tradición
        let saludo3, titulo3;
        if (dayType === 'domingo') {
            saludo3 = '🏖️ ¡Domingo de tradición en Coyuca! 🙌🏻\nEl sabor auténtico que merece tu domingo… 😋🍲';
            titulo3 = '✨ ¡Sabores que hablan de nuestra tierra! ✨';
        } else if (dayType === 'tarde') {
            saludo3 = '🏖️ ¡Tarde coyunqueña! 🙌🏻\nDisfruta del verdadero sabor de Coyuca de Benítez… 😋🌮';
            titulo3 = '✨ ¡Tradición y sabor en cada bocado! ✨';
        } else {
            saludo3 = '🎉 ¡Celebra con lo mejor de Coyuca! 🙌🏻\nSabores que hacen especial cualquier ocasión… 😋🍽️';
            titulo3 = '✨ ¡Lo mejor de nuestra cocina para ti! ✨';
        }
        
        const variant3 = `${saludo3}\n\n${titulo3}\n\n${mainContent}`;
        variants.push({
            name: "Versión 3 - Tradición",
            content: variant3
        });
        
        return variants;
    }

    // Función para actualizar la interfaz con las variantes
    function updateVariantsInterface(whatsappVariants, facebookVariants, dayType) {
        // Limpiar selectores de variantes si existen
        const existingSelectors = document.querySelectorAll('.variant-selector');
        existingSelectors.forEach(selector => selector.remove());
        
        // Crear selector para variantes de WhatsApp
        const whatsappSelector = document.createElement('div');
        whatsappSelector.className = 'variant-selector';
        whatsappSelector.innerHTML = `
            <label for="whatsappVariant">🔄 Selecciona una versión para WhatsApp:</label>
            <select id="whatsappVariant" class="variant-dropdown">
                ${whatsappVariants.map((variant, index) => 
                    `<option value="${index}">${variant.name}</option>`
                ).join('')}
            </select>
            <button id="randomWhatsappBtn" class="random-variant-btn">🎲 Cambiar descripciones</button>
        `;
        
        // Insertar después del textarea de WhatsApp
        const whatsappTab = document.getElementById('whatsapp-tab');
        const whatsappTextarea = whatsappTab.querySelector('textarea');
        whatsappTextarea.parentNode.insertBefore(whatsappSelector, whatsappTextarea.nextSibling);
        
        // Crear selector para variantes de Facebook
        const facebookSelector = document.createElement('div');
        facebookSelector.className = 'variant-selector';
        facebookSelector.innerHTML = `
            <label for="facebookVariant">🔄 Selecciona una versión para Facebook:</label>
            <select id="facebookVariant" class="variant-dropdown">
                ${facebookVariants.map((variant, index) => 
                    `<option value="${index}">${variant.name}</option>`
                ).join('')}
            </select>
            <button id="randomFacebookBtn" class="random-variant-btn">🎲 Cambiar descripciones</button>
        `;
        
        // Insertar después del textarea de Facebook
        const facebookTab = document.getElementById('facebook-tab');
        const facebookTextarea = facebookTab.querySelector('textarea');
        facebookTextarea.parentNode.insertBefore(facebookSelector, facebookTextarea.nextSibling);
        
        // Actualizar textareas con la primera variante
        whatsappOutput.value = whatsappVariants[0].content;
        facebookOutput.value = facebookVariants[0].content;
        
        // Event listeners para selectores de WhatsApp
        const whatsappVariantSelect = document.getElementById('whatsappVariant');
        whatsappVariantSelect.addEventListener('change', function() {
            const selectedIndex = parseInt(this.value);
            whatsappOutput.value = whatsappVariants[selectedIndex].content;
        });
        
        const randomWhatsappBtn = document.getElementById('randomWhatsappBtn');
        randomWhatsappBtn.addEventListener('click', function() {
            const randomIndex = Math.floor(Math.random() * whatsappVariants.length);
            whatsappVariantSelect.value = randomIndex;
            whatsappOutput.value = whatsappVariants[randomIndex].content;
        });
        
        // Event listeners para selectores de Facebook
        const facebookVariantSelect = document.getElementById('facebookVariant');
        facebookVariantSelect.addEventListener('change', function() {
            const selectedIndex = parseInt(this.value);
            facebookOutput.value = facebookVariants[selectedIndex].content;
        });
        
        const randomFacebookBtn = document.getElementById('randomFacebookBtn');
        randomFacebookBtn.addEventListener('click', function() {
            const randomIndex = Math.floor(Math.random() * facebookVariants.length);
            facebookVariantSelect.value = randomIndex;
            facebookOutput.value = facebookVariants[randomIndex].content;
        });
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

        // Generar variantes
        const dayType = dayTypeSelect.value;
        const whatsappVariants = generateMessageVariants(whatsappMessage, 'whatsapp', dayType);
        const facebookVariants = generateMessageVariants(facebookMessage, 'facebook', dayType);

        // Actualizar la interfaz para mostrar variantes
        updateVariantsInterface(whatsappVariants, facebookVariants, dayType);

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