const cultures = {
    mais: { semenceParHa: 25, duree: '90 jours', rendement: 6, prixVente: 350, meilleurPeriode: 'Juillet - Octobre' },
    sorgho: { semenceParHa: 12, duree: '110 jours', rendement: 4.2, prixVente: 320, meilleurPeriode: 'Juin - Septembre' },
    mil: { semenceParHa: 8, duree: '100 jours', rendement: 2.8, prixVente: 300, meilleurPeriode: 'Mai - Août' },
    arachide: { semenceParHa: 70, duree: '120 jours', rendement: 1.8, prixVente: 1000, meilleurPeriode: 'Juin - Octobre' },
    gombo: { semenceParHa: 5, duree: '60 jours', rendement: 3.5, prixVente: 800, meilleurPeriode: 'Mai - Août' },
    tomate: { semenceParHa: 0.3, duree: '75 jours', rendement: 40, prixVente: 600, meilleurPeriode: 'Septembre - Décembre' },
    piment: { semenceParHa: 0.25, duree: '80 jours', rendement: 18, prixVente: 700, meilleurPeriode: 'Septembre - Décembre' },
    oignon: { semenceParHa: 4, duree: '120 jours', rendement: 25, prixVente: 500, meilleurPeriode: 'Novembre - Février' },
    papaye: { semenceParHa: 0.8, duree: '240 jours', rendement: 45, prixVente: 400, meilleurPeriode: 'Toute l’année (tropical)' },
    poivron: { semenceParHa: 0.35, duree: '85 jours', rendement: 22, prixVente: 650, meilleurPeriode: 'Septembre - Décembre' }
};

function calculer() {
    const startTime = performance.now();
    const culture = document.getElementById('culture').value;
    const culture2 = document.getElementById('culture2').value;
    const surface = parseFloat(document.getElementById('surface').value);
    const prixSemence = parseFloat(document.getElementById('prix').value);
    const prixSemence2 = parseFloat(document.getElementById('prix2').value);
    const coutIntrants = parseFloat(document.getElementById('coutIntrants').value) || 0;
    const prixVentePerso = parseFloat(document.getElementById('prixVentePerso').value);
    const feedback = document.getElementById('feedback');

    if (!culture) {
        feedback.textContent = 'Veuillez sélectionner une culture.';
        feedback.className = 'feedback error';
        return;
    }

    if (!Number.isFinite(surface) || surface <= 0) {
        feedback.textContent = 'Veuillez saisir une superficie supérieure à 0.';
        feedback.className = 'feedback error';
        return;
    }

    if (!Number.isFinite(prixSemence) || prixSemence < 0) {
        feedback.textContent = 'Veuillez saisir un prix valide.';
        feedback.className = 'feedback error';
        return;
    }

    if (prixVentePerso < 0) {
        feedback.textContent = 'Veuillez saisir un prix de vente projeté valide.';
        feedback.className = 'feedback error';
        return;
    }

    if (culture2 && prixSemence2 < 0) {
        feedback.textContent = 'Veuillez saisir un prix valide pour la culture de comparaison.';
        feedback.className = 'feedback error';
        return;
    }

    const info = cultures[culture];
    const besoinSemence = surface * info.semenceParHa;
    const coutSemence = besoinSemence * prixSemence;
    const coutTotal = coutSemence + coutIntrants;
    const prixVenteUtilise = Number.isFinite(prixVentePerso) && prixVentePerso > 0 ? prixVentePerso : info.prixVente;
    const production = surface * info.rendement;
    const chiffreAffaires = production * prixVenteUtilise;
    const benefice = chiffreAffaires - coutTotal;
    const roi = coutTotal > 0 ? (benefice / coutTotal) * 100 : 0;
    const marge = chiffreAffaires > 0 ? (benefice / chiffreAffaires) * 100 : 0;
    const conseil = getRecommendation(roi, prixVenteUtilise, info.prixVente);

    document.getElementById('resCulture').textContent = document.querySelector(`#culture option[value="${culture}"]`).textContent.replace(/^[^\w]+|\s+/g, ' ').trim();
    document.getElementById('resSurface').textContent = `${surface.toFixed(2)} ha`;
    document.getElementById('resSemence').textContent = `${besoinSemence.toFixed(2)} kg`;
    document.getElementById('resCout').textContent = `${coutSemence.toFixed(2)} FCFA`;
    document.getElementById('resDuree').textContent = info.duree;
    document.getElementById('resRendement').textContent = `${info.rendement.toFixed(2)} t/ha`;
    document.getElementById('resProduction').textContent = `${production.toFixed(2)} t`;
    document.getElementById('resPeriode').textContent = info.meilleurPeriode;
    document.getElementById('resPrixVente').textContent = `${prixVenteUtilise.toFixed(0)} FCFA/kg`;
    document.getElementById('resCA').textContent = `${chiffreAffaires.toFixed(2)} FCFA`;
    document.getElementById('resBenefice').textContent = `${benefice.toFixed(2)} FCFA`;
    document.getElementById('resCoutTotal').textContent = `${coutTotal.toFixed(2)} FCFA`;
    document.getElementById('resROI').textContent = `${roi.toFixed(1)} %`;
    document.getElementById('resMarge').textContent = `${marge.toFixed(1)} %`;
    document.getElementById('resConseil').textContent = conseil;

    drawChart(production, roi, marge);
    updateActionPlan(culture, info, surface, prixVenteUtilise, roi, marge);
    updateComparison(culture2, surface, prixSemence2);
    updateHeroDashboard(culture, roi);
    updatePerformanceTime(startTime);

    feedback.textContent = 'Calcul effectué avec succès.';
    feedback.className = 'feedback';

    saveHistory({
        culture: document.getElementById('resCulture').textContent,
        surface: surface.toFixed(2),
        prixSemence: prixSemence.toFixed(0),
        prixVente: prixVenteUtilise.toFixed(0),
        benefice: benefice.toFixed(0),
        roi: roi.toFixed(1),
        date: new Date().toLocaleString('fr-FR')
    });
}

let yieldChartInstance = null;

function initializeChart() {
    const ctx = document.getElementById('yieldChart').getContext('2d');
    if (!ctx) return;
    yieldChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Production (t)', 'ROI (%)', 'Marge (%)'],
            datasets: [{
                label: 'Projection',
                data: [0, 0, 0],
                backgroundColor: ['rgba(47, 125, 50, 0.9)', 'rgba(47, 125, 50, 0.7)', 'rgba(47, 125, 50, 0.5)'],
                borderRadius: 16,
                maxBarThickness: 40,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${context.formattedValue}` } }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#4c6b57' } },
                y: { beginAtZero: true, grid: { color: 'rgba(100, 115, 100, 0.16)' }, ticks: { color: '#4c6b57' } }
            }
        }
    });
}

function drawChart(production, roi, marge) {
    if (!yieldChartInstance) return;
    yieldChartInstance.data.datasets[0].data = [production, roi, marge];
    yieldChartInstance.update();
}

function updateComparison(culture2, surface, prixSemence2) {
    const comparisonResult = document.getElementById('comparisonResult');
    if (!comparisonResult) return;
    if (!culture2) {
        comparisonResult.textContent = 'Choisissez une culture de comparaison pour voir le meilleur scénario.';
        return;
    }

    const info2 = cultures[culture2];
    const prixSemenceComparaison = Number.isFinite(prixSemence2) && prixSemence2 > 0 ? prixSemence2 : info2.prixVente;
    const besoinSemence2 = surface * info2.semenceParHa;
    const coutSemence2 = besoinSemence2 * prixSemenceComparaison;
    const production2 = surface * info2.rendement;
    const chiffreAffaires2 = production2 * info2.prixVente;
    const benefice2 = chiffreAffaires2 - coutSemence2;
    const roi2 = coutSemence2 > 0 ? (benefice2 / coutSemence2) * 100 : 0;
    const marge2 = chiffreAffaires2 > 0 ? (benefice2 / chiffreAffaires2) * 100 : 0;
    const cultureName2 = document.querySelector(`#culture2 option[value="${culture2}"]`).textContent.replace(/^[^\w]+|\s+/g, ' ').trim();

    comparisonResult.innerHTML = `
        <strong>${cultureName2}</strong><br>
        Production estimée : ${production2.toFixed(2)} t<br>
        Bénéfice estimé : ${benefice2.toFixed(2)} FCFA<br>
        ROI : ${roi2.toFixed(1)} % · Marge : ${marge2.toFixed(1)} %<br>
        Meilleure période : ${info2.meilleurPeriode}
    `;
}

function updatePerformanceTime(startTime) {
    const elapsed = (performance.now() - startTime).toFixed(1);
    const perfTime = document.getElementById('perfTime');
    if (perfTime) {
        perfTime.textContent = `${elapsed} ms`;
    }
}

function updateHeroDashboard(cultureKey, roi) {
    const cropName = document.querySelector(`#culture option[value="${cultureKey}"]`).textContent.replace(/^[^\w]+|\s+/g, ' ').trim();
    const heroLastCrop = document.getElementById('heroLastCrop');
    const heroLastROI = document.getElementById('heroLastROI');
    const heroLastAction = document.getElementById('heroLastAction');

    if (heroLastCrop) heroLastCrop.textContent = cropName;
    if (heroLastROI) heroLastROI.textContent = `${roi.toFixed(1)} %`;
    if (heroLastAction) heroLastAction.textContent = roi >= 80 ? 'Consolider' : roi >= 40 ? 'Ajuster' : 'Réévaluer';
}

function updateActionPlan(cultureKey, info, surface, prixVenteUtilise, roi, marge) {
    const actionList = document.getElementById('actionPlanList');
    if (!actionList) return;

    const cultureName = document.querySelector(`#culture option[value="${cultureKey}"]`).textContent.replace(/^[^\w]+|\s+/g, ' ').trim();
    const actions = [
        `Plan d’action pour ${cultureName} (${info.meilleurPeriode}).`,
        `Préparez votre parcelle de ${surface.toFixed(2)} ha avant le début de la période recommandée.`
    ];

    if (roi >= 100) {
        actions.push('Investissez légèrement dans l’irrigation ou l’engrais pour maximiser le rendement.');
        actions.push('Votre projet est très rentable : validez le plan et passez à l’échelle.');
    } else if (roi >= 60) {
        actions.push('Réduisez les coûts d’intrants ou augmentez le prix de vente ciblé pour améliorer votre marge.');
        actions.push('Vérifiez la qualité du semis et optimisez l’espacement pour augmenter le rendement.');
    } else {
        actions.push('Réévaluez les coûts et la stratégie de commercialisation pour sécuriser votre projet.');
        actions.push('Envisagez une culture complémentaire ou une vente à valeur ajoutée pour améliorer la rentabilité.');
    }

    if (marge < 20) {
        actions.push('Réduisez les dépenses variables ou négociez un meilleur prix de vente pour augmenter la marge.');
    }

    actionList.innerHTML = actions.map((text) => `<li>${text}</li>`).join('');
}

function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

function exportCSV() {
    const culture = document.getElementById('resCulture').textContent;
    if (!culture || culture === '-') {
        alert('Veuillez effectuer un calcul avant d’exporter.');
        return;
    }

    const rows = [
        ['Élément', 'Valeur'],
        ['Culture', culture],
        ['Surface cultivée', document.getElementById('resSurface').textContent],
        ['Besoin en semences', document.getElementById('resSemence').textContent],
        ['Coût des semences', document.getElementById('resCout').textContent],
        ['Durée de production', document.getElementById('resDuree').textContent],
        ['Rendement estimé', document.getElementById('resRendement').textContent],
        ['Production estimée', document.getElementById('resProduction').textContent],
        ['Meilleure période', document.getElementById('resPeriode').textContent],
        ['Prix de vente', document.getElementById('resPrixVente').textContent],
        ['Chiffre d\'affaires', document.getElementById('resCA').textContent],
        ['Bénéfice', document.getElementById('resBenefice').textContent],
        ['Coût total prévu', document.getElementById('resCoutTotal').textContent],
        ['ROI', document.getElementById('resROI').textContent],
        ['Marge', document.getElementById('resMarge').textContent],
        ['Conseil', document.getElementById('resConseil').textContent]
    ];

    const csvContent = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    downloadFile('agri-tech-rapport.csv', csvContent, 'text/csv;charset=utf-8;');
}

function downloadReport() {
    const culture = document.getElementById('resCulture').textContent;
    if (!culture || culture === '-') {
        alert('Veuillez effectuer un calcul avant de télécharger le rapport.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    doc.setFontSize(18);
    doc.text('Rapport Agri-Tech', 15, 20);
    doc.setFontSize(11);
    doc.text(`Culture : ${culture}`, 15, 32);
    doc.text(`Surface cultivée : ${document.getElementById('resSurface').textContent}`, 15, 38);
    doc.text(`Besoin en semences : ${document.getElementById('resSemence').textContent}`, 15, 44);
    doc.text(`Coût des semences : ${document.getElementById('resCout').textContent}`, 15, 50);
    doc.text(`Durée de production : ${document.getElementById('resDuree').textContent}`, 15, 56);
    doc.text(`Rendement estimé : ${document.getElementById('resRendement').textContent}`, 15, 62);
    doc.text(`Production estimée : ${document.getElementById('resProduction').textContent}`, 15, 68);
    doc.text(`Meilleure période : ${document.getElementById('resPeriode').textContent}`, 15, 74);
    doc.text(`Prix de vente : ${document.getElementById('resPrixVente').textContent}`, 15, 80);
    doc.text(`Chiffre d'affaires estimé : ${document.getElementById('resCA').textContent}`, 15, 86);
    doc.text(`Bénéfice estimé : ${document.getElementById('resBenefice').textContent}`, 15, 92);
    doc.text(`Coût total prévu : ${document.getElementById('resCoutTotal').textContent}`, 15, 98);
    doc.text(`ROI estimé : ${document.getElementById('resROI').textContent}`, 15, 104);
    doc.text(`Marge : ${document.getElementById('resMarge').textContent}`, 15, 110);
    doc.text(`Conseil : ${document.getElementById('resConseil').textContent}`, 15, 116);

    if (yieldChartInstance) {
        const chartDataUrl = yieldChartInstance.toBase64Image();
        doc.addImage(chartDataUrl, 'PNG', 15, 125, 180, 80);
    }

    doc.save('agri-tech-rapport.pdf');
}

function reinitialiser() {
    document.getElementById('culture').value = '';
    document.getElementById('surface').value = '';
    document.getElementById('prix').value = '';
    document.getElementById('coutIntrants').value = '';
    document.getElementById('prixVentePerso').value = '';
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';

    const ids = ['resCulture','resSurface','resSemence','resCout','resDuree','resRendement','resProduction','resPeriode','resPrixVente','resCA','resBenefice','resCoutTotal','resROI','resMarge','resConseil'];
    ids.forEach((id) => {
        document.getElementById(id).textContent = '-';
    });
    document.getElementById('culture2').value = '';
    document.getElementById('prix2').value = '';
    document.getElementById('comparisonResult').textContent = 'Choisissez une culture de comparaison pour voir le meilleur scénario.';
}

function getRecommendation(roi, prixVenteUtilise, prixVenteDefault) {
    let message = 'Analyse prêt: passez à la prochaine étape en ajustant vos intrants ou votre prix de vente.';

    if (prixVenteUtilise !== prixVenteDefault) {
        message = 'Prix de vente projeté utilisé pour une meilleure simulation de marché.';
    }

    if (roi >= 120) {
        return `${message} Rendement très élevé : le projet est excellent. Conservez ce plan.`;
    }

    if (roi >= 80) {
        return `${message} ROI solide : la culture est rentable avec un bon potentiel.`;
    }

    if (roi >= 40) {
        return `${message} ROI modéré : examinez les coûts d’intrants pour améliorer la marge.`;
    }

    return `${message} ROI faible : valorisez votre prix de vente ou réduisez les dépenses pour sécuriser le projet.`;
}

function saveHistory(entry) {
    const history = JSON.parse(localStorage.getItem('agriTechHistory') || '[]');
    history.unshift(entry);
    localStorage.setItem('agriTechHistory', JSON.stringify(history.slice(0, 5)));
    renderHistory();
}

function renderHistory() {
    const historyList = document.getElementById('historyList');
    const history = JSON.parse(localStorage.getItem('agriTechHistory') || '[]');

    if (!history.length) {
        historyList.innerHTML = 'Aucun calcul récent.';
        return;
    }

    historyList.innerHTML = history.map((item) => `
        <div class="history-item">
            <strong>${item.culture} — ${item.date}</strong>
            <div>Surface : ${item.surface} ha · Bénéfice : ${item.benefice} FCFA</div>
            <div>ROI : ${item.roi} % · Prix : ${item.prixVente} FCFA/kg</div>
        </div>
    `).join('');
}

function applyTheme(theme) {
    document.body.classList.toggle('dark', theme === 'dark');
    const toggleButton = document.getElementById('themeToggle');
    if (toggleButton) {
        toggleButton.textContent = theme === 'dark' ? '☀️ Mode clair' : '🌙 Mode sombre';
        toggleButton.setAttribute('aria-label', theme === 'dark' ? 'Basculer en mode clair' : 'Basculer en mode sombre');
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('agriTechTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(theme);

    const toggleButton = document.getElementById('themeToggle');
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            const nextTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
            applyTheme(nextTheme);
            localStorage.setItem('agriTechTheme', nextTheme);
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    initializeChart();
    reinitialiser();
    initTheme();
});
