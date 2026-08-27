/* =========================================================
   VALET CAPITAL PARTNERS — Simulateur patrimonial (volet fiscal + gate allégé)
   Fichier hébergé sur GitHub Pages, chargé depuis le Code de l'entête IONOS
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

  /* ---------- header ---------- */
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

  /* ---------- hero ---------- */
  .hero{
    padding:88px 0 40px;
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
    font-size:clamp(32px, 4.4vw, 54px);
    line-height:1.08;
    max-width:16ch;
    color:var(--ivory);
  }
  .hero h1 em{font-style:italic; color:var(--gold-soft);}
  .hero p.lead{
    margin-top:22px;
    max-width:52ch;
    font-size:17px;
    color:var(--slate);
  }
  .trust-strip{
    display:flex; flex-wrap:wrap; gap:36px;
    margin-top:44px;
    padding-top:28px;
    border-top:1px solid var(--line);
  }
  .trust-item .num{font-family:'Fraunces', serif; font-size:26px; color:var(--gold-soft);}
  .trust-item .label{font-size:12px; color:var(--slate); margin-top:4px; letter-spacing:0.02em;}

  /* ---------- simulator ---------- */
  .simulator{
    margin:64px 0 100px;
    background:linear-gradient(180deg, var(--ink-2), var(--ink-3));
    border:1px solid var(--line);
    border-radius:6px;
    overflow:hidden;
  }
  .sim-head{
    padding:34px 40px 22px;
    border-bottom:1px solid var(--line);
    display:flex; align-items:baseline; justify-content:space-between; gap:20px; flex-wrap:wrap;
  }
  .sim-head h2{font-size:24px; color:var(--ivory);}
  .sim-head .sub{font-size:13px; color:var(--slate);}
  .sim-body{
    display:grid;
    grid-template-columns: 1.05fr 0.95fr;
  }
  @media (max-width: 860px){ .sim-body{grid-template-columns:1fr;} }

  .sim-form{padding:36px 40px; border-right:1px solid var(--line);}
  @media (max-width: 860px){ .sim-form{border-right:none; border-bottom:1px solid var(--line);} }

  .field{margin-bottom:26px;}
  .field label{
    display:flex; justify-content:space-between; align-items:baseline;
    font-size:12.5px; letter-spacing:0.04em; text-transform:uppercase; color:var(--slate);
    margin-bottom:10px;
  }
  .field label .val{font-family:'IBM Plex Mono', monospace; color:var(--gold-soft); font-size:13px;}
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
  input[type=number], input[type=text], input[type=email], input[type=tel]{
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

  .profile-select{display:grid; grid-template-columns:repeat(3,1fr); gap:10px;}
  .profile-btn{
    border:1px solid var(--line);
    background:rgba(255,255,255,0.02);
    color:var(--slate);
    padding:14px 8px;
    text-align:center;
    font-size:12.5px;
    letter-spacing:0.02em;
    border-radius:var(--radius);
    cursor:pointer;
    transition:all .15s ease;
  }
  .profile-btn strong{display:block; font-family:'Fraunces', serif; font-size:15px; color:var(--ivory); font-weight:500; margin-bottom:2px;}
  .profile-btn.active{border-color:var(--gold); background:rgba(198,161,91,0.09); color:var(--gold-soft);}
  .profile-btn.active strong{color:var(--gold-soft);}

  .sim-results{padding:36px 40px; position:relative;}
  .result-top{display:flex; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:26px;}
  .result-label{font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:var(--slate);}
  .result-figure{
    font-family:'Fraunces', serif; font-size:clamp(30px,3.2vw,42px);
    color:var(--ivory); margin-top:8px; font-variant-numeric: tabular-nums;
  }
  .result-figure .cents{font-size:0.5em; color:var(--slate);}
  .result-delta{font-size:13px; color:var(--emerald); margin-top:6px;}

  .chart-wrap{margin:22px 0 24px;}
  svg.chart{width:100%; height:170px; display:block;}

  .stat-grid{display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--line); border:1px solid var(--line); border-radius:var(--radius); overflow:hidden; margin-bottom:26px;}
  .stat-cell{background:var(--ink-2); padding:16px 18px;}
  .stat-cell .k{font-size:11px; text-transform:uppercase; letter-spacing:0.06em; color:var(--slate); margin-bottom:6px;}
  .stat-cell .v{font-family:'IBM Plex Mono', monospace; font-size:16px; color:var(--gold-soft);}

  .disclaimer{font-size:11px; color:#616a80; line-height:1.6; margin-top:4px;}

  .fiscal-block{
    margin:22px 0 20px;
    padding:18px 18px 14px;
    border:1px solid var(--line);
    border-radius:4px;
    background:rgba(198,161,91,0.04);
  }
  .fiscal-head{
    display:flex; align-items:center; gap:8px;
    font-size:11.5px; letter-spacing:0.06em; text-transform:uppercase;
    color:var(--gold-soft); margin-bottom:14px;
  }
  .fiscal-block .stat-grid{margin-bottom:14px;}
  .fiscal-highlight{
    display:flex; align-items:baseline; justify-content:space-between;
    padding-top:12px; border-top:1px dashed var(--line);
    margin-bottom:10px;
  }
  .fiscal-highlight .k{font-size:12px; color:var(--slate);}
  .fiscal-highlight .v{font-family:'IBM Plex Mono', monospace; font-size:19px; color:var(--emerald);}

  /* ---------- gate / lead form ---------- */
  .gate{
    margin-top:8px;
    border-top:1px dashed var(--line);
    padding-top:24px;
  }
  .gate-title{display:flex; align-items:center; gap:10px; margin-bottom:6px;}
  .gate-title svg{flex:none;}
  .gate-title h3{font-size:17px; color:var(--ivory);}
  .gate p{font-size:13px; color:var(--slate); margin:0 0 18px;}
  .gate-grid{display:grid; grid-template-columns:1fr 1fr; gap:12px;}
  .gate-grid .full{grid-column:1 / -1;}
  @media (max-width:520px){ .gate-grid{grid-template-columns:1fr;} }

  .consent{
    display:flex; gap:10px; align-items:flex-start;
    margin:16px 0 18px;
    font-size:12px; color:var(--slate); line-height:1.5;
  }
  .consent input{margin-top:3px; accent-color:var(--gold);}

  select{
    width:100%;
    background:rgba(255,255,255,0.03);
    border:1px solid var(--line);
    color:var(--ivory);
    font-family:'Inter', sans-serif;
    font-size:14.5px;
    padding:12px 14px;
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

  .step-indicator{display:flex; align-items:center; gap:6px; margin-bottom:22px;}
  .step-dot{width:7px; height:7px; border-radius:50%; background:var(--line); border:1px solid var(--line);}
  .step-dot.active{background:var(--gold); border-color:var(--gold);}
  .step-line{flex:1; max-width:32px; height:1px; background:var(--line);}

  .back-btn{
    display:block; width:100%; text-align:center;
    background:none; border:none; color:var(--slate);
    font-size:12px; margin-top:12px; cursor:pointer;
    font-family:'Inter', sans-serif;
  }
  .back-btn:hover{color:var(--gold-soft);}

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

  .success-box{
    text-align:center; padding:30px 10px;
  }
  .success-box .mark{
    width:44px; height:44px; border-radius:50%; border:1px solid var(--gold);
    display:flex; align-items:center; justify-content:center; margin:0 auto 18px;
  }
  .success-box h3{font-size:19px; margin-bottom:8px;}
  .success-box p{font-size:13px; color:var(--slate); max-width:38ch; margin:0 auto;}

  .hidden{display:none !important;}

  /* ---------- expertise strip ---------- */
  .expertise{padding:70px 0 90px; border-top:1px solid var(--line);}
  .expertise .kicker{font-size:11.5px; letter-spacing:0.16em; text-transform:uppercase; color:var(--gold-soft); margin-bottom:14px;}
  .expertise h2{font-size:clamp(22px,2.6vw,30px); max-width:30ch; margin-bottom:40px; color:var(--ivory);}
  .pillars{display:grid; grid-template-columns:repeat(3,1fr); gap:36px;}
  @media (max-width:760px){.pillars{grid-template-columns:1fr;}}
  .pillar .idx{font-family:'IBM Plex Mono', monospace; color:var(--gold); font-size:12px; margin-bottom:14px;}
  .pillar h4{font-family:'Fraunces', serif; font-weight:500; font-size:18px; color:var(--ivory); margin-bottom:10px;}
  .pillar p{font-size:13.5px; color:var(--slate); margin:0;}

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
    <a class="cta-ghost" href="#simulateur">Simuler mon patrimoine</a>
  </div>
</header>

<section class="hero">
  <div class="wrap">
    <span class="eyebrow"><span class="dot"></span> Simulateur patrimonial exclusif</span>
    <h1>Projetez votre patrimoine avec <em>la précision</em> d'un conseiller privé.</h1>
    <p class="lead">En moins de deux minutes, estimez la trajectoire de votre patrimoine selon votre profil d'investisseur — et échangez avec notre Président sur les leviers pour l'optimiser.</p>

    <div class="trust-strip">
      <div class="trust-item"><div class="num">15+</div><div class="label">ans d'expérience en gestion de portefeuille</div></div>
      <div class="trust-item"><div class="num">190+</div><div class="label">clients accompagnés</div></div>
      <div class="trust-item"><div class="num">100%</div><div class="label">indépendance de conseil</div></div>
    </div>
  </div>
</section>

<section id="simulateur" class="wrap">
  <div class="simulator">
    <div class="sim-head">
      <div>
        <h2>Votre projection patrimoniale</h2>
        <div class="sub">Ajustez les curseurs pour affiner votre situation</div>
      </div>
      <div class="sub mono" id="dateNow"></div>
    </div>

    <div class="sim-body">
      <!-- FORM -->
      <div class="sim-form">

        <div class="field">
          <label>Patrimoine actuel <span class="val" id="valPatrimoine">50 000 €</span></label>
          <input type="range" id="patrimoine" min="0" max="2000000" step="5000" value="50000">
        </div>

        <div class="field">
          <label>Épargne mensuelle disponible <span class="val" id="valEpargne">500 €</span></label>
          <input type="range" id="epargne" min="0" max="10000" step="50" value="500">
        </div>

        <div class="field">
          <label>Horizon de placement <span class="val" id="valHorizon">15 ans</span></label>
          <input type="range" id="horizon" min="1" max="40" step="1" value="15">
        </div>

        <div class="field">
          <label>Votre âge <span class="val" id="valAge">45 ans</span></label>
          <input type="range" id="age" min="18" max="80" step="1" value="45">
        </div>

        <div class="field">
          <label>Revenus annuels nets imposables du foyer <span class="val" id="valRevenusFoyer">45 000 €</span></label>
          <input type="range" id="revenusFoyer" min="0" max="500000" step="1000" value="45000">
        </div>

        <div class="field">
          <label>Situation familiale</label>
          <div class="profile-select" id="situationSelect">
            <div class="profile-btn active" data-situation="celibataire" data-parts-base="1">
              <strong>Célibataire</strong>1 part
            </div>
            <div class="profile-btn" data-situation="marie" data-parts-base="2">
              <strong>Marié(e)</strong>2 parts
            </div>
            <div class="profile-btn" data-situation="pacse" data-parts-base="2">
              <strong>Pacsé(e)</strong>2 parts
            </div>
          </div>
        </div>

        <div class="field">
          <label>Enfants à charge <span class="val" id="valEnfants">0</span></label>
          <input type="range" id="enfants" min="0" max="6" step="1" value="0">
        </div>

        <div class="field">
          <label>Profil investisseur</label>
          <div class="profile-select">
            <div class="profile-btn" data-profile="prudent" data-rate="0.025">
              <strong>Prudent</strong>≈ 2,5&nbsp;%/an
            </div>
            <div class="profile-btn active" data-profile="equilibre" data-rate="0.045">
              <strong>Équilibré</strong>≈ 4,5&nbsp;%/an
            </div>
            <div class="profile-btn" data-profile="dynamique" data-rate="0.07">
              <strong>Dynamique</strong>≈ 7&nbsp;%/an
            </div>
          </div>
        </div>

      </div>

      <!-- RESULTS -->
      <div class="sim-results">

        <div class="result-top">
          <div>
            <div class="result-label">Patrimoine estimé à horizon</div>
            <div class="result-figure mono" id="figFinal">0&nbsp;€</div>
            <div class="result-delta" id="figDelta"></div>
          </div>
        </div>

        <div class="chart-wrap">
          <svg class="chart" id="chartSvg" viewBox="0 0 480 170" preserveAspectRatio="none"></svg>
        </div>

        <div class="stat-grid">
          <div class="stat-cell">
            <div class="k">Effort d'épargne total</div>
            <div class="v mono" id="statEffort">0 €</div>
          </div>
          <div class="stat-cell">
            <div class="k">Plus-value estimée</div>
            <div class="v mono" id="statGain">0 €</div>
          </div>
        </div>

        <div class="fiscal-block">
          <div class="fiscal-head">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C6A15B" stroke-width="1.8"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <span>Volet fiscal de votre foyer</span>
          </div>
          <div class="stat-grid">
            <div class="stat-cell">
              <div class="k">Parts fiscales</div>
              <div class="v mono" id="statParts">1</div>
            </div>
            <div class="stat-cell">
              <div class="k">Tranche marginale d'imposition</div>
              <div class="v mono" id="statTMI">0 %</div>
            </div>
          </div>
          <div class="fiscal-highlight">
            <div class="k">Économie d'impôt potentielle par an*</div>
            <div class="v mono" id="statEconomieFiscale">0 €</div>
          </div>
          <p class="disclaimer">*Estimation indicative à votre TMI actuelle si votre épargne annuelle était placée sur un support fiscalement avantageux — hors dispositif précis, à étudier avec votre conseiller. Barème IR 2025 (le barème 2026 étant encore en débat parlementaire).</p>
        </div>

        <p class="disclaimer">Simulation indicative basée sur des hypothèses de rendement moyen et ne constituant ni un conseil en investissement, ni un engagement contractuel. Les performances passées ne préjugent pas des performances futures. Valet Capital Partners — CIF.</p>

        <!-- GATE -->
        <div class="gate" id="gate">
          <div class="gate-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C6A15B" stroke-width="1.6"><rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
            <h3 id="gateTitle">Recevez votre bilan patrimonial personnalisé</h3>
          </div>
          <p id="gateSub">Deux questions rapides pour orienter votre bilan vers ce qui compte vraiment pour vous.</p>

          <div class="step-indicator">
            <span class="step-dot active" id="dot1"></span>
            <span class="step-line"></span>
            <span class="step-dot" id="dot2"></span>
          </div>

          <form id="leadForm">

            <!-- STEP 1 : qualification -->
            <div id="step1">
              <div class="field">
                <label>Votre objectif principal</label>
                <select id="objectif" required>
                  <option value="" disabled selected>Sélectionnez un objectif</option>
                  <option value="Préparer ma retraite">Préparer ma retraite</option>
                  <option value="Optimiser ma fiscalité">Optimiser ma fiscalité</option>
                  <option value="Transmettre mon patrimoine">Transmettre mon patrimoine</option>
                  <option value="Investir en immobilier">Investir en immobilier</option>
                  <option value="Diversifier mes placements">Diversifier mes placements</option>
                </select>
              </div>

              <div class="field">
                <label>Votre situation professionnelle</label>
                <select id="statutPro" required>
                  <option value="" disabled selected>Sélectionnez une situation</option>
                  <option value="Salarié(e)">Salarié(e)</option>
                  <option value="Indépendant(e) / profession libérale">Indépendant(e) / profession libérale</option>
                  <option value="Chef d'entreprise / dirigeant(e)">Chef d'entreprise / dirigeant(e)</option>
                  <option value="Retraité(e)">Retraité(e)</option>
                </select>
              </div>

              <button type="button" class="submit-btn" id="nextBtn">Continuer</button>
            </div>

            <!-- STEP 2 : coordonnées -->
            <div id="step2" class="hidden">
              <div class="gate-grid">
                <input type="text" id="prenom" placeholder="Prénom" required>
                <input type="text" id="nom" placeholder="Nom" required>
                <input type="email" id="email" placeholder="Adresse e-mail" required class="full">
                <input type="tel" id="telephone" placeholder="Téléphone" required class="full">
              </div>

              <label class="consent">
                <input type="checkbox" id="consent" required>
                <span>J'accepte d'être recontacté(e) par Valet Capital Partners au sujet de mon bilan patrimonial, conformément à la <a href="https://www.valetcapitalpartners.com/mentions-legales/" target="_blank" style="color:#C6A15B;">politique de confidentialité</a>.</span>
              </label>

              <button type="submit" class="submit-btn" id="submitBtn">Recevoir mon bilan patrimonial</button>
              <button type="button" class="back-btn" id="backBtn">← Retour</button>
            </div>

          </form>

          <div class="success-box hidden" id="successBox">
            <div class="mark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C6A15B" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <h3>Merci, votre demande est bien reçue.</h3>
            <p>Un conseiller de Valet Capital Partners vous recontacte sous 48h avec un bilan adapté à votre objectif.</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>

<section class="expertise">
  <div class="wrap">
    <div class="kicker">Pourquoi Valet Capital Partners</div>
    <h2>Une approche indépendante, au service exclusif de votre patrimoine.</h2>
    <div class="pillars">
      <div class="pillar">
        <div class="idx">01</div>
        <h4>Indépendance totale</h4>
        <p>Analyse objective d'un éventail large de solutions, sans conflit d'intérêt lié à des commissions produits.</p>
      </div>
      <div class="pillar">
        <div class="idx">02</div>
        <h4>Expertise éprouvée</h4>
        <p>15 ans en gestion de portefeuille (COA) et 25 ans en solutions immobilières de défiscalisation.</p>
      </div>
      <div class="pillar">
        <div class="idx">03</div>
        <h4>Réseau d'experts</h4>
        <p>Notaires, avocats fiscalistes et partenaires financiers mobilisés selon votre situation.</p>
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
  s.textContent = '\n(function(){\n  const fmt = new Intl.NumberFormat(\'fr-FR\', {maximumFractionDigits:0});\n  const eur = (n) => fmt.format(Math.round(n)) + \' €\';\n\n  const els = {\n    patrimoine: document.getElementById(\'patrimoine\'),\n    epargne: document.getElementById(\'epargne\'),\n    horizon: document.getElementById(\'horizon\'),\n    age: document.getElementById(\'age\'),\n    revenusFoyer: document.getElementById(\'revenusFoyer\'),\n    enfants: document.getElementById(\'enfants\'),\n    valPatrimoine: document.getElementById(\'valPatrimoine\'),\n    valEpargne: document.getElementById(\'valEpargne\'),\n    valHorizon: document.getElementById(\'valHorizon\'),\n    valAge: document.getElementById(\'valAge\'),\n    valRevenusFoyer: document.getElementById(\'valRevenusFoyer\'),\n    valEnfants: document.getElementById(\'valEnfants\'),\n    figFinal: document.getElementById(\'figFinal\'),\n    figDelta: document.getElementById(\'figDelta\'),\n    statEffort: document.getElementById(\'statEffort\'),\n    statGain: document.getElementById(\'statGain\'),\n    statParts: document.getElementById(\'statParts\'),\n    statTMI: document.getElementById(\'statTMI\'),\n    statEconomieFiscale: document.getElementById(\'statEconomieFiscale\'),\n    chart: document.getElementById(\'chartSvg\'),\n  };\n\n  let rate = 0.045;\n  let situation = \'celibataire\';\n  let partsBase = 1;\n\n  // Boutons "Profil investisseur" (hors bloc situation familiale)\n  document.querySelectorAll(\'.profile-select:not(#situationSelect) .profile-btn\').forEach(btn=>{\n    btn.addEventListener(\'click\', ()=>{\n      document.querySelectorAll(\'.profile-select:not(#situationSelect) .profile-btn\').forEach(b=>b.classList.remove(\'active\'));\n      btn.classList.add(\'active\');\n      rate = parseFloat(btn.dataset.rate);\n      compute();\n    });\n  });\n\n  // Boutons "Situation familiale"\n  document.querySelectorAll(\'#situationSelect .profile-btn\').forEach(btn=>{\n    btn.addEventListener(\'click\', ()=>{\n      document.querySelectorAll(\'#situationSelect .profile-btn\').forEach(b=>b.classList.remove(\'active\'));\n      btn.classList.add(\'active\');\n      situation = btn.dataset.situation;\n      partsBase = parseFloat(btn.dataset.partsBase);\n      compute();\n    });\n  });\n\n  // Barème IR 2025 (par part) — le barème 2026 étant encore en débat parlementaire au moment du calcul\n  const BAREME = [\n    { max: 11497, taux: 0 },\n    { max: 29315, taux: 0.11 },\n    { max: 83823, taux: 0.30 },\n    { max: 180294, taux: 0.41 },\n    { max: Infinity, taux: 0.45 }\n  ];\n\n  function calculNombreParts(base, nbEnfants){\n    let parts = base;\n    if(nbEnfants <= 2){\n      parts += nbEnfants * 0.5;\n    } else {\n      parts += 1 + (nbEnfants - 2) * 1;\n    }\n    return parts;\n  }\n\n  function calculTMI(quotientParPart){\n    for(const tranche of BAREME){\n      if(quotientParPart <= tranche.max) return tranche.taux;\n    }\n    return BAREME[BAREME.length - 1].taux;\n  }\n\n  function calculImpot(revenu, parts){\n    const quotient = revenu / parts;\n    let impotParPart = 0;\n    let precedent = 0;\n    for(const tranche of BAREME){\n      if(quotient > precedent){\n        const borneSup = Math.min(quotient, tranche.max);\n        impotParPart += (borneSup - precedent) * tranche.taux;\n        precedent = tranche.max;\n      }\n    }\n    return impotParPart * parts;\n  }\n\n  function seriesFV(p0, pmt, years, annualRate){\n    const rm = annualRate/12;\n    const points = [];\n    for(let y=0; y<=years; y++){\n      const n = y*12;\n      let fv;\n      if(rm === 0){\n        fv = p0 + pmt*n;\n      } else {\n        fv = p0*Math.pow(1+rm, n) + pmt * ((Math.pow(1+rm, n)-1)/rm);\n      }\n      points.push(fv);\n    }\n    return points;\n  }\n\n  function drawChart(points){\n    const w = 480, h = 170, pad = 8;\n    const max = Math.max(...points, 1);\n    const min = 0;\n    const stepX = (w - pad*2) / (points.length - 1);\n    const scaleY = (v) => h - pad - ( (v - min) / (max - min || 1) ) * (h - pad*2);\n\n    let path = \'\';\n    points.forEach((v,i)=>{\n      const x = pad + i*stepX;\n      const y = scaleY(v);\n      path += (i===0 ? \'M\' : \'L\') + x.toFixed(1) + \' \' + y.toFixed(1) + \' \';\n    });\n\n    let area = path + `L ${(pad+(points.length-1)*stepX).toFixed(1)} ${h-pad} L ${pad} ${h-pad} Z`;\n\n    els.chart.innerHTML = `\n      <defs>\n        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">\n          <stop offset="0%" stop-color="#C6A15B" stop-opacity="0.28"/>\n          <stop offset="100%" stop-color="#C6A15B" stop-opacity="0"/>\n        </linearGradient>\n      </defs>\n      <path d="${area}" fill="url(#areaFill)" stroke="none"/>\n      <path d="${path.trim()}" fill="none" stroke="#C6A15B" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>\n    `;\n  }\n\n  function compute(){\n    const p0 = parseFloat(els.patrimoine.value);\n    const pmt = parseFloat(els.epargne.value);\n    const years = parseInt(els.horizon.value);\n    const age = parseInt(els.age.value);\n    const revenus = parseFloat(els.revenusFoyer.value);\n    const nbEnfants = parseInt(els.enfants.value);\n\n    els.valPatrimoine.textContent = eur(p0);\n    els.valEpargne.textContent = eur(pmt);\n    els.valHorizon.textContent = years + \' ans\';\n    els.valAge.textContent = age + \' ans\';\n    els.valRevenusFoyer.textContent = eur(revenus);\n    els.valEnfants.textContent = nbEnfants;\n\n    const points = seriesFV(p0, pmt, years, rate);\n    const final = points[points.length-1];\n    const effort = pmt * years * 12;\n    const gain = final - p0 - effort;\n\n    els.figFinal.innerHTML = eur(final);\n    els.figDelta.textContent = `À ${age + years} ans, soit dans ${years} ans`;\n    els.statEffort.textContent = eur(effort);\n    els.statGain.textContent = eur(gain);\n\n    // ---- Volet fiscal ----\n    const parts = calculNombreParts(partsBase, nbEnfants);\n    const quotient = revenus / parts;\n    const tmi = calculTMI(quotient);\n    const epargneAnnuelle = pmt * 12;\n    const economieFiscale = epargneAnnuelle * tmi;\n\n    els.statParts.textContent = (parts % 1 === 0 ? parts : parts.toFixed(1));\n    els.statTMI.textContent = Math.round(tmi * 100) + \' %\';\n    els.statEconomieFiscale.textContent = eur(economieFiscale);\n\n    drawChart(points);\n  }\n\n  [\'input\'].forEach(evt=>{\n    [els.patrimoine, els.epargne, els.horizon, els.age, els.revenusFoyer, els.enfants].forEach(el=>{\n      el.addEventListener(evt, compute);\n    });\n  });\n\n  compute();\n\n  document.getElementById(\'dateNow\').textContent = new Date().toLocaleDateString(\'fr-FR\', {day:\'2-digit\', month:\'long\', year:\'numeric\'});\n\n  // ---- Lead form submission ----\n  // TODO: remplacer par l\'URL du Google Apps Script Web App une fois créé.\n  const ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbzHNGYNG-JOVOFx__1DvHVJdst7EVdSfLV0yqTs3C4IpOYR_AFdxS2vyWO7PGDeCQz-/exec";\n\n  const form = document.getElementById(\'leadForm\');\n  const submitBtn = document.getElementById(\'submitBtn\');\n  const successBox = document.getElementById(\'successBox\');\n  const step1 = document.getElementById(\'step1\');\n  const step2 = document.getElementById(\'step2\');\n  const nextBtn = document.getElementById(\'nextBtn\');\n  const backBtn = document.getElementById(\'backBtn\');\n  const dot1 = document.getElementById(\'dot1\');\n  const dot2 = document.getElementById(\'dot2\');\n  const gateSub = document.getElementById(\'gateSub\');\n\n  nextBtn.addEventListener(\'click\', function(){\n    const objectif = document.getElementById(\'objectif\');\n    const statutPro = document.getElementById(\'statutPro\');\n    if(!objectif.value || !statutPro.value){\n      [objectif, statutPro].forEach(el=>{\n        if(!el.value) el.style.borderColor = \'#b06868\';\n        else el.style.borderColor = \'\';\n      });\n      return;\n    }\n    step1.classList.add(\'hidden\');\n    step2.classList.remove(\'hidden\');\n    dot1.classList.remove(\'active\');\n    dot2.classList.add(\'active\');\n    gateSub.textContent = \'Dernière étape : vos coordonnées pour recevoir votre bilan.\';\n  });\n\n  backBtn.addEventListener(\'click\', function(){\n    step2.classList.add(\'hidden\');\n    step1.classList.remove(\'hidden\');\n    dot2.classList.remove(\'active\');\n    dot1.classList.add(\'active\');\n    gateSub.textContent = "Deux questions rapides pour orienter votre bilan vers ce qui compte vraiment pour vous.";\n  });\n\n  form.addEventListener(\'submit\', async function(e){\n    e.preventDefault();\n    submitBtn.disabled = true;\n    submitBtn.textContent = \'Envoi...\';\n\n    const payload = {\n      objectif: document.getElementById(\'objectif\').value,\n      statutPro: document.getElementById(\'statutPro\').value,\n      prenom: document.getElementById(\'prenom\').value,\n      nom: document.getElementById(\'nom\').value,\n      email: document.getElementById(\'email\').value,\n      telephone: document.getElementById(\'telephone\').value,\n      consentement: document.getElementById(\'consent\').checked,\n      patrimoineActuel: els.patrimoine.value,\n      epargneMensuelle: els.epargne.value,\n      horizon: els.horizon.value,\n      age: els.age.value,\n      profil: document.querySelector(\'.profile-select:not(#situationSelect) .profile-btn.active strong\').textContent,\n      patrimoineEstime: els.figFinal.textContent.replace(/&nbsp;/g,\' \'),\n      situationFamiliale: document.querySelector(\'#situationSelect .profile-btn.active strong\').textContent,\n      enfantsACharge: els.enfants.value,\n      revenusFoyer: els.revenusFoyer.value,\n      partsFiscales: els.statParts.textContent,\n      tmi: els.statTMI.textContent,\n      economieFiscalePotentielle: els.statEconomieFiscale.textContent,\n      dateSoumission: new Date().toISOString()\n    };\n\n    try{\n      if(ENDPOINT_URL){\n        await fetch(ENDPOINT_URL, {\n          method: \'POST\',\n          mode: \'no-cors\',\n          headers: {\'Content-Type\':\'text/plain\'},\n          body: JSON.stringify(payload)\n        });\n      } else {\n        console.log(\'Lead capté (endpoint non configuré) :\', payload);\n      }\n      form.classList.add(\'hidden\');\n      successBox.classList.remove(\'hidden\');\n    } catch(err){\n      console.error(err);\n      submitBtn.disabled = false;\n      submitBtn.textContent = \'Recevoir mon bilan patrimonial\';\n      alert("Une erreur est survenue, merci de réessayer.");\n    }\n  });\n\n})();\n';
  document.body.appendChild(s);
})();
