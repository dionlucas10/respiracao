// Configuração do SDK
        const defaultConfig = {
            site_title: "Sistema Cardiovascular",
            welcome_message: "Explore de forma interativa o sistema que mantém a vida funcionando!"
        };

        let currentSection = 'cardiovascular';
        let currentQuizSection = 'cardiovascular-quiz';
        let quizScores = {
            'cardiovascular-quiz': { score: 0, answered: 0 },
            'sangue-quiz': { score: 0, answered: 0 },
            'ciclo-quiz': { score: 0, answered: 0 },
            'nervoso-quiz': { score: 0, answered: 0 },
            'geral-quiz': { score: 0, answered: 0 }
        };
        let totalScore = 0;
        let totalQuestions = 0;

        // Inicialização do SDK
        if (window.elementSdk) {
            window.elementSdk.init({
                defaultConfig: defaultConfig,
                onConfigChange: async (config) => {
                    const titleElement = document.getElementById('siteTitle');
                    const messageElement = document.getElementById('welcomeMessage');
                    
                    if (titleElement) {
                        titleElement.textContent = config.site_title || defaultConfig.site_title;
                    }
                    if (messageElement) {
                        messageElement.textContent = config.welcome_message || defaultConfig.welcome_message;
                    }
                },
                mapToCapabilities: (config) => ({
                    recolorables: [],
                    borderables: [],
                    fontEditable: undefined,
                    fontSizeable: undefined
                }),
                mapToEditPanelValues: (config) => new Map([
                    ["site_title", config.site_title || defaultConfig.site_title],
                    ["welcome_message", config.welcome_message || defaultConfig.welcome_message]
                ])
            });
        }

        function showSection(sectionId) {
            // Esconder todas as seções
            const sections = document.querySelectorAll('.content-section');
            sections.forEach(section => {
                section.classList.remove('active');
            });

            // Remover classe active de todos os botões
            const buttons = document.querySelectorAll('.tab-button');
            buttons.forEach(button => {
                button.classList.remove('active');
            });

            // Mostrar seção selecionada
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Adicionar classe active ao botão clicado
            const activeButton = event.target;
            activeButton.classList.add('active');

            currentSection = sectionId;
            updateProgress();
        }

        function updateProgress() {
            const sections = ['cardiovascular', 'sangue', 'ciclo', 'nervoso', 'jogos', 'quiz'];
            const currentIndex = sections.indexOf(currentSection);
            const progress = ((currentIndex + 1) / sections.length) * 100;
            
            const progressFill = document.getElementById('progressFill');
            if (progressFill) {
                progressFill.style.width = progress + '%';
            }
        }

        function animateHeart() {
            const heart = document.querySelector('.heart-svg');
            const heartInfo = document.getElementById('heartInfo');
            const heartRate = document.getElementById('heartRate');
            
            heart.style.animation = 'none';
            setTimeout(() => {
                heart.style.animation = 'heartbeat 0.6s ease-in-out 5';
            }, 10);
            
            // Mostrar informações do coração
            heartInfo.style.display = 'block';
            
            // Simular variação da frequência cardíaca
            const rates = [68, 72, 75, 70, 73];
            let currentRate = 0;
            const rateInterval = setInterval(() => {
                heartRate.textContent = rates[currentRate];
                currentRate = (currentRate + 1) % rates.length;
            }, 500);
            
            setTimeout(() => {
                clearInterval(rateInterval);
                heartRate.textContent = '72';
            }, 3000);
        }

        function showCirculationFlow() {
            const flow = document.getElementById('circulationFlow');
            flow.style.display = 'block';
            
            const steps = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'];
            let currentStep = 0;
            
            // Resetar todos os steps
            steps.forEach(stepId => {
                document.getElementById(stepId).classList.remove('active');
            });
            
            const flowInterval = setInterval(() => {
                // Remover active do step anterior
                if (currentStep > 0) {
                    document.getElementById(steps[currentStep - 1]).classList.remove('active');
                }
                
                // Adicionar active ao step atual
                document.getElementById(steps[currentStep]).classList.add('active');
                
                currentStep++;
                
                if (currentStep >= steps.length) {
                    clearInterval(flowInterval);
                    setTimeout(() => {
                        steps.forEach(stepId => {
                            document.getElementById(stepId).classList.remove('active');
                        });
                        document.getElementById('step1').classList.add('active');
                    }, 1000);
                }
            }, 800);
        }

        function checkAnswer(element, isCorrect, quizSection) {
            // Desabilitar todas as opções da pergunta
            const question = element.closest('.quiz-question');
            const options = question.querySelectorAll('.quiz-option');
            
            options.forEach(option => {
                option.style.pointerEvents = 'none';
                if (option === element) {
                    if (isCorrect) {
                        option.classList.add('correct');
                        quizScores[quizSection].score++;
                        totalScore++;
                    } else {
                        option.classList.add('incorrect');
                    }
                } else if (option.onclick.toString().includes('true')) {
                    option.classList.add('correct');
                }
            });

            quizScores[quizSection].answered++;
            totalQuestions++;
            updateQuizStats();
            
            // Mostrar resultado da seção se todas as 5 questões foram respondidas
            if (quizScores[quizSection].answered === 5) {
                setTimeout(() => {
                    const sectionScore = quizScores[quizSection].score;
                    const percentage = (sectionScore / 5) * 100;
                    let message = '';
                    
                    if (percentage >= 80) {
                        message = `🎉 Excelente! Você acertou ${sectionScore}/5 questões (${percentage}%)`;
                    } else if (percentage >= 60) {
                        message = `👍 Bom trabalho! Você acertou ${sectionScore}/5 questões (${percentage}%)`;
                    } else {
                        message = `📚 Continue estudando! Você acertou ${sectionScore}/5 questões (${percentage}%)`;
                    }
                    
                    const resultDiv = document.createElement('div');
                    resultDiv.innerHTML = `
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                    color: white; padding: 20px; border-radius: 10px; 
                                    text-align: center; margin-top: 20px; font-size: 1.2rem;">
                            ${message}
                            <br><br>
                            <button onclick="resetQuizSection('${quizSection}')" style="background: white; color: #667eea; 
                                    border: none; padding: 10px 20px; border-radius: 5px; 
                                    cursor: pointer; font-weight: bold; margin-right: 10px;">
                                Tentar Novamente
                            </button>
                            <button onclick="showNextQuizSection()" style="background: #4299e1; color: white; 
                                    border: none; padding: 10px 20px; border-radius: 5px; 
                                    cursor: pointer; font-weight: bold;">
                                Próxima Seção
                            </button>
                        </div>
                    `;
                    
                    document.getElementById(quizSection).appendChild(resultDiv);
                }, 1000);
            }
        }

        function showQuizSection(sectionId) {
            // Esconder todas as seções do quiz
            const quizSections = document.querySelectorAll('.quiz-section');
            quizSections.forEach(section => {
                section.classList.remove('active');
            });

            // Remover classe active de todos os botões do quiz
            const quizButtons = document.querySelectorAll('.quiz-nav-btn');
            quizButtons.forEach(button => {
                button.classList.remove('active');
            });

            // Mostrar seção selecionada
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Adicionar classe active ao botão clicado
            const activeButton = event.target;
            activeButton.classList.add('active');

            currentQuizSection = sectionId;
        }

        function updateQuizStats() {
            document.getElementById('totalScore').textContent = totalScore;
            document.getElementById('totalQuestions').textContent = totalQuestions;
            
            const accuracy = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
            document.getElementById('accuracy').textContent = accuracy + '%';
        }

        function resetQuizSection(sectionId) {
            // Resetar pontuação da seção
            quizScores[sectionId] = { score: 0, answered: 0 };
            
            // Recalcular totais
            totalScore = 0;
            totalQuestions = 0;
            Object.values(quizScores).forEach(section => {
                totalScore += section.score;
                totalQuestions += section.answered;
            });
            
            updateQuizStats();
            
            // Resetar todas as opções da seção
            const section = document.getElementById(sectionId);
            const options = section.querySelectorAll('.quiz-option');
            options.forEach(option => {
                option.classList.remove('correct', 'incorrect');
                option.style.pointerEvents = 'auto';
            });
            
            // Remover resultado anterior
            const existingResult = section.querySelector('div[style*="background: linear-gradient"]');
            if (existingResult) {
                existingResult.remove();
            }
        }

        function showNextQuizSection() {
            const sections = ['cardiovascular-quiz', 'sangue-quiz', 'ciclo-quiz', 'nervoso-quiz', 'geral-quiz'];
            const currentIndex = sections.indexOf(currentQuizSection);
            const nextIndex = (currentIndex + 1) % sections.length;
            
            // Simular clique no próximo botão
            const nextButton = document.querySelectorAll('.quiz-nav-btn')[nextIndex];
            if (nextButton) {
                nextButton.click();
            }
        }

        // ===== FUNÇÕES DO SISTEMA NERVOSO =====
        function showNervousSystemDivision() {
            const division = document.getElementById('nervousDivision');
            division.style.display = 'block';
            
            const steps = ['snc-step', 'snp-step', 'encefalo-step', 'medula-step', 'nervos-step'];
            let currentStep = 0;
            
            // Resetar todos os steps
            steps.forEach(stepId => {
                document.getElementById(stepId).classList.remove('active');
            });
            
            const divisionInterval = setInterval(() => {
                // Remover active do step anterior
                if (currentStep > 0) {
                    document.getElementById(steps[currentStep - 1]).classList.remove('active');
                }
                
                // Adicionar active ao step atual
                document.getElementById(steps[currentStep]).classList.add('active');
                
                currentStep++;
                
                if (currentStep >= steps.length) {
                    clearInterval(divisionInterval);
                    setTimeout(() => {
                        steps.forEach(stepId => {
                            document.getElementById(stepId).classList.remove('active');
                        });
                        document.getElementById('snc-step').classList.add('active');
                    }, 1000);
                }
            }, 1000);
        }

        function showCranialNerves() {
            const nerves = document.getElementById('cranialNerves');
            nerves.style.display = 'block';
            
            const nerveItems = nerves.querySelectorAll('.nerve-item');
            nerveItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.animation = 'fadeIn 0.5s ease-in';
                    item.style.transform = 'translateX(5px)';
                    setTimeout(() => {
                        item.style.transform = 'translateX(0)';
                    }, 200);
                }, index * 100);
            });
        }

        // ===== JOGOS EDUCATIVOS =====

        // Variáveis globais dos jogos
        let memoryCards = [];
        let memoryFlippedCards = [];
        let memoryAttempts = 0;
        let memoryPairs = 0;
        let memoryTimer = null;
        let memoryStartTime = null;

        let heartRateInterval = null;
        let currentHeartRate = 72;

        let puzzleState = {};
        let draggedElement = null;

        let wordSearchGrid = [];
        let wordsFound = 0;
        let wordSearchWords = ['CORACAO', 'SANGUE', 'ARTERIA', 'VEIA', 'VALVA'];

        let speedQuizTimer = null;
        let speedQuizQuestions = [];
        let speedQuizCurrentQuestion = 0;
        let speedQuizScore = 0;
        let speedQuizTimeLeft = 60;

        let reflexTimer = null;
        let reflexStartTime = null;
        let reflexBestTime = null;
        let reflexTestActive = false;

        // ===== JOGO DA MEMÓRIA =====
        function startMemoryGame() {
            const symbols = ['💓', '🩸', '🫀', '🧠', '⚡', '🔬', '💊', '🏥'];
            const cards = [...symbols, ...symbols]; // Duplicar para pares
            
            // Embaralhar cartas
            for (let i = cards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [cards[i], cards[j]] = [cards[j], cards[i]];
            }
            
            memoryCards = cards;
            memoryFlippedCards = [];
            memoryAttempts = 0;
            memoryPairs = 0;
            memoryStartTime = Date.now();
            
            const board = document.getElementById('memoryBoard');
            board.innerHTML = '';
            
            cards.forEach((symbol, index) => {
                const card = document.createElement('div');
                card.className = 'memory-card';
                card.dataset.index = index;
                card.dataset.symbol = symbol;
                card.textContent = '?';
                card.onclick = () => flipMemoryCard(index);
                board.appendChild(card);
            });
            
            updateMemoryStats();
            
            // Iniciar timer
            memoryTimer = setInterval(updateMemoryTimer, 1000);
        }

        function flipMemoryCard(index) {
            if (memoryFlippedCards.length >= 2) return;
            
            const card = document.querySelector(`[data-index="${index}"]`);
            if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
            
            card.classList.add('flipped');
            card.textContent = card.dataset.symbol;
            memoryFlippedCards.push(index);
            
            if (memoryFlippedCards.length === 2) {
                memoryAttempts++;
                setTimeout(checkMemoryMatch, 1000);
            }
        }

        function checkMemoryMatch() {
            const [first, second] = memoryFlippedCards;
            const firstCard = document.querySelector(`[data-index="${first}"]`);
            const secondCard = document.querySelector(`[data-index="${second}"]`);
            
            if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
                firstCard.classList.add('matched');
                secondCard.classList.add('matched');
                memoryPairs++;
                
                if (memoryPairs === 8) {
                    clearInterval(memoryTimer);
                    setTimeout(() => {
                        const time = Math.floor((Date.now() - memoryStartTime) / 1000);
                        const message = `🎉 Parabéns! Você completou em ${time}s com ${memoryAttempts} tentativas!`;
                        const board = document.getElementById('memoryBoard');
                        board.innerHTML = `<div style="text-align: center; padding: 20px; font-size: 1.2rem;">${message}</div>`;
                    }, 500);
                }
            } else {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                firstCard.textContent = '?';
                secondCard.textContent = '?';
            }
            
            memoryFlippedCards = [];
            updateMemoryStats();
        }

        function updateMemoryStats() {
            document.getElementById('memoryAttempts').textContent = memoryAttempts;
            document.getElementById('memoryPairs').textContent = `${memoryPairs}/8`;
        }

        function updateMemoryTimer() {
            if (memoryStartTime) {
                const elapsed = Math.floor((Date.now() - memoryStartTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                document.getElementById('memoryTime').textContent = 
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }

        // ===== SIMULADOR DE BATIMENTOS =====
        function updateHeartRate(rate) {
            currentHeartRate = parseInt(rate);
            document.getElementById('bpmDisplay').textContent = `${currentHeartRate} BPM`;
            
            // Atualizar estado e condição
            let state, condition;
            if (currentHeartRate < 60) {
                state = 'Bradicardia';
                condition = 'Abaixo do normal';
            } else if (currentHeartRate <= 100) {
                state = 'Normal';
                condition = currentHeartRate < 80 ? 'Repouso' : 'Ativo';
            } else if (currentHeartRate <= 150) {
                state = 'Taquicardia';
                condition = 'Exercício leve';
            } else {
                state = 'Taquicardia severa';
                condition = 'Exercício intenso';
            }
            
            document.getElementById('heartState').textContent = state;
            document.getElementById('heartCondition').textContent = condition;
            
            // Atualizar animação do coração
            const heart = document.getElementById('simHeart');
            clearInterval(heartRateInterval);
            
            const interval = 60000 / currentHeartRate; // ms entre batimentos
            heart.style.animation = `heartbeat ${interval/1000}s ease-in-out infinite`;
        }

        // ===== QUEBRA-CABEÇA CIRCULATÓRIO =====
        function initializePuzzle() {
            const pieces = document.querySelectorAll('.puzzle-piece');
            const slots = document.querySelectorAll('.target-slot');
            
            pieces.forEach(piece => {
                piece.addEventListener('dragstart', handleDragStart);
                piece.addEventListener('dragend', handleDragEnd);
            });
            
            slots.forEach(slot => {
                slot.addEventListener('dragover', handleDragOver);
                slot.addEventListener('drop', handleDrop);
            });
        }

        function handleDragStart(e) {
            draggedElement = e.target;
            e.target.classList.add('dragging');
        }

        function handleDragEnd(e) {
            e.target.classList.remove('dragging');
            draggedElement = null;
        }

        function handleDragOver(e) {
            e.preventDefault();
            e.target.classList.add('drag-over');
        }

        function handleDrop(e) {
            e.preventDefault();
            e.target.classList.remove('drag-over');
            
            if (draggedElement && e.target.classList.contains('target-slot')) {
                const correctValue = e.target.dataset.correct;
                const pieceValue = draggedElement.dataset.value;
                
                if (correctValue === pieceValue) {
                    e.target.textContent = draggedElement.textContent;
                    e.target.classList.add('filled');
                    draggedElement.style.display = 'none';
                    
                    checkPuzzleCompletion();
                } else {
                    // Feedback visual de erro
                    e.target.style.background = 'rgba(244, 67, 54, 0.6)';
                    setTimeout(() => {
                        e.target.style.background = '';
                    }, 500);
                }
            }
        }

        function checkPuzzleCompletion() {
            const filledSlots = document.querySelectorAll('.target-slot.filled');
            if (filledSlots.length === 6) {
                document.getElementById('puzzleResult').innerHTML = 
                    '🎉 Parabéns! Você montou corretamente o ciclo circulatório!';
            }
        }

        function resetPuzzle() {
            const slots = document.querySelectorAll('.target-slot');
            const pieces = document.querySelectorAll('.puzzle-piece');
            
            slots.forEach((slot, index) => {
                slot.classList.remove('filled');
                slot.textContent = index === 0 ? '1. Início' : index === 5 ? '6. Final' : `${index + 1}. ?`;
            });
            
            pieces.forEach(piece => {
                piece.style.display = 'block';
            });
            
            document.getElementById('puzzleResult').innerHTML = '';
        }

        // ===== CAÇA-PALAVRAS =====
        function generateWordSearch() {
            const gridSize = 10;
            wordSearchGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
            wordsFound = 0;
            
            // Colocar palavras na grade
            wordSearchWords.forEach(word => {
                placeWordInGrid(word, gridSize);
            });
            
            // Preencher espaços vazios com letras aleatórias
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    if (wordSearchGrid[i][j] === '') {
                        wordSearchGrid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                    }
                }
            }
            
            // Renderizar grade
            const grid = document.getElementById('wordGrid');
            grid.innerHTML = '';
            
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    const cell = document.createElement('div');
                    cell.className = 'word-cell';
                    cell.textContent = wordSearchGrid[i][j];
                    cell.dataset.row = i;
                    cell.dataset.col = j;
                    cell.onclick = () => selectWordCell(i, j);
                    grid.appendChild(cell);
                }
            }
            
            // Resetar lista de palavras
            document.querySelectorAll('.word-item').forEach(item => {
                item.classList.remove('found');
            });
            
            updateWordSearchScore();
        }

        function placeWordInGrid(word, gridSize) {
            const directions = [
                [0, 1],   // horizontal
                [1, 0],   // vertical
                [1, 1],   // diagonal
                [-1, 1]   // diagonal reversa
            ];
            
            let placed = false;
            let attempts = 0;
            
            while (!placed && attempts < 100) {
                const direction = directions[Math.floor(Math.random() * directions.length)];
                const startRow = Math.floor(Math.random() * gridSize);
                const startCol = Math.floor(Math.random() * gridSize);
                
                if (canPlaceWord(word, startRow, startCol, direction, gridSize)) {
                    for (let i = 0; i < word.length; i++) {
                        const row = startRow + i * direction[0];
                        const col = startCol + i * direction[1];
                        wordSearchGrid[row][col] = word[i];
                    }
                    placed = true;
                }
                attempts++;
            }
        }

        function canPlaceWord(word, startRow, startCol, direction, gridSize) {
            for (let i = 0; i < word.length; i++) {
                const row = startRow + i * direction[0];
                const col = startCol + i * direction[1];
                
                if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
                    return false;
                }
                
                if (wordSearchGrid[row][col] !== '' && wordSearchGrid[row][col] !== word[i]) {
                    return false;
                }
            }
            return true;
        }

        function selectWordCell(row, col) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cell.classList.toggle('selected');
            
            // Verificar se uma palavra foi selecionada
            checkSelectedWord();
        }

        function checkSelectedWord() {
            const selectedCells = document.querySelectorAll('.word-cell.selected');
            const selectedText = Array.from(selectedCells).map(cell => cell.textContent).join('');
            
            wordSearchWords.forEach(word => {
                if (selectedText === word || selectedText === word.split('').reverse().join('')) {
                    selectedCells.forEach(cell => {
                        cell.classList.remove('selected');
                        cell.classList.add('found');
                    });
                    
                    const wordItem = document.querySelector(`[data-word="${word}"]`);
                    if (wordItem && !wordItem.classList.contains('found')) {
                        wordItem.classList.add('found');
                        wordsFound++;
                        updateWordSearchScore();
                        
                        if (wordsFound === wordSearchWords.length) {
                            setTimeout(() => {
                                const grid = document.getElementById('wordGrid');
                                grid.innerHTML += '<div style="grid-column: 1/-1; text-align: center; padding: 20px; font-size: 1.2rem;">🎉 Parabéns! Todas as palavras encontradas!</div>';
                            }, 500);
                        }
                    }
                }
            });
        }

        function updateWordSearchScore() {
            document.getElementById('wordsFound').textContent = `${wordsFound}/${wordSearchWords.length}`;
        }

        // ===== QUIZ RELÂMPAGO =====
        function initializeSpeedQuiz() {
            speedQuizQuestions = [
                {
                    question: "Qual é a função principal do coração?",
                    options: ["Filtrar sangue", "Bombear sangue", "Produzir sangue", "Armazenar sangue"],
                    correct: 1
                },
                {
                    question: "Quantas câmaras tem o coração humano?",
                    options: ["2", "3", "4", "5"],
                    correct: 2
                },
                {
                    question: "Qual gás é transportado pelos glóbulos vermelhos?",
                    options: ["Nitrogênio", "Oxigênio", "Hidrogênio", "Carbono"],
                    correct: 1
                },
                {
                    question: "Qual é a frequência cardíaca normal em repouso?",
                    options: ["40-60 bpm", "60-100 bpm", "100-120 bpm", "120-140 bpm"],
                    correct: 1
                },
                {
                    question: "Qual valva separa o átrio esquerdo do ventrículo esquerdo?",
                    options: ["Tricúspide", "Pulmonar", "Mitral", "Aórtica"],
                    correct: 2
                },
                {
                    question: "O que é hemoglobina?",
                    options: ["Proteína que transporta oxigênio", "Tipo de célula", "Hormônio", "Enzima"],
                    correct: 0
                },
                {
                    question: "Qual é o maior vaso sanguíneo do corpo?",
                    options: ["Veia cava", "Artéria pulmonar", "Aorta", "Artéria carótida"],
                    correct: 2
                }
            ];
        }

        function startSpeedQuiz() {
            speedQuizScore = 0;
            speedQuizTimeLeft = 60;
            speedQuizCurrentQuestion = 0;
            
            document.getElementById('speedScore').textContent = speedQuizScore;
            document.getElementById('timerDisplay').textContent = speedQuizTimeLeft;
            document.getElementById('speedQuizBtn').style.display = 'none';
            document.getElementById('speedQuestion').style.display = 'block';
            document.getElementById('speedResult').innerHTML = '';
            
            // Embaralhar questões
            for (let i = speedQuizQuestions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [speedQuizQuestions[i], speedQuizQuestions[j]] = [speedQuizQuestions[j], speedQuizQuestions[i]];
            }
            
            showSpeedQuestion();
            
            speedQuizTimer = setInterval(() => {
                speedQuizTimeLeft--;
                document.getElementById('timerDisplay').textContent = speedQuizTimeLeft;
                
                if (speedQuizTimeLeft <= 10) {
                    document.querySelector('.timer-circle').classList.add('warning');
                }
                
                if (speedQuizTimeLeft <= 0) {
                    endSpeedQuiz();
                }
            }, 1000);
        }

        function showSpeedQuestion() {
            if (speedQuizCurrentQuestion >= speedQuizQuestions.length) {
                speedQuizCurrentQuestion = 0; // Recomeçar questões
            }
            
            const question = speedQuizQuestions[speedQuizCurrentQuestion];
            document.getElementById('speedQuestionText').textContent = question.question;
            
            const optionsContainer = document.getElementById('speedOptions');
            optionsContainer.innerHTML = '';
            
            question.options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'speed-option';
                optionElement.textContent = option;
                optionElement.onclick = () => answerSpeedQuestion(index, question.correct);
                optionsContainer.appendChild(optionElement);
            });
        }

        function answerSpeedQuestion(selectedIndex, correctIndex) {
            const options = document.querySelectorAll('.speed-option');
            
            options.forEach((option, index) => {
                option.onclick = null; // Desabilitar cliques
                if (index === correctIndex) {
                    option.classList.add('correct');
                } else if (index === selectedIndex) {
                    option.classList.add('incorrect');
                }
            });
            
            if (selectedIndex === correctIndex) {
                speedQuizScore++;
                document.getElementById('speedScore').textContent = speedQuizScore;
            }
            
            setTimeout(() => {
                speedQuizCurrentQuestion++;
                showSpeedQuestion();
            }, 1000);
        }

        function endSpeedQuiz() {
            clearInterval(speedQuizTimer);
            document.querySelector('.timer-circle').classList.remove('warning');
            document.getElementById('speedQuestion').style.display = 'none';
            document.getElementById('speedQuizBtn').style.display = 'block';
            document.getElementById('speedQuizBtn').textContent = '🚀 Jogar Novamente';
            
            let message = '';
            if (speedQuizScore >= 15) {
                message = `🏆 Excelente! ${speedQuizScore} pontos - Você é um expert!`;
            } else if (speedQuizScore >= 10) {
                message = `👍 Muito bom! ${speedQuizScore} pontos - Continue estudando!`;
            } else if (speedQuizScore >= 5) {
                message = `📚 Bom esforço! ${speedQuizScore} pontos - Pratique mais!`;
            } else {
                message = `💪 Continue tentando! ${speedQuizScore} pontos - Você vai melhorar!`;
            }
            
            document.getElementById('speedResult').innerHTML = message;
        }

        // ===== SIMULADOR DE REFLEXOS =====
        function startReflexTest() {
            if (reflexTestActive) return;
            
            reflexTestActive = true;
            const circle = document.getElementById('reflexCircle');
            const text = document.getElementById('reflexText');
            
            // Reset visual
            circle.className = 'reflex-circle waiting';
            text.textContent = 'Aguarde...';
            
            // Tempo aleatório entre 2-6 segundos
            const waitTime = Math.random() * 4000 + 2000;
            
            reflexTimer = setTimeout(() => {
                if (reflexTestActive) {
                    circle.className = 'reflex-circle ready';
                    text.textContent = 'CLIQUE AGORA!';
                    reflexStartTime = Date.now();
                    
                    // Auto-timeout após 2 segundos
                    setTimeout(() => {
                        if (reflexTestActive && reflexStartTime) {
                            endReflexTest('timeout');
                        }
                    }, 2000);
                }
            }, waitTime);
            
            // Adicionar listener para clique
            circle.onclick = handleReflexClick;
        }

        function handleReflexClick() {
            if (!reflexTestActive) return;
            
            const circle = document.getElementById('reflexCircle');
            const text = document.getElementById('reflexText');
            
            if (!reflexStartTime) {
                // Clicou muito cedo
                endReflexTest('early');
            } else {
                // Clicou na hora certa
                const reactionTime = Date.now() - reflexStartTime;
                endReflexTest('success', reactionTime);
            }
        }

        function endReflexTest(result, reactionTime = null) {
            reflexTestActive = false;
            clearTimeout(reflexTimer);
            
            const circle = document.getElementById('reflexCircle');
            const text = document.getElementById('reflexText');
            const reactionDisplay = document.getElementById('reactionTime');
            const bestDisplay = document.getElementById('bestTime');
            
            circle.onclick = null;
            
            if (result === 'early') {
                circle.className = 'reflex-circle too-early';
                text.textContent = 'Muito cedo!';
                reactionDisplay.textContent = '-- ms';
            } else if (result === 'timeout') {
                circle.className = 'reflex-circle';
                text.textContent = 'Muito lento!';
                reactionDisplay.textContent = '> 2000 ms';
            } else if (result === 'success') {
                circle.className = 'reflex-circle';
                text.textContent = getReflexCategory(reactionTime);
                reactionDisplay.textContent = reactionTime + ' ms';
                
                // Atualizar melhor tempo
                if (!reflexBestTime || reactionTime < reflexBestTime) {
                    reflexBestTime = reactionTime;
                    bestDisplay.textContent = reflexBestTime + ' ms';
                }
            }
            
            reflexStartTime = null;
            
            // Reset após 3 segundos
            setTimeout(() => {
                circle.className = 'reflex-circle';
                text.textContent = 'Clique para começar';
            }, 3000);
        }

        function getReflexCategory(time) {
            if (time < 200) return 'Excelente! 🏆';
            if (time < 300) return 'Bom! 👍';
            if (time < 400) return 'Médio 📊';
            return 'Lento 🐌';
        }

        function resetReflexTest() {
            reflexTestActive = false;
            clearTimeout(reflexTimer);
            reflexStartTime = null;
            reflexBestTime = null;
            
            const circle = document.getElementById('reflexCircle');
            const text = document.getElementById('reflexText');
            
            circle.className = 'reflex-circle';
            text.textContent = 'Clique para começar';
            circle.onclick = null;
            
            document.getElementById('reactionTime').textContent = '-- ms';
            document.getElementById('bestTime').textContent = '-- ms';
        }

        // Inicializar jogos quando a página carregar
        document.addEventListener('DOMContentLoaded', function() {
            initializePuzzle();
            initializeSpeedQuiz();
            generateWordSearch();
        });

        // Função para expandir cards
        function expandCard(card) {
            const expandedContent = card.querySelector('.expanded-content');
            const cardAction = card.querySelector('.card-action');
            
            if (expandedContent.style.display === 'none') {
                expandedContent.style.display = 'block';
                expandedContent.style.animation = 'fadeIn 0.5s ease-in';
                cardAction.textContent = 'Recolher';
                card.style.minHeight = 'auto';
            } else {
                expandedContent.style.display = 'none';
                cardAction.textContent = cardAction.textContent.includes('Explorar') ? 'Explorar' : 
                                       cardAction.textContent.includes('Ver') ? 'Ver Fluxo' :
                                       cardAction.textContent.includes('Detalhes') ? 'Detalhes' :
                                       cardAction.textContent.includes('Escutar') ? 'Escutar' :
                                       cardAction.textContent.includes('Estudar') ? 'Estudar' : 'Genética';
                card.style.minHeight = '280px';
            }
        }

        // Inicializar progresso
        updateProgress();
        updateQuizStats();