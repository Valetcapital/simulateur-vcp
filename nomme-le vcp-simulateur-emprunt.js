/* =========================================================
   VALET CAPITAL PARTNERS — Simulateur Capacité d'Emprunt / Faisabilité
   ========================================================= */
(function(){
  function addPreconnect(href, crossorigin){
    var l = document.createElement('link');
    l.rel = 'preconnect';
    l.href = href;
    if (crossorigin) l.crossOrigin = 'anonymous';
    document.head.appendChild(l);
  }
  addPreconnect('https://fonts.googleapis.com');
  addPreconnect('https://fonts.gstatic.com', true);
  var fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap';
  document.head.appendChild(fontLink);

  var hideStyle = document.createElement('style');
  hideStyle.id = 'vcp-hide-style';
  hideStyle.textContent = 'body > *:not(#vcp-root){display:none !important;} body{background:#0B1220 !important;}';
  document.head.appendChild(hideStyle);

  var styleTag = document.createElement('style');
  styleTag.textContent = `
  :root{
    --ink:#0B1220;
    --ink-2:#101a2e;
    --ink-3:#16223b;
    --line: rgba(198,161,91,0.18);
    --gold:#C6A15B;
    --gold-soft:#D9BE87;
    --ivory:#EDE7DA;
    --slate:#8B93A7;
    --emerald:#74A98A;
    --radius: 2px;
  }
  *{box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{
    margin:0;
    background:var(--ink);
    color:var(--ivory);
    font-family:'Inter', sans-serif;
    font-size:16px;
    line-height:1.55;
    -webkit-font-smoothing:antialiased;
  }
  h1,h2,h3{
    font-family:'Fraunces', serif;
    font-weight:500;
    margin:0;
    letter-spacing:-0.01em;
  }
  .mono{font-family:'IBM Plex Mono', monospace; font-variant-numeric: tabular-nums;}
  a{color:inherit;}
  .wrap{max-width:1120px; margin:0 auto; padding:0 28px;}

  header.site{
    position:sticky; top:0; z-index:50;
    background:rgba(11,18,32,0.86);
    backdrop-filter:blur(10px);
    border-bottom:1px solid var(--line);
  }
  header.site .wrap{
    display:flex; align-items:center; justify-content:space-between;
    padding-top:18px; padding-bottom:18px;
  }
  .brand{display:flex; flex-direction:column; gap:2px;}
  .brand .name{font-family:'Fraunces', serif; font-size:18px; letter-spacing:0.04em; text-transform:uppercase; color:var(--ivory);}
  .brand .tag{font-size:10.5px; letter-spacing:0.12em; text-transform:uppercase; color:var(--gold-soft);}
  .cta-ghost{
    border:1px solid var(--line);
    color:var(--ivory);
    padding:10px 20px;
    font-size:13px;
    letter-spacing:0.03em;
    text-decoration:none;
    border-radius:var(--radius);
    transition:border-color .2s ease, color .2s ease;
    white-space:nowrap;
  }
  .cta-ghost:hover{border-color:var(--gold); color:var(--gold-soft);}

  .hero{
    padding:64px 0 30px;
    position:relative;
    overflow:hidden;
  }
  .hero::before{
    content:"";
    position:absolute; inset:0;
    background:
      radial-gradient(680px 420px at 82% -10%, rgba(198,161,91,0.10), transparent 60%),
      radial-gradient(600px 400px at -10% 30%, rgba(198,161,91,0.06), transparent 60%);
    pointer-events:none;
  }
  .eyebrow{
    display:inline-flex; align-items:center; gap:10px;
    font-size:11.5px; letter-spacing:0.16em; text-transform:uppercase;
    color:var(--gold-soft); margin-bottom:22px;
  }
  .eyebrow .dot{width:5px;height:5px;background:var(--gold); border-radius:50%; display:inline-block;}
  .hero h1{
    font-size:clamp(30px, 4vw, 48px);
    line-height:1.1;
    max-width:18ch;
    color:var(--ivory);
  }
  .hero h1 em{font-style:italic; color:var(--gold-soft);}
  .hero p.lead{
    margin-top:20px;
    max-width:56ch;
    font-size:16.5px;
    color:var(--slate);
  }

  .simulator{
    margin:48px 0 100px;
    background:linear-gradient(180deg, var(--ink-2), var(--ink-3));
    border:1px solid var(--line);
    border-radius:6px;
    overflow:hidden;
  }
  .sim-head{
    padding:30px 40px 20px;
    border-bottom:1px solid var(--line);
  }
  .sim-head h2{font-size:22px; color:var(--ivory);}
  .sim-head .sub{font-size:13px; color:var(--slate); margin-top:4px;}

  .sim-body{
    display:grid;
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 860px){ .sim-body{grid-template-columns:1fr;} }

  .sim-form{padding:32px 40px; border-right:1px solid var(--line);}
  @media (max-width: 860px){ .sim-form{border-right:none; border-bottom:1px solid var(--line);} }

  .field{margin-bottom:24px;}
  .field label{
    display:flex; justify-content:space-between; align-items:baseline;
    font-size:12.5px; letter-spacing:0.04em; text-transform:uppercase; color:var(--slate);
    margin-bottom:10px;
  }
  .field label .val{font-family:'IBM Plex Mono', monospace; color:var(--gold-soft); font-size:13px;}
  .field-hint{
    font-size:11.5px;
    color:#6a7288;
    font-style:italic;
    margin-top:8px;
    line-height:1.5;
  }
  .detail-toggle{
    background:none; border:none; color:var(--gold-soft);
    font-size:12px; cursor:pointer; padding:0; margin-top:10px; display:block;
    text-decoration:underline; text-underline-offset:3px; font-family:'Inter', sans-serif;
  }
  .detail-toggle:hover{ color:var(--gold); }
  .detail-panel{
    margin-top:14px; padding:16px 18px;
    background:rgba(255,255,255,0.02); border:1px solid var(--line); border-radius:4px;
  }
  .detail-row{ display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:12px; }
  .detail-row span{ font-size:12.5px; color:var(--slate); flex:1; }
  .detail-row input[type=number]{
    width:110px; background:rgba(255,255,255,0.03); border:1px solid var(--line);
    color:var(--ivory); font-family:'IBM Plex Mono', monospace; font-size:13px;
    padding:8px 10px; border-radius:var(--radius); outline:none; text-align:right;
  }
  .detail-row input:focus{ border-color:var(--gold); }
  .detail-back{
    background:none; border:none; color:var(--slate); font-size:11.5px; cursor:pointer;
    padding:0; margin-top:4px; text-decoration:underline; text-underline-offset:3px; font-family:'Inter', sans-serif;
  }
  .detail-back:hover{ color:var(--gold-soft); }
  .detail-subtotal{
    font-size:12.5px; color:var(--gold-soft); font-family:'IBM Plex Mono', monospace;
    padding-top:10px; margin-top:2px; border-top:1px dashed var(--line);
    display:flex; justify-content:space-between;
  }
  input[type=range]{
    -webkit-appearance:none; width:100%; height:2px; background:var(--line);
    border-radius:2px; outline:none;
  }
  input[type=range]::-webkit-slider-thumb{
    -webkit-appearance:none; width:16px; height:16px; border-radius:50%;
    background:var(--gold); cursor:pointer; border:2px solid var(--ink-2);
    box-shadow:0 0 0 1px var(--gold);
  }
  input[type=range]::-moz-range-thumb{
    width:16px; height:16px; border-radius:50%;
    background:var(--gold); cursor:pointer; border:2px solid var(--ink-2);
  }

  .section-divider{
    margin:28px 0 20px;
    padding-top:20px;
    border-top:1px dashed var(--line);
    font-size:11.5px; letter-spacing:0.1em; text-transform:uppercase; color:var(--gold-soft);
  }

  select{
    width:100%;
    background:rgba(255,255,255,0.03);
    border:1px solid var(--line);
    color:var(--ivory);
    font-family:'Inter', sans-serif;
    font-size:14px;
    padding:11px 13px;
    border-radius:var(--radius);
    outline:none;
    appearance:none;
    -webkit-appearance:none;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' stroke='%238B93A7' stroke-width='1.4' fill='none'/></svg>");
    background-repeat:no-repeat;
    background-position:right 14px center;
  }
  select:focus{border-color:var(--gold);}
  select option{background:var(--ink-2); color:var(--ivory);}

  input[type=text], input[type=email], input[type=tel]{
    width:100%;
    background:rgba(255,255,255,0.03);
    border:1px solid var(--line);
    color:var(--ivory);
    font-family:'Inter', sans-serif;
    font-size:14.5px;
    padding:12px 14px;
    border-radius:var(--radius);
    outline:none;
    transition:border-color .15s ease;
  }
  input:focus{border-color:var(--gold);}
  input::placeholder{color:#5c6479;}

  .epargne-row{display:flex; align-items:center; gap:12px; margin-bottom:12px;}
  .epargne-row .k{font-size:13px; color:var(--slate); width:130px; flex:none;}
  .epargne-row select{flex:1;}

  .sim-results{padding:32px 40px;}
  .result-label{font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:var(--slate);}

  .headline-box{
    background:var(--ink);
    border:1px solid var(--line);
    border-radius:4px;
    padding:20px 24px;
    margin-bottom:16px;
  }
  .headline-box .result-figure{
    font-family:'Fraunces', serif; font-size:clamp(28px,3vw,38px);
    color:var(--ivory); margin-top:6px; font-variant-numeric: tabular-nums;
  }

  .highlight-box{
    background:rgba(116,169,138,0.08);
    border:1px solid rgba(116,169,138,0.3);
    border-radius:4px;
    padding:18px 22px;
    margin-bottom:20px;
  }
  .highlight-box .result-figure{
    font-family:'Fraunces', serif; font-size:26px;
    color:var(--emerald); margin-top:6px;
  }
  .highlight-box .note{font-size:12.5px; color:var(--slate); margin-top:8px; line-height:1.5;}

  .disclaimer{font-size:11px; color:#616a80; line-height:1.6; margin-top:16px;}

  .gate{
    margin-top:8px;
    border-top:1px dashed var(--line);
    padding-top:22px;
  }
  .gate-title{display:flex; align-items:center; gap:10px; margin-bottom:6px;}
  .gate-title h3{font-size:17px; color:var(--ivory);}
  .gate p{font-size:13px; color:var(--slate); margin:0 0 16px;}
  .gate-grid{display:grid; grid-template-columns:1fr 1fr; gap:12px;}
  .gate-grid .full{grid-column:1 / -1;}
  @media (max-width:520px){ .gate-grid{grid-template-columns:1fr;} }

  .consent{
    display:flex; gap:10px; align-items:flex-start;
    margin:16px 0 18px;
    font-size:12px; color:var(--slate); line-height:1.5;
  }
  .consent input{margin-top:3px; accent-color:var(--gold);}

  .submit-btn{
    width:100%;
    background:var(--gold);
    color:var(--ink);
    border:none;
    font-family:'Inter', sans-serif;
    font-weight:600;
    font-size:14px;
    letter-spacing:0.02em;
    padding:15px 18px;
    border-radius:var(--radius);
    cursor:pointer;
    transition:background .15s ease;
  }
  .submit-btn:hover{background:var(--gold-soft);}
  .submit-btn:disabled{opacity:0.5; cursor:not-allowed;}

  .success-box{ text-align:center; padding:30px 10px; }
  .success-box .mark{
    width:44px; height:44px; border-radius:50%; border:1px solid var(--gold);
    display:flex; align-items:center; justify-content:center; margin:0 auto 18px;
  }
  .success-box h3{font-size:19px; margin-bottom:8px;}
  .success-box p{font-size:13px; color:var(--slate); max-width:38ch; margin:0 auto;}

  .hidden{display:none !important;}

  footer.site{border-top:1px solid var(--line); padding:34px 0; font-size:12px; color:var(--slate);}
  footer.site .wrap{display:flex; justify-content:space-between; flex-wrap:wrap; gap:12px;}
`;
  document.head.appendChild(styleTag);

  var root = document.createElement('div');
  root.id = 'vcp-root';
  root.innerHTML = `<header class="site">
  <div class="wrap">
    <div class="brand">
      <span class="name">Valet Capital Partners</span>
      <span class="tag">Conseil en Investissement Financier</span>
    </div>
    <a class="cta-ghost" href="#simulateur">Estimer ma capacité d'emprunt</a>
  </div>
</header>

<section class="hero">
  <div class="wrap">
    <span class="eyebrow"><span class="dot"></span> Simulateur de capacité d'emprunt gratuit</span>
    <h1>Découvrez <em>combien</em> vous pouvez emprunter pour votre projet.</h1>
    <p class="lead">Taux d'endettement, mensualité maximale, montant empruntable : en 2 minutes, obtenez une première estimation de la faisabilité de votre projet immobilier, basée sur la règle en vigueur (35% d'endettement maximum).</p>
  </div>
</section>

<section id="simulateur" class="wrap">
  <div class="simulator">
    <div class="sim-head">
      <h2>Votre capacité d'emprunt en un coup d'œil</h2>
      <div class="sub">Ajustez les curseurs selon votre situation</div>
    </div>

    <div class="sim-body">
      <div class="sim-form">

        <div class="field">
          <label>Revenu net mensuel du foyer <span class="val" id="valRevenu">3 500 €</span></label>
          <input type="range" id="revenu" min="0" max="15000" step="50" value="3500">
        </div>

        <div class="field">
          <label>Charges de crédit existantes <span class="val" id="valCharges">0 €</span></label>
          <input type="range" id="charges" min="0" max="3000" step="50" value="0">
          <div class="field-hint">Mensualités de crédits déjà en cours (auto, conso, autre prêt immobilier...).</div>
        </div>

        <div class="field">
          <label>Apport personnel disponible <span class="val" id="valApport">20 000 €</span></label>
          <input type="range" id="apport" min="0" max="200000" step="1000" value="20000">
        </div>

        <div class="section-divider">Conditions du crédit envisagé</div>

        <div class="field">
          <label>Taux d'intérêt <span class="val" id="valTaux">3.5 %</span></label>
          <input type="range" id="taux" min="1" max="6" step="0.1" value="3.5">
        </div>

        <div class="field">
          <label>Taux d'assurance emprunteur <span class="val" id="valAssurance">0.30 %</span></label>
          <input type="range" id="assurance" min="0" max="1" step="0.05" value="0.30">
        </div>

        <div class="field">
          <label>Durée du prêt <span class="val" id="valDuree">20 ans</span></label>
          <input type="range" id="duree" min="10" max="25" step="1" value="20">
        </div>

      </div>

      <div class="sim-results">

        <div class="headline-box">
          <div class="result-label">Montant empruntable estimé</div>
          <div class="result-figure mono" id="figCapaciteEmprunt">0 €</div>
        </div>

        <div class="highlight-box">
          <div class="result-label">Budget total pour votre projet</div>
          <div class="result-figure mono" id="figBudgetTotal">0 €</div>
          <div class="note">Montant empruntable + apport personnel. Il faut encore prévoir les frais de notaire et d'agence, non inclus ici.</div>
        </div>

        <div class="headline-box">
          <div class="result-label">Mensualité maximale (règle des 35%)</div>
          <div class="result-figure mono" id="figMensualiteMax">0 €</div>
        </div>

        <div class="headline-box">
          <div class="result-label">Reste à vivre après crédit / mois</div>
          <div class="result-figure mono" id="figResteAVivreEmprunt">0 €</div>
        </div>

        <p class="disclaimer">Simulation indicative basée sur la règle du taux d'endettement maximal de 35% (recommandation HCSF, assurance comprise). Ne constitue ni une offre de prêt, ni un conseil personnalisé, ni un engagement contractuel. Valet Capital Partners — CIF.</p>

        <div class="gate" id="gate">
          <div class="gate-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C6A15B" stroke-width="1.6"><rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
            <h3>Recevez votre étude de faisabilité personnalisée</h3>
          </div>
          <p>Un récapitulatif complet de votre situation, envoyé directement par email — sans engagement.</p>

          <form id="leadForm">
            <div class="gate-grid">
              <input type="text" id="prenom" placeholder="Prénom" required>
              <input type="text" id="nom" placeholder="Nom" required>
              <input type="email" id="email" placeholder="Adresse e-mail" required class="full">
              <input type="tel" id="telephone" placeholder="Téléphone" required class="full">
            </div>

            <label class="consent">
              <input type="checkbox" id="consent" required>
              <span>J'accepte d'être recontacté(e) par Valet Capital Partners au sujet de mon bilan budgétaire, conformément à la <a href="https://www.valetcapitalpartners.com/mentions-legales/" target="_blank" style="color:#C6A15B;">politique de confidentialité</a>.</span>
            </label>

            <button type="submit" class="submit-btn" id="submitBtn">Recevoir mon étude de faisabilité</button>
          </form>

          <div class="success-box hidden" id="successBox">
            <div class="mark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C6A15B" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <h3>Merci, votre demande est bien reçue.</h3>
            <p>Vous allez recevoir votre étude de faisabilité personnalisée par email très prochainement.</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>

<footer class="site">
  <div class="wrap">
    <span>© Valet Capital Partners — Conseil en Investissement Financier</span>
    <span>contact@valetcapitalpartners.com</span>
  </div>
</footer>`;
  document.body.appendChild(root);

  var s = document.createElement('script');
  s.textContent = '\n(function(){\n  const fmt = new Intl.NumberFormat(\'fr-FR\', {maximumFractionDigits:0});\n  const eur = (n) => fmt.format(Math.round(n)) + \' €\';\n  const parseEuroText = (str) => {\n    if (!str) return 0;\n    const cleaned = str.replace(/[^\\d-]/g, \'\');\n    return cleaned ? parseInt(cleaned, 10) : 0;\n  };\n\n  const els = {\n    revenu: document.getElementById(\'revenu\'),\n    charges: document.getElementById(\'charges\'),\n    apport: document.getElementById(\'apport\'),\n    taux: document.getElementById(\'taux\'),\n    assurance: document.getElementById(\'assurance\'),\n    duree: document.getElementById(\'duree\'),\n    valRevenu: document.getElementById(\'valRevenu\'),\n    valCharges: document.getElementById(\'valCharges\'),\n    valApport: document.getElementById(\'valApport\'),\n    valTaux: document.getElementById(\'valTaux\'),\n    valAssurance: document.getElementById(\'valAssurance\'),\n    valDuree: document.getElementById(\'valDuree\'),\n    figCapaciteEmprunt: document.getElementById(\'figCapaciteEmprunt\'),\n    figBudgetTotal: document.getElementById(\'figBudgetTotal\'),\n    figMensualiteMax: document.getElementById(\'figMensualiteMax\'),\n    figResteAVivreEmprunt: document.getElementById(\'figResteAVivreEmprunt\'),\n  };\n\n  const TAUX_ENDETTEMENT_MAX = 0.35; // règle HCSF\n\n  function compute(){\n    const revenu = parseFloat(els.revenu.value);\n    const charges = parseFloat(els.charges.value);\n    const apport = parseFloat(els.apport.value);\n    const tauxInteret = parseFloat(els.taux.value);\n    const tauxAssurance = parseFloat(els.assurance.value);\n    const dureeAns = parseFloat(els.duree.value);\n\n    els.valRevenu.textContent = eur(revenu);\n    els.valCharges.textContent = eur(charges);\n    els.valApport.textContent = eur(apport);\n    els.valTaux.textContent = tauxInteret.toFixed(1) + \' %\';\n    els.valAssurance.textContent = tauxAssurance.toFixed(2) + \' %\';\n    els.valDuree.textContent = dureeAns + \' ans\';\n\n    // Mensualité maximale autorisée par la règle des 35%, charges existantes déduites\n    const mensualiteMax = Math.max(0, (revenu * TAUX_ENDETTEMENT_MAX) - charges);\n\n    // Capacité d\'emprunt via la formule d\'annuité (taux + assurance combinés)\n    const tauxMensuel = (tauxInteret + tauxAssurance) / 100 / 12;\n    const nbMensualites = dureeAns * 12;\n    let capaciteEmprunt = 0;\n    if (tauxMensuel > 0) {\n      capaciteEmprunt = mensualiteMax * (1 - Math.pow(1 + tauxMensuel, -nbMensualites)) / tauxMensuel;\n    } else {\n      capaciteEmprunt = mensualiteMax * nbMensualites;\n    }\n\n    const budgetTotal = capaciteEmprunt + apport;\n    const resteAVivre = revenu - charges - mensualiteMax;\n\n    els.figCapaciteEmprunt.textContent = eur(capaciteEmprunt);\n    els.figBudgetTotal.textContent = eur(budgetTotal);\n    els.figMensualiteMax.textContent = eur(mensualiteMax);\n    els.figResteAVivreEmprunt.textContent = eur(resteAVivre);\n  }\n\n  [\'input\'].forEach(evt=>{\n    [els.revenu, els.charges, els.apport, els.taux, els.assurance, els.duree].forEach(el=>{\n      el.addEventListener(evt, compute);\n    });\n  });\n\n  compute();\n\n  // ---- Lead form submission ----\n  const ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbzHNGYNG-JOVOFx__1DvHVJdst7EVdSfLV0yqTs3C4IpOYR_AFdxS2vyWO7PGDeCQz-/exec";\n\n  const form = document.getElementById(\'leadForm\');\n  const submitBtn = document.getElementById(\'submitBtn\');\n  const successBox = document.getElementById(\'successBox\');\n\n  form.addEventListener(\'submit\', async function(e){\n    e.preventDefault();\n    submitBtn.disabled = true;\n    submitBtn.textContent = \'Envoi...\';\n\n    const payload = {\n      formType: \'emprunt\',\n      prenom: document.getElementById(\'prenom\').value,\n      nom: document.getElementById(\'nom\').value,\n      email: document.getElementById(\'email\').value,\n      telephone: document.getElementById(\'telephone\').value,\n      consentement: document.getElementById(\'consent\').checked,\n      revenuNet: els.revenu.value,\n      chargesExistantes: els.charges.value,\n      apportPersonnel: els.apport.value,\n      tauxInteret: els.taux.value,\n      tauxAssurance: els.assurance.value,\n      dureeAns: els.duree.value,\n      capaciteEmprunt: parseEuroText(els.figCapaciteEmprunt.textContent),\n      budgetTotal: parseEuroText(els.figBudgetTotal.textContent),\n      mensualiteMax: parseEuroText(els.figMensualiteMax.textContent),\n      resteAVivre: parseEuroText(els.figResteAVivreEmprunt.textContent),\n      dateSoumission: new Date().toISOString()\n    };\n\n    try{\n      await fetch(ENDPOINT_URL, {\n        method: \'POST\',\n        mode: \'no-cors\',\n        headers: {\'Content-Type\':\'text/plain\'},\n        body: JSON.stringify(payload)\n      });\n      form.classList.add(\'hidden\');\n      successBox.classList.remove(\'hidden\');\n    } catch(err){\n      console.error(err);\n      submitBtn.disabled = false;\n      submitBtn.textContent = \'Recevoir mon étude de faisabilité\';\n      alert("Une erreur est survenue, merci de réessayer.");\n    }\n  });\n\n})();\n';
  document.body.appendChild(s);
})();
