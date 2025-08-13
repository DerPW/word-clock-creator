// Preview-Settings Tabs und Zeit-Highlighting
window.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    // Preview-Settings Tabs
    const previewTabSettings = document.getElementById('previewTabSettings');
    const previewTabTime = document.getElementById('previewTabTime');
    const previewSettingsGeneral = document.getElementById('previewSettingsGeneral');
    const previewSettingsTime = document.getElementById('previewSettingsTime');
    if (previewTabSettings && previewTabTime && previewSettingsGeneral && previewSettingsTime) {
        previewTabSettings.addEventListener('click', function() {
            previewTabSettings.classList.add('active');
            previewTabTime.classList.remove('active');
            previewSettingsGeneral.style.display = '';
            previewSettingsTime.style.display = 'none';
            renderClockPreview();
        });
        previewTabTime.addEventListener('click', function() {
            previewTabTime.classList.add('active');
            previewTabSettings.classList.remove('active');
            previewSettingsGeneral.style.display = 'none';
            previewSettingsTime.style.display = '';
            renderClockPreview();
        });
    }
    // Zeit- und Highlight-Änderungen triggern Preview
    const previewTime = document.getElementById('previewTime');
    const highlightColor = document.getElementById('highlightColor');
    // Setze Standardzeit auf aktuelle Uhrzeit (ohne Rundung)
    if (previewTime && !previewTime.value) {
        const now = new Date();
        const h = now.getHours();
        const m = now.getMinutes();
        previewTime.value = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        renderClockPreview();
    }
    [previewTime, highlightColor].forEach(el => {
        if (el) {
            el.addEventListener('input', function() { renderClockPreview(); });
            el.addEventListener('change', function() { renderClockPreview(); });
        }
    });
});
// Grid mit X füllen (Test-Button)
window.addEventListener('DOMContentLoaded', function() {
    // Nur leere Zellen mit X füllen
    const fillEmptyBtn = document.getElementById('fillEmptyWithX');
    if (fillEmptyBtn) {
        fillEmptyBtn.addEventListener('click', function() {
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    if (!grid[i][j] || grid[i][j] === ' ') {
                        grid[i][j] = 'X';
                    }
                }
            }
            renderGrid();
            updateChecklist();
        });
    }
    // Grid leeren Button
    const clearBtn = document.getElementById('clearGrid');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    grid[i][j] = '';
                }
            }
            renderGrid();
            updateChecklist();
        });
    }
});
// Tab-Switching und Preview-Logik
window.addEventListener('DOMContentLoaded', function() {
    // Tab-Switching
    const tabEditor = document.getElementById('tabEditor');
    const tabPreview = document.getElementById('tabPreview');
    const tabContentEditor = document.getElementById('tabContentEditor');
    const tabContentPreview = document.getElementById('tabContentPreview');
    if (tabEditor && tabPreview && tabContentEditor && tabContentPreview) {
        tabEditor.addEventListener('click', function() {
            tabEditor.classList.add('active');
            tabPreview.classList.remove('active');
            tabContentEditor.style.display = '';
            tabContentPreview.style.display = 'none';
        });
        tabPreview.addEventListener('click', function() {
            tabPreview.classList.add('active');
            tabEditor.classList.remove('active');
            tabContentEditor.style.display = 'none';
            tabContentPreview.style.display = '';
            renderClockPreview();
        });
    }

    // Preview-Einstellungen
    const clockBgColor = document.getElementById('clockBgColor');
    const clockPadding = document.getElementById('clockPadding');
    const clockFont = document.getElementById('clockFont');
    const clockRadius = document.getElementById('clockRadius');
    const clockLetterSpacing = document.getElementById('clockLetterSpacing');
    const clockEffect = document.getElementById('clockEffect');
    [clockBgColor, clockPadding, clockFont, clockRadius, clockLetterSpacing, clockEffect].forEach(el => {
        if (el) {
            el.addEventListener('input', function() {
                renderClockPreview();
            });
            el.addEventListener('change', function() {
                renderClockPreview();
            });
        }
    });
});

function renderClockPreview() {
    const clockPreview = document.getElementById('clockPreview');
    if (!clockPreview) return;
    const color = document.getElementById('clockBgColor')?.value || '#222';
    const padding = parseInt(document.getElementById('clockPadding')?.value || '40', 10);
    const font = document.getElementById('clockFont')?.value || "'Courier New', Courier, monospace";
    const radius = parseInt(document.getElementById('clockRadius')?.value || '18', 10);
    const previewTime = document.getElementById('previewTime')?.value;
    const highlightColor = document.getElementById('highlightColor')?.value || '#ffe600';
    clockPreview.style.background = color;
    clockPreview.style.padding = padding + 'px';
    clockPreview.style.borderRadius = radius + 'px';
    clockPreview.style.setProperty('--highlight-color', highlightColor);
    // Wert aus Select direkt als fontFamily übernehmen (muss vollständiger Font-Family-String sein)
    clockPreview.style.fontFamily = font;
    // Buchstabenabstand anwenden
    const letterSpacing = document.getElementById('clockLetterSpacing')?.value || '0.1';
    clockPreview.style.letterSpacing = letterSpacing + 'em';

    // Zeit-Highlighting: Ermittle Wörter, die für die Uhrzeit leuchten sollen
    let highlightMap = [];
    if (previewTime) {
        const [h, m] = previewTime.split(':').map(Number);
        highlightMap = getWordclockHighlightMap(h, m);
    }

    // Effekt-Option auslesen
    const effect = document.getElementById('clockEffect')?.value || 'none';

    // Grid als Tabelle, nicht editierbar, keine Gridlines
    let html = `<table>`;
    for (let i = 0; i < rows; i++) {
        html += '<tr>';
        for (let j = 0; j < cols; j++) {
            const letter = grid[i] && grid[i][j] ? grid[i][j] : '';
            let cellClass = '';
            let keyCount = Object.keys(highlightMap).length;
            if (keyCount > 0) {
                // Prüfe, ob dieses Feld zu einem leuchtenden Wort gehört
                let found = false;
                for (const word of highlightMap) {
                    for (const pos of word.positions) {
                        if (pos[0] === i && pos[1] === j) { found = true; break; }
                    }
                    if (found) break;
                }
                if (found) {
                    cellClass = 'highlight' + (effect === 'rainbow' ? ' rainbow' : '');
                } else {
                    cellClass = 'dimmed';
                }
            }
            html += `<td class="${cellClass}">${letter ? letter : '&nbsp;'}</td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    clockPreview.innerHTML = html;
}

// Gibt ein Mapping von Wort zu Buchstaben-Positionen zurück, die für die Uhrzeit leuchten sollen
function getWordclockHighlightMap(hour, minute) {
    // Deutsche Wordclock-Logik
    const words = ["ES", "IST"];
    const hourWords = ["EINS", "ZWEI", "DREI", "VIER", "FÜNF", "SECHS", "SIEBEN", "ACHT", "NEUN", "ZEHN", "ELF", "ZWÖLF"];
    let h = hour % 12;
    if (h === 0) h = 12;
    let nextHour = (h % 12) + 1;
    if (nextHour === 13) nextHour = 1;
    // Minuten auf 5er Schritte runden
    let m = Math.round(minute / 5) * 5;
    if (m === 60) {
        m = 0;
        h = nextHour;
        nextHour = (h % 12) + 1;
        if (nextHour === 13) nextHour = 1;
    }
    // Wörter für die aktuelle Zeit bestimmen
    if (m === 0) {
        if (h === 1) {
            words.push("EIN");
        } else {
            words.push(hourWords[h-1]);
        }
        words.push("UHR");
    } else if (m === 5) {
        words.push("FÜNF", "NACH", hourWords[h-1]);
    } else if (m === 10) {
        words.push("ZEHN", "NACH", hourWords[h-1]);
    } else if (m === 15) {
        words.push("VIERTEL", "NACH", hourWords[h-1]);
    } else if (m === 20) {
        words.push("ZWANZIG", "NACH", hourWords[h-1]);
    } else if (m === 25) {
        words.push("FÜNF", "VOR", "HALB", hourWords[nextHour-1]);
    } else if (m === 30) {
        words.push("HALB", hourWords[nextHour-1]);
    } else if (m === 35) {
        words.push("FÜNF", "NACH", "HALB", hourWords[nextHour-1]);
    } else if (m === 40) {
        words.push("ZWANZIG", "VOR", hourWords[nextHour-1]);
    } else if (m === 45) {
        words.push("VIERTEL", "VOR", hourWords[nextHour-1]);
    } else if (m === 50) {
        words.push("ZEHN", "VOR", hourWords[nextHour-1]);
    } else if (m === 55) {
        words.push("FÜNF", "VOR", hourWords[nextHour-1]);
    }

    // Mapping: Wort -> alle Buchstaben-Positionen im Grid
    const map = [];
    var ten = -1;
    for (const word of words) {
        var pos = 0;
        var ten_count = findWordCount(words, "ZEHN");
        if(word == "ZEHN") {
            if(ten_count == 1 && words[3] == "UHR"){
                ten = 1;
            }
            else if(ten_count == 1 && words[2] != "ZEHN") {
                ten = 1;
            }
            else if(ten_count == 1 ) {
                ten = 0;
            }
            else {
                ten++;
            }
            pos = ten;
        }
        const positions = findAllWordPositionsInGrid(grid, word);
        if (positions.length > 0) {
            map.push({ word: word, positions: positions[pos] });
        }
    }
    console.log(map);
    return map;
}

function findWordCount(words, word){
    return words.filter(w => w === word).length;
}

// Gibt alle Buchstaben-Positionen aller Vorkommen eines Wortes im Grid zurück (horizontal/vertikal)
function findAllWordPositionsInGrid(grid, word) {
    word = word.toUpperCase();
    const r = grid.length;
    const c = grid[0].length;
    const positions = [];
    // Horizontal
    for (let i = 0; i < r; i++) {
        const rowStr = grid[i].join('');
        let idx = rowStr.indexOf(word);
        while (idx !== -1) {
            positions.push(Array.from({length: word.length}, (_, k) => [i, idx + k]));
            idx = rowStr.indexOf(word, idx + 1);
        }
    }
    // Vertikal
    for (let j = 0; j < c; j++) {
        let colStr = '';
        for (let i = 0; i < r; i++) colStr += grid[i][j];
        let idx = colStr.indexOf(word);
        while (idx !== -1) {
            positions.push(Array.from({length: word.length}, (_, k) => [idx + k, j]));
            idx = colStr.indexOf(word, idx + 1);
        }
    }
    return positions;
}

// Gibt alle Buchstaben-Positionen eines Wortes im Grid zurück (nur horizontal/vertikal, erstes Vorkommen)
function findWordPositionsInGrid(grid, word) {
    word = word.toUpperCase();
    const r = grid.length;
    const c = grid[0].length;
    // Horizontal
    for (let i = 0; i < r; i++) {
        const rowStr = grid[i].join('');
        const idx = rowStr.indexOf(word);
        if (idx !== -1) {
            return Array.from({length: word.length}, (_, k) => [i, idx + k]);
        }
    }
    // Vertikal
    for (let j = 0; j < c; j++) {
        let colStr = '';
        for (let i = 0; i < r; i++) colStr += grid[i][j];
        const idx = colStr.indexOf(word);
        if (idx !== -1) {
            return Array.from({length: word.length}, (_, k) => [idx + k, j]);
        }
    }
    return [];
}
// Grid-Input-Handler (Buchstabe eintragen und Fokus weiter)
function onGridInput(e) {
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    const val = e.target.value.toUpperCase();
    grid[row][col] = val;
    updateChecklist();

    // Nur bei Eingabe eines Zeichens (nicht bei Löschen)
    if (val.length === 1) {
        // Finde alle Inputs im Grid in Reihenfolge
        const inputs = Array.from(document.querySelectorAll('#wordGrid input'));
        const idx = inputs.findIndex(inp => inp === e.target);
        if (idx !== -1 && idx < inputs.length - 1) {
            // Nächste Zelle fokussieren
            inputs[idx + 1].focus();
            inputs[idx + 1].select();
        }
    }
}

// Grid-Keydown-Handler (Backspace/Entfernen steuert Navigation)
function onGridKeyDown(e) {
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    const val = e.target.value;
    const key = e.key;
    // Nur reagieren auf Backspace oder Delete
    if ((key === 'Backspace' || key === 'Delete')) {
        if (val === '' || val === ' ') {
            // Finde alle Inputs im Grid in Reihenfolge
            const inputs = Array.from(document.querySelectorAll('#wordGrid input'));
            const idx = inputs.findIndex(inp => inp === e.target);
            if (idx > 0) {
                e.preventDefault();
                // Vorherige Zelle leeren und fokussieren
                const prevInput = inputs[idx - 1];
                prevInput.value = '';
                const prow = parseInt(prevInput.dataset.row);
                const pcol = parseInt(prevInput.dataset.col);
                grid[prow][pcol] = '';
                prevInput.focus();
                updateChecklist();
            }
        }
        // Sonst: Standardverhalten (Buchstabe wird gelöscht, kein Springen)
    }
}

// Standardwerte
let rows = 11;
let cols = 11;
let grid = [
    Array.from('ESXISTXZEHN'.split('')),
    Array.from('FÜNFVIERTEL'.split('')),
    Array.from('ZWANZIGXVOR'.split('')),
    Array.from('XNACHXHALBX'.split('')),
    Array.from('XEINSXZWEIX'.split('')),
    Array.from('XDREIXVIERX'.split('')),
    Array.from('XFÜNFXSECHS'.split('')),
    Array.from('SIEBENXACHT'.split('')),
    Array.from('XNEUNXZEHNX'.split('')),
    Array.from('XELFXZWÖLFX'.split('')),
    Array.from('XXXXXUHRXXX'.split(''))
];

// Standardbegriffe für Vorschläge
const defaultWords = [
    "ES", "IST", "VIERTEL", "HALB", "NACH", "VOR", "UHR",
    "EINS", "ZWEI", "DREI", "VIER", "FÜNF", "SECHS", "SIEBEN", "ACHT", "NEUN", "ZEHN", "ELF", "ZWÖLF"
];
// Dynamische Wortliste (startet mit Standardwörtern)
let requiredWords = [...defaultWords];

function createEmptyGrid(r, c) {
    return Array.from({ length: r }, () => Array(c).fill(""));
}

function renderGrid() {
    const gridPreview = document.getElementById('gridPreview');
    let html = '<table id="wordGrid">';
    for (let i = 0; i < rows; i++) {
        html += '<tr>';
        for (let j = 0; j < cols; j++) {
            html += `<td><input type="text" maxlength="1" value="${grid[i][j] || ''}" data-row="${i}" data-col="${j}" /></td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    gridPreview.innerHTML = html;

    // Event Listener für alle Inputs
    document.querySelectorAll('#wordGrid input').forEach(input => {
        input.addEventListener('input', onGridInput);
        input.addEventListener('keydown', onGridKeyDown);
    });

}
function updateChecklist() {
    const wordChecklist = document.getElementById('wordChecklist');
    if (!wordChecklist) return;
    let foundCount = 0;
    // Hauptliste
    const mainList = requiredWords.map((word, idx) => {
        const found = findWordInGrid(grid, word);
        if (found) foundCount++;
        return `<li style="color:${found ? 'green' : 'red'}">
            <span>${found ? '✔️' : '❌'} ${word}</span>
            <button class="removeWordBtn" title="Wort entfernen" data-idx="${idx}">✖</button>
        </li>`;
    }).join('');

    // Vorschläge für entfernte Standardbegriffe
    const suggestions = defaultWords.filter(w => !requiredWords.includes(w));
    let suggestionList = '';
    if (suggestions.length > 0) {
        suggestionList += '<li style="margin-top:1.2em; color:#888; font-size:1em;">Vorschläge:</li>';
        suggestionList += suggestions.map(word =>
            `<li style="color:#888"><span>${word}</span> <button class="addWordBtn" title="Wort hinzufügen" data-word="${word}">+</button></li>`
        ).join('');
    }

    wordChecklist.innerHTML = mainList + suggestionList;

    // Fortschritt anzeigen
    const progressText = document.getElementById('progressText');
    const progressBar = document.getElementById('progressBar');
    if (progressText && progressBar) {
        progressText.textContent = `${foundCount} von ${requiredWords.length} Wörter gefunden`;
        const percent = requiredWords.length > 0 ? (foundCount / requiredWords.length) * 100 : 0;
        progressBar.style.width = percent + '%';
        if (foundCount === requiredWords.length && requiredWords.length > 0) {
            progressBar.style.background = 'linear-gradient(90deg, #1db954 80%, #43e97b 100%)';
        } else {
            progressBar.style.background = 'linear-gradient(90deg, #0078d7 60%, #00c3a0 100%)';
        }
    }

    // Entfernen-Buttons aktivieren
    document.querySelectorAll('.removeWordBtn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const idx = parseInt(this.dataset.idx);
            requiredWords.splice(idx, 1);
            updateChecklist();
        });
    });
    // Hinzufügen-Buttons für Vorschläge aktivieren
    document.querySelectorAll('.addWordBtn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const word = this.dataset.word;
            if (word && !requiredWords.includes(word)) {
                requiredWords.push(word);
                updateChecklist();
            }
        });
    });
}
// Hinzufügen neuer Wörter
window.addEventListener('DOMContentLoaded', function() {
    const addWordForm = document.getElementById('addWordForm');
    if (addWordForm) {
        addWordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = document.getElementById('newWordInput');
            let newWord = input.value.trim().toUpperCase();
            if (newWord && !requiredWords.includes(newWord)) {
                requiredWords.push(newWord);
                updateChecklist();
                input.value = '';
            } else {
                input.value = '';
            }
        });
    }
});

function findWordInGrid(grid, word) {
    // Suche horizontal und vertikal (einfach)
    const r = grid.length;
    const c = grid[0].length;
    word = word.toUpperCase();
    // Horizontal
    for (let i = 0; i < r; i++) {
        if (grid[i].join('').includes(word)) return true;
    }
    // Vertikal
    for (let j = 0; j < c; j++) {
        let colStr = '';
        for (let i = 0; i < r; i++) {
            colStr += grid[i][j];
        }
        if (colStr.includes(word)) return true;
    }
    return false;
}

function updateGridSize() {
    rows = parseInt(document.getElementById('rows').value);
    cols = parseInt(document.getElementById('cols').value);
    grid = createEmptyGrid(rows, cols);
    renderGrid();
    updateChecklist();
}

document.getElementById('updateGrid').addEventListener('click', updateGridSize);

// Initialisierung
window.onload = () => {
    renderGrid();
    updateChecklist();
};
