let patternData = [];

// Animate buttons on hover
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-3px)';
        btn.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
        btn.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    });
});

// Glow effect on analysis
function analyzeData() {
    // ... (previous code)
    document.getElementById('results').innerHTML = resultsHTML;
    
    // Add glow effect
    const resultsBox = document.getElementById('results');
    resultsBox.style.animation = 'glow 1.5s ease-in-out';
    setTimeout(() => { resultsBox.style.animation = ''; }, 1500);
}

function addData() {
    const accuracy = parseInt(document.getElementById('accuracy').value);
    const result = document.getElementById('result').value;
    const lastResult = document.getElementById('lastResult').value;
    
    if (accuracy >= 0 && accuracy <= 100) {
        patternData.push({ 
            accuracy, 
            result, 
            lastResult 
        });
        updateTable();
        // Clear accuracy field for new entry
        document.getElementById('accuracy').value = '';
    } else {
        alert("Please enter accuracy between 0-100%");
    }
}

function updateTable() {
    const tbody = document.querySelector('#dataTable tbody');
    tbody.innerHTML = '';
    
    patternData.forEach((data, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${data.accuracy}%</td>
            <td class="${data.result}">${data.result === 'win' ? '✅ Win' : '❌ Loss'}</td>
            <td class="${data.lastResult}">${data.lastResult === 'win' ? '✅ Win' : '❌ Loss'}</td>
        `;
        
        tbody.appendChild(row);
    });
}

function analyzeData() {
    if (patternData.length === 0) {
        document.getElementById('results').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-info-circle"></i> No data to analyze. Please add some pattern data first.
            </div>
        `;
        return;
    }

    // Accuracy analysis
    const accuracyRanges = [
        { name: "⭐ 80-100%", min: 80, max: 100, wins: 0, total: 0 },
        { name: "👍 70-79%", min: 70, max: 79, wins: 0, total: 0 },
        { name: "✋ 60-69%", min: 60, max: 69, wins: 0, total: 0 },
        { name: "⚠️ Below 60%", min: 0, max: 59, wins: 0, total: 0 }
    ];

    // Last result analysis
    const lastResultAnalysis = [
        { name: "After ✅ Win", value: "win", wins: 0, total: 0 },
        { name: "After ❌ Loss", value: "loss", wins: 0, total: 0 }
    ];

    patternData.forEach(data => {
        // Accuracy analysis
        for (const range of accuracyRanges) {
            if (data.accuracy >= range.min && data.accuracy <= range.max) {
                range.total++;
                if (data.result === 'win') range.wins++;
                break;
            }
        }

        // Last result analysis
        const lastResult = lastResultAnalysis.find(item => item.value === data.lastResult);
        if (lastResult) {
            lastResult.total++;
            if (data.result === 'win') lastResult.wins++;
        }
    });

    // Generate results HTML
    let resultsHTML = `
        <h3><i class="fas fa-chart-bar"></i> Accuracy Analysis</h3>
        ${accuracyRanges.map(range => {
            const rate = range.total > 0 ? Math.round((range.wins / range.total) * 100) : 0;
            const barWidth = rate > 0 ? rate : 5;
            return `
                <div class="result-item">
                    <div class="result-header">
                        <span class="result-label">${range.name}</span>
                        <span class="result-value">${range.wins}/${range.total} (${rate}%)</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${barWidth}%; background-color: ${rate > 70 ? '#4cc9f0' : rate > 50 ? '#ffd166' : '#f72585'};"></div>
                    </div>
                </div>
            `;
        }).join('')}

        <h3><i class="fas fa-project-diagram"></i> Pattern Continuation</h3>
        ${lastResultAnalysis.map(item => {
            const rate = item.total > 0 ? Math.round((item.wins / item.total) * 100) : 0;
            const barWidth = rate > 0 ? rate : 5;
            return `
                <div class="result-item">
                    <div class="result-header">
                        <span class="result-label">${item.name}</span>
                        <span class="result-value">${item.wins}/${item.total} (${rate}%)</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${barWidth}%; background-color: ${rate > 70 ? '#4cc9f0' : rate > 50 ? '#ffd166' : '#f72585'};"></div>
                    </div>
                </div>
            `;
        }).join('')}
    `;

    document.getElementById('results').innerHTML = resultsHTML;
}