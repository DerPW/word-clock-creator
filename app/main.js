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
let grid = [];

// Standardbegriffe für Vorschläge
const defaultWords = [
    "ES", "IST", "VIERTEL", "HALB", "DREIVIERTEL", "NACH", "VOR", "UHR",
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
    grid = createEmptyGrid(rows, cols);
    renderGrid();
    updateChecklist();
};
