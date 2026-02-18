// MatchOracle - Football Prediction AI Chatbot
class MatchOracle {
    constructor() {
        this.messages = [];
        this.isTyping = false;
        this.currentFixture = null;
        this.teamDatabase = this.initializeTeamDatabase();
        this.predictionModels = this.initializePredictionModels();
        this.dataSources = this.initializeDataSources();
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadChatHistory();
        this.loadUpcomingFixtures();
    }

    bindEvents() {
        // Send message on button click
        document.getElementById('sendBtn').addEventListener('click', () => {
            this.sendMessage();
        });

        // Send message on Enter key
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Header actions
        document.getElementById('minimizeBtn').addEventListener('click', () => {
            this.toggleMinimize();
        });

        document.getElementById('closeBtn').addEventListener('click', () => {
            this.closeChat();
        });

        // Floating chat button
        document.getElementById('floatingChatBtn').addEventListener('click', () => {
            this.openChat();
        });

        // Input action buttons
        document.getElementById('predictionBtn').addEventListener('click', () => {
            this.showPredictionModal();
        });

        document.getElementById('statsBtn').addEventListener('click', () => {
            this.handleTeamStats();
        });

        document.getElementById('newsBtn').addEventListener('click', () => {
            this.handleLatestNews();
        });

        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.searchTeams();
        });

        document.getElementById('teamSearch').addEventListener('input', (e) => {
            this.handleTeamSearch(e.target.value);
        });

        // Modal close
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closePredictionModal();
        });

        // Close modal on background click
        document.getElementById('predictionModal').addEventListener('click', (e) => {
            if (e.target.id === 'predictionModal') {
                this.closePredictionModal();
            }
        });
    }

    sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();

        if (!message || this.isTyping) return;

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Process message and generate response
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateFootballResponse(message);
            this.addMessage(response, 'bot');
        }, 1000 + Math.random() * 2000);
    }

    addMessage(content, sender, saveToHistory = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-futbol"></i>' : '<i class="fas fa-user"></i>';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        // Handle different content types
        if (typeof content === 'string') {
            const messageText = document.createElement('p');
            messageText.textContent = content;
            messageContent.appendChild(messageText);
        } else if (content.type === 'prediction') {
            messageContent.appendChild(this.createPredictionCard(content.data));
        } else if (content.type === 'fixture') {
            messageContent.appendChild(this.createFixtureCard(content.data));
        } else if (content.type === 'stats') {
            messageContent.appendChild(this.createStatsCard(content.data));
        }

        const messageTime = document.createElement('span');
        messageTime.className = 'message-time';
        messageTime.textContent = this.getCurrentTime();

        messageContent.appendChild(messageTime);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);

        const chatMessages = document.getElementById('chatMessages');
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Store message
        if (saveToHistory) {
            this.messages.push({
                content,
                sender,
                timestamp: new Date().toISOString()
            });
            this.saveChatHistory();
        }
    }

    generateFootballResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Fixture prediction requests
        if (this.containsAny(message, ['predict', 'prediction', 'forecast', 'outcome'])) {
            return this.handlePredictionRequest(message);
        }

        // Team information requests
        if (this.containsAny(message, ['team', 'squad', 'players', 'stats'])) {
            return this.handleTeamInfoRequest(message);
        }

        // League/fixture requests
        if (this.containsAny(message, ['fixtures', 'matches', 'schedule', 'upcoming'])) {
            return this.handleFixtureRequest(message);
        }

        // Form and statistics
        if (this.containsAny(message, ['form', 'recent', 'last', 'performance'])) {
            return this.handleFormRequest(message);
        }

        // Injury and news
        if (this.containsAny(message, ['injury', 'injured', 'news', 'update'])) {
            return this.handleNewsRequest(message);
        }

        // Help and capabilities
        if (this.containsAny(message, ['help', 'what can you do', 'capabilities'])) {
            return "I'm MatchOracle, your specialized AI for football predictions! I can analyze upcoming fixtures, provide match predictions with probabilities, team statistics, form analysis, injury updates, and explain the factors behind my predictions. Try asking about specific teams or upcoming matches!";
        }

        // Greeting responses
        if (this.containsAny(message, ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'])) {
            return this.getRandomResponse([
                "Hello! I'm MatchOracle, your football prediction AI. Which match would you like me to analyze?",
                "Hi there! Ready to dive into some football predictions? Ask me about any upcoming fixture!",
                "Hey! I'm here to help with football match analysis and predictions. What can I analyze for you?",
                "Greetings! I specialize in football predictions and match analysis. Which team or fixture interests you?"
            ]);
        }

        // Default responses with football context
        return this.getRandomResponse([
            "That's an interesting football question! Could you be more specific about which team or match you'd like me to analyze?",
            "I'd love to help with that football query! Try asking about a specific team, upcoming fixture, or prediction.",
            "Great question! I can provide detailed analysis on teams, fixtures, and predictions. What specific match interests you?",
            "I'm here to help with football analysis! Ask me about upcoming matches, team form, or get detailed predictions."
        ]);
    }

    handlePredictionRequest(message) {
        // Extract team names from message
        const teams = this.extractTeamNames(message);
        
        if (teams.length >= 2) {
            const fixture = this.findFixture(teams[0], teams[1]);
            if (fixture) {
                const prediction = this.generatePrediction(fixture);
                return {
                    type: 'prediction',
                    data: prediction
                };
            }
        }

        return "I'd love to make a prediction! Please specify the two teams playing (e.g., 'Predict Orlando Pirates vs Kaizer Chiefs').";
    }

    handleTeamInfoRequest(message) {
        const teamName = this.extractTeamName(message);
        if (teamName) {
            const team = this.findTeam(teamName);
            if (team) {
                return {
                    type: 'stats',
                    data: this.getTeamStats(team)
                };
            }
        }
        return "I can provide detailed team statistics! Please specify which team you'd like to know about (e.g., 'Orlando Pirates stats').";
    }

    handleFixtureRequest(message) {
        const fixtures = this.getUpcomingFixtures();
        return {
            type: 'fixture',
            data: {
                fixtures: fixtures.slice(0, 5),
                title: "Upcoming Fixtures"
            }
        };
    }

    handleFormRequest(message) {
        const teamName = this.extractTeamName(message);
        if (teamName) {
            const team = this.findTeam(teamName);
            if (team) {
                return `Here's the recent form for ${team.name}:\n\nLast 5 matches: ${team.form}\nHome form: ${team.homeForm}\nAway form: ${team.awayForm}\n\nCurrent position: ${team.position} in ${team.league}`;
            }
        }
        return "I can analyze team form! Please specify which team's recent performance you'd like to see.";
    }

    handleNewsRequest(message) {
        const teamName = this.extractTeamName(message);
        if (teamName) {
            const team = this.findTeam(teamName);
            if (team) {
                return `Latest news for ${team.name}:\n\n${team.news}\n\nInjury updates: ${team.injuries}`;
            }
        }
        return "I can provide the latest team news and injury updates! Which team's news would you like to see?";
    }

    generatePrediction(fixture) {
        const homeTeam = fixture.homeTeam;
        const awayTeam = fixture.awayTeam;
        
        // Calculate probabilities using ensemble models
        const homeWinProb = this.calculateHomeWinProbability(homeTeam, awayTeam);
        const drawProb = this.calculateDrawProbability(homeTeam, awayTeam);
        const awayWinProb = 1 - homeWinProb - drawProb;

        // Generate score distribution
        const scoreDistribution = this.generateScoreDistribution(homeTeam, awayTeam);
        
        // Calculate confidence
        const confidence = this.calculateConfidence(homeTeam, awayTeam);
        
        // Get top factors
        const topFactors = this.getTopFactors(homeTeam, awayTeam);

        return {
            fixture: fixture,
            predicted_probabilities: {
                home_win: Math.round(homeWinProb * 100) / 100,
                draw: Math.round(drawProb * 100) / 100,
                away_win: Math.round(awayWinProb * 100) / 100
            },
            score_distribution: scoreDistribution,
            expected_goals: {
                home: this.calculateExpectedGoals(homeTeam, 'home'),
                away: this.calculateExpectedGoals(awayTeam, 'away')
            },
            confidence: confidence,
            top_factors: topFactors,
            timestamp_utc: new Date().toISOString(),
            data_sources: ['Opta', 'Sportradar', 'NewsAPI']
        };
    }

    createPredictionCard(prediction) {
        const card = document.createElement('div');
        card.className = 'prediction-card';
        
        card.innerHTML = `
            <div class="prediction-header">
                <div class="match-teams">${prediction.fixture.homeTeam.name} vs ${prediction.fixture.awayTeam.name}</div>
                <div class="confidence-score">Confidence: ${prediction.confidence}%</div>
            </div>
            
            <div class="prediction-probabilities">
                <div class="prob-item">
                    <div class="prob-label">Home Win</div>
                    <div class="prob-value">${(prediction.predicted_probabilities.home_win * 100).toFixed(1)}%</div>
                </div>
                <div class="prob-item">
                    <div class="prob-label">Draw</div>
                    <div class="prob-value">${(prediction.predicted_probabilities.draw * 100).toFixed(1)}%</div>
                </div>
                <div class="prob-item">
                    <div class="prob-label">Away Win</div>
                    <div class="prob-value">${(prediction.predicted_probabilities.away_win * 100).toFixed(1)}%</div>
                </div>
            </div>
            
            <div class="score-distribution">
                <div class="score-dist-label">Most Likely Scores:</div>
                <div class="score-items">
                    ${prediction.score_distribution.slice(0, 3).map(score => 
                        `<div class="score-item">${score.score} (${(score.prob * 100).toFixed(1)}%)</div>`
                    ).join('')}
                </div>
            </div>
            
            <div class="prediction-factors">
                <div class="factors-label">Key Factors:</div>
                ${prediction.top_factors.map(factor => 
                    `<div class="factor-item">• ${factor.factor}: ${factor.explanation}</div>`
                ).join('')}
            </div>
            
            <div class="data-sources">
                Sources: ${prediction.data_sources.join(', ')} | ${new Date(prediction.timestamp_utc).toLocaleString()}
            </div>
        `;
        
        return card;
    }

    createFixtureCard(data) {
        const card = document.createElement('div');
        card.className = 'fixture-card';
        
        let fixturesHtml = data.fixtures.map(fixture => `
            <div class="fixture-item">
                <div class="fixture-teams">${fixture.homeTeam.name} vs ${fixture.awayTeam.name}</div>
                <div class="fixture-date">${new Date(fixture.date).toLocaleDateString()}</div>
                <div class="fixture-league">${fixture.league}</div>
            </div>
        `).join('');
        
        card.innerHTML = `
            <div class="fixture-header">
                <h4>${data.title}</h4>
            </div>
            <div class="fixture-list">
                ${fixturesHtml}
            </div>
        `;
        
        return card;
    }

    createStatsCard(data) {
        const card = document.createElement('div');
        card.className = 'team-stats';
        
        card.innerHTML = `
            <div class="stats-header">${data.team.name} Statistics</div>
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-label">Position</span>
                    <span class="stat-value">${data.team.position}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Points</span>
                    <span class="stat-value">${data.team.points}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Wins</span>
                    <span class="stat-value">${data.team.wins}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Draws</span>
                    <span class="stat-value">${data.team.draws}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Losses</span>
                    <span class="stat-value">${data.team.losses}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Goals For</span>
                    <span class="stat-value">${data.team.goalsFor}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Goals Against</span>
                    <span class="stat-value">${data.team.goalsAgainst}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Goal Difference</span>
                    <span class="stat-value">${data.team.goalDifference}</span>
                </div>
            </div>
        `;
        
        return card;
    }

    // Helper methods
    containsAny(str, keywords) {
        return keywords.some(keyword => str.includes(keyword));
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    extractTeamNames(message) {
        const teams = [];
        for (const team of Object.values(this.teamDatabase)) {
            if (message.toLowerCase().includes(team.name.toLowerCase()) || 
                message.toLowerCase().includes(team.nickname.toLowerCase())) {
                teams.push(team);
            }
        }
        return teams;
    }

    extractTeamName(message) {
        const teams = this.extractTeamNames(message);
        return teams.length > 0 ? teams[0] : null;
    }

    findTeam(teamName) {
        return Object.values(this.teamDatabase).find(team => 
            team.name.toLowerCase().includes(teamName.toLowerCase()) ||
            team.nickname.toLowerCase().includes(teamName.toLowerCase())
        );
    }

    findFixture(homeTeam, awayTeam) {
        // This would typically query a fixtures database
        // For now, return a mock fixture
        return {
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            league: 'PSL',
            venue: homeTeam.stadium
        };
    }

    calculateHomeWinProbability(homeTeam, awayTeam) {
        // Simplified probability calculation
        const homeElo = homeTeam.elo || 1500;
        const awayElo = awayTeam.elo || 1500;
        const eloDiff = homeElo - awayElo;
        const homeAdvantage = 0.1; // 10% home advantage
        
        return Math.max(0.1, Math.min(0.8, 0.5 + (eloDiff / 400) + homeAdvantage));
    }

    calculateDrawProbability(homeTeam, awayTeam) {
        // Draw probability based on team strength similarity
        const homeElo = homeTeam.elo || 1500;
        const awayElo = awayTeam.elo || 1500;
        const eloDiff = Math.abs(homeElo - awayElo);
        
        return Math.max(0.1, Math.min(0.4, 0.3 - (eloDiff / 1000)));
    }

    generateScoreDistribution(homeTeam, awayTeam) {
        const homeGoals = this.calculateExpectedGoals(homeTeam, 'home');
        const awayGoals = this.calculateExpectedGoals(awayTeam, 'away');
        
        const scores = [];
        for (let h = 0; h <= 4; h++) {
            for (let a = 0; a <= 4; a++) {
                const prob = this.poissonProbability(h, homeGoals) * this.poissonProbability(a, awayGoals);
                if (prob > 0.01) { // Only include probabilities > 1%
                    scores.push({
                        score: `${h}-${a}`,
                        prob: prob
                    });
                }
            }
        }
        
        return scores.sort((a, b) => b.prob - a.prob);
    }

    poissonProbability(k, lambda) {
        return Math.exp(-lambda) * Math.pow(lambda, k) / this.factorial(k);
    }

    factorial(n) {
        if (n <= 1) return 1;
        return n * this.factorial(n - 1);
    }

    calculateExpectedGoals(team, venue) {
        const baseGoals = venue === 'home' ? 1.2 : 1.0;
        const formFactor = this.getFormFactor(team);
        const eloFactor = (team.elo - 1500) / 1000;
        
        return Math.max(0.1, baseGoals + formFactor + eloFactor);
    }

    getFormFactor(team) {
        const form = team.form || 'WWLWD';
        const wins = (form.match(/W/g) || []).length;
        const draws = (form.match(/D/g) || []).length;
        const losses = (form.match(/L/g) || []).length;
        
        return (wins * 0.1 + draws * 0.05 - losses * 0.1);
    }

    calculateConfidence(homeTeam, awayTeam) {
        // Confidence based on data availability and team strength difference
        const dataQuality = 0.8; // Mock data quality score
        const eloDiff = Math.abs((homeTeam.elo || 1500) - (awayTeam.elo || 1500));
        const confidence = dataQuality * (1 - eloDiff / 2000) * 100;
        
        return Math.round(Math.max(50, Math.min(95, confidence)));
    }

    getTopFactors(homeTeam, awayTeam) {
        return [
            {
                factor: "Home Advantage",
                explanation: "Playing at home provides a 10% boost to win probability",
                impact: 0.1
            },
            {
                factor: "Recent Form",
                explanation: `${homeTeam.name} form: ${homeTeam.form || 'WWLWD'}`,
                impact: 0.15
            },
            {
                factor: "Head-to-Head",
                explanation: "Historical performance between these teams",
                impact: 0.1
            }
        ];
    }

    getTeamStats(team) {
        return {
            team: team,
            stats: {
                position: team.position,
                points: team.points,
                wins: team.wins,
                draws: team.draws,
                losses: team.losses,
                goalsFor: team.goalsFor,
                goalsAgainst: team.goalsAgainst,
                goalDifference: team.goalDifference
            }
        };
    }

    getUpcomingFixtures() {
        // Mock upcoming fixtures
        return [
            {
                homeTeam: this.teamDatabase.orlandoPirates,
                awayTeam: this.teamDatabase.kaizerChiefs,
                date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                league: 'PSL'
            },
            {
                homeTeam: this.teamDatabase.mamelodiSundowns,
                awayTeam: this.teamDatabase.supersportUnited,
                date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                league: 'PSL'
            }
        ];
    }

    // Initialize mock data
    initializeTeamDatabase() {
        return {
            orlandoPirates: {
                name: "Orlando Pirates",
                nickname: "Buccaneers",
                league: "PSL",
                position: 3,
                points: 24,
                wins: 7,
                draws: 3,
                losses: 4,
                goalsFor: 18,
                goalsAgainst: 12,
                goalDifference: 6,
                form: "WWLWD",
                homeForm: "WWWD",
                awayForm: "WLDL",
                elo: 1580,
                stadium: "Orlando Stadium",
                news: "Key striker returning from injury",
                injuries: "Midfielder out for 2 weeks"
            },
            kaizerChiefs: {
                name: "Kaizer Chiefs",
                nickname: "Amakhosi",
                league: "PSL",
                position: 5,
                points: 21,
                wins: 6,
                draws: 3,
                losses: 5,
                goalsFor: 15,
                goalsAgainst: 14,
                goalDifference: 1,
                form: "WDLWL",
                homeForm: "WWLD",
                awayForm: "DLWL",
                elo: 1520,
                stadium: "FNB Stadium",
                news: "New signing making debut",
                injuries: "No major injuries"
            },
            mamelodiSundowns: {
                name: "Mamelodi Sundowns",
                nickname: "Brazilians",
                league: "PSL",
                position: 1,
                points: 32,
                wins: 10,
                draws: 2,
                losses: 2,
                goalsFor: 25,
                goalsAgainst: 8,
                goalDifference: 17,
                form: "WWWWW",
                homeForm: "WWWW",
                awayForm: "WWWW",
                elo: 1680,
                stadium: "Loftus Versfeld",
                news: "Champions League preparation",
                injuries: "Defender doubtful"
            },
            supersportUnited: {
                name: "SuperSport United",
                nickname: "Matsatsantsa",
                league: "PSL",
                position: 4,
                points: 22,
                wins: 6,
                draws: 4,
                losses: 4,
                goalsFor: 16,
                goalsAgainst: 13,
                goalDifference: 3,
                form: "WDWLD",
                homeForm: "WWLD",
                awayForm: "DWLD",
                elo: 1550,
                stadium: "Lucas Moripe Stadium",
                news: "Manager contract extension",
                injuries: "Striker back in training"
            }
        };
    }

    initializePredictionModels() {
        return {
            elo: { weight: 0.3 },
            form: { weight: 0.25 },
            homeAdvantage: { weight: 0.2 },
            headToHead: { weight: 0.15 },
            injuries: { weight: 0.1 }
        };
    }

    initializeDataSources() {
        return {
            opta: { reliability: 0.9 },
            sportradar: { reliability: 0.85 },
            newsapi: { reliability: 0.8 }
        };
    }

    loadUpcomingFixtures() {
        // This would typically load from an API
        console.log("Loading upcoming fixtures...");
    }

    handleQuickAction(action) {
        switch (action) {
            case 'upcoming':
                this.addMessage("Here are the upcoming fixtures:", 'bot');
                const fixtures = this.getUpcomingFixtures();
                this.addMessage({
                    type: 'fixture',
                    data: { fixtures: fixtures, title: "Upcoming Fixtures" }
                }, 'bot');
                break;
            case 'psl':
                this.addMessage("PSL (Premier Soccer League) fixtures and predictions:", 'bot');
                break;
            case 'premier':
                this.addMessage("Premier League analysis and predictions:", 'bot');
                break;
            case 'help':
                this.addMessage("I'm MatchOracle, your football prediction AI! I can analyze fixtures, provide match predictions with probabilities, team statistics, and explain the factors behind my predictions. Try asking about specific teams or upcoming matches!", 'bot');
                break;
        }
    }

    showPredictionModal() {
        document.getElementById('predictionModal').classList.add('show');
    }

    closePredictionModal() {
        document.getElementById('predictionModal').classList.remove('show');
    }

    handleTeamStats() {
        this.addMessage("Which team's statistics would you like to see? (e.g., 'Orlando Pirates stats')", 'bot');
    }

    handleLatestNews() {
        this.addMessage("I can provide the latest team news and injury updates! Which team's news would you like to see?", 'bot');
    }

    searchTeams() {
        const searchTerm = document.getElementById('teamSearch').value.toLowerCase();
        this.handleTeamSearch(searchTerm);
    }

    handleTeamSearch(searchTerm) {
        const results = Object.values(this.teamDatabase).filter(team => 
            team.name.toLowerCase().includes(searchTerm) ||
            team.nickname.toLowerCase().includes(searchTerm)
        );

        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = '';

        if (searchTerm.length > 0) {
            results.slice(0, 5).forEach(team => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <div class="result-team">${team.name}</div>
                    <div class="result-league">${team.league}</div>
                `;
                resultItem.addEventListener('click', () => {
                    this.selectTeam(team);
                });
                resultsContainer.appendChild(resultItem);
            });
        }
    }

    selectTeam(team) {
        document.getElementById('teamSearch').value = '';
        document.getElementById('searchResults').innerHTML = '';
        this.addMessage(`Selected ${team.name}. What would you like to know about them?`, 'bot');
    }

    showTypingIndicator() {
        this.isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator-container';
        typingDiv.id = 'typingIndicator';

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = '<i class="fas fa-futbol"></i>';

        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;

        typingDiv.appendChild(avatar);
        typingDiv.appendChild(typingIndicator);

        const chatMessages = document.getElementById('chatMessages');
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    getCurrentTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');
        return `${displayHours}:${displayMinutes} ${ampm}`;
    }

    toggleMinimize() {
        const container = document.querySelector('.chatbot-container');
        container.style.display = container.style.display === 'none' ? 'flex' : 'none';
    }

    closeChat() {
        const container = document.querySelector('.chatbot-container');
        container.style.display = 'none';
        document.getElementById('floatingChatBtn').style.display = 'flex';
    }

    openChat() {
        const container = document.querySelector('.chatbot-container');
        container.style.display = 'flex';
        document.getElementById('floatingChatBtn').style.display = 'none';
    }

    saveChatHistory() {
        localStorage.setItem('matchoracleHistory', JSON.stringify(this.messages));
    }

    loadChatHistory() {
        const history = localStorage.getItem('matchoracleHistory');
        if (history) {
            this.messages = JSON.parse(history);
            // Optionally restore recent messages to UI
            const recentMessages = this.messages.slice(-3); // Last 3 messages
            recentMessages.forEach(msg => {
                this.addMessage(msg.content, msg.sender, false);
            });
        }
    }
}

// Initialize MatchOracle when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MatchOracle();
});

// Export utilities for external use
window.MatchOracleUtils = {
    exportChat: () => {
        const history = localStorage.getItem('matchoracleHistory');
        if (history) {
            const blob = new Blob([history], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'matchoracle-history.json';
            a.click();
            URL.revokeObjectURL(url);
        }
    },
    clearChat: () => {
        localStorage.removeItem('matchoracleHistory');
        location.reload();
    }
};