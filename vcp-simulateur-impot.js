/* Moteur de calcul IR - revenus 2025 (impot 2026). Sans antislash. */
var IR = (function(){
  var P = {
    annee: 2025,
    tranches: [[0,11600,0],[11600,29579,0.11],[29579,84577,0.30],[84577,181917,0.41],[181917,Infinity,0.45]],
    plafondDemiPart: 1807,
    plafondParentIsole: 4262,
    reducVeuf: 2011,
    decoteSeuil: {seul:1982, couple:3277},
    decoteBase: {seul:897, couple:1483},
    decoteTaux: 0.4525,
    seuilRecouvrement: 61,
    abattSalaire: {min:509, max:14555},
    microFoncier: {plafond:15000, abatt:0.30},
    micro: {
      bnc:{plafond:77700, abatt:0.34},
      bic_services:{plafond:77700, abatt:0.50},
      bic_ventes:{plafond:188700, abatt:0.71},
      minAbatt:305
    },
    ps_foncier: 0.172
  };

  function impotParts(revenu, parts){
    var q = revenu / parts, t = 0, i, b, det = [];
    for(i=0;i<P.tranches.length;i++){
      b = P.tranches[i];
      var m = Math.min(q, b[1]) - b[0];
      if(m>0){ var part = m*b[2]; t += part; det.push({de:b[0], a:b[1], taux:b[2], base:m*parts, impot:part*parts}); }
    }
    return {impot: t*parts, detail: det};
  }
  function tauxMarginal(revenu, parts){
    var q = revenu/parts, i;
    for(i=P.tranches.length-1;i>=0;i--){ if(q>P.tranches[i][0]) return P.tranches[i][2]; }
    return 0;
  }

  /* Parts : retourne {parts, base, plafond, notes} */
  function calculParts(f){
    var marie = (f.situation==='marie'), veuf = (f.situation==='veuf');
    var excl = Math.max(0, f.enfantsCharge|0), alt = Math.max(0, f.enfantsAlternee|0);
    var seul = !marie && !!f.vitSeul;
    var base = marie ? 2 : 1;
    var parts = base, plafond = 0, notes = [];
    var rang = 0, i, demiParts = 0, quarts = 0;
    for(i=0;i<excl;i++){ rang++; if(rang<=2){ parts += 0.5; demiParts += 1; } else { parts += 1; demiParts += 2; } }
    var altParts = 0;
    for(i=0;i<alt;i++){ rang++; if(rang<=2){ parts += 0.25; altParts += 0.25; } else { parts += 0.5; altParts += 0.5; } }
    plafond = demiParts*P.plafondDemiPart + altParts*2*P.plafondDemiPart;
    if(veuf && excl>0){
      parts += 1; plafond += 2*P.plafondDemiPart + P.reducVeuf;
      notes.push('Veuf avec enfant(s) a charge : part supplementaire et reduction complementaire de '+P.reducVeuf+' EUR.');
    } else if(!marie && seul && excl>0){
      parts += 0.5;
      /* case T : le plafond du premier enfant passe de 2 demi-parts a 4262 */
      plafond += (P.plafondParentIsole - P.plafondDemiPart);
      notes.push('Parent isole (case T) : demi-part supplementaire, plafond du premier enfant a '+P.plafondParentIsole+' EUR.');
    } else if(!marie && seul && alt>0 && excl===0){
      var nT = Math.min(alt,2);
      parts += 0.25*nT;
      plafond += 0.25*nT*2*P.plafondParentIsole/2;
      notes.push('Case T avec enfant(s) en residence alternee : majoration de 0,25 part par enfant (2 premiers). Plafond approximatif.');
    }
    return {parts:parts, base:base, plafond:plafond, notes:notes, couple: (marie||false)};
  }

  function revenuSalarie(d){
    var s = Math.max(0, +d.salaire||0), ded;
    if(d.fraisReels && +d.fraisReels>0){ ded = Math.min(s, +d.fraisReels); }
    else { ded = Math.min(s, Math.min(P.abattSalaire.max, Math.max(P.abattSalaire.min, s*0.10))); }
    return {brut:s, deduction:ded, net:s-ded};
  }
  function revenuIndep(d){
    var r = {brut:0, abatt:0, net:0, regime:d.indepRegime||'aucun', erreur:null};
    var v = Math.max(0, +d.indepMontant||0);
    if(!v || r.regime==='aucun') return r;
    r.brut = v;
    if(r.regime==='reel'){ r.net = v; return r; }
    var m = P.micro[r.regime];
    if(!m){ r.erreur='Regime inconnu'; return r; }
    if(v>m.plafond){ r.erreur='Le chiffre d affaires depasse le plafond du regime micro ('+m.plafond+' EUR).'; return r; }
    r.abatt = Math.min(v, Math.max(P.micro.minAbatt, v*m.abatt));
    r.net = v - r.abatt;
    return r;
  }
  function revenuFoncier(f){
    var r = {brut:0, abatt:0, net:0, mode:f.foncierMode||'aucun', erreur:null};
    var v = +f.foncierMontant||0;
    if(!v || r.mode==='aucun') return r;
    if(v<0){ r.erreur='Deficit foncier non gere par ce simulateur.'; return r; }
    r.brut = v;
    if(r.mode==='micro'){
      if(v>P.microFoncier.plafond){ r.erreur='Les loyers depassent le plafond du micro-foncier ('+P.microFoncier.plafond+' EUR) : regime reel obligatoire.'; return r; }
      r.abatt = v*P.microFoncier.abatt; r.net = v - r.abatt;
    } else { r.net = v; }
    return r;
  }

  function cehr(rfr, couple){
    var t;
    if(couple){ t = (rfr>1000000)? (500000*0.03 + (rfr-1000000)*0.04) : (rfr>500000 ? (rfr-500000)*0.03 : 0); }
    else { t = (rfr>500000)? (250000*0.03 + (rfr-500000)*0.04) : (rfr>250000 ? (rfr-250000)*0.03 : 0); }
    return t;
  }

  function calculer(f){
    var res = {erreurs:[], declarants:[]};
    var total = 0, i, d, rs, ri, nbDecl = (f.situation==='marie') ? 2 : 1;
    for(i=0;i<nbDecl;i++){
      d = f.declarants[i] || {};
      rs = revenuSalarie(d); ri = revenuIndep(d);
      if(ri.erreur) res.erreurs.push(ri.erreur);
      res.declarants.push({salaire:rs, indep:ri});
      total += rs.net + ri.net;
    }
    var rf = revenuFoncier(f);
    if(rf.erreur) res.erreurs.push(rf.erreur);
    total += rf.net;
    res.foncier = rf;
    res.revenuNetImposable = Math.floor(total);
    var rev = res.revenuNetImposable;

    var pa = calculParts(f);
    res.parts = pa.parts; res.notes = pa.notes; res.partsBase = pa.base;

    var avecParts = impotParts(rev, pa.parts);
    var sansQF = impotParts(rev, pa.base);
    var avantage = sansQF.impot - avecParts.impot;
    var avantageRetenu = Math.min(avantage, pa.plafond);
    var impotBrut = (pa.parts===pa.base) ? avecParts.impot : Math.max(avecParts.impot, sansQF.impot - pa.plafond);
    res.impotSansEnfants = sansQF.impot;
    res.impotAvecParts = avecParts.impot;
    res.avantageQF = avantage; res.plafondQF = pa.plafond; res.plafonne = (avantage>pa.plafond && pa.parts!==pa.base);
    res.avantageRetenu = (pa.parts===pa.base)?0:avantageRetenu;
    res.impotBrut = impotBrut;
    res.detailTranches = avecParts.detail;

    var couple = (f.situation==='marie');
    var seuil = couple? P.decoteSeuil.couple : P.decoteSeuil.seul;
    var dbase = couple? P.decoteBase.couple : P.decoteBase.seul;
    var decote = 0;
    if(impotBrut < seuil){ decote = Math.max(0, dbase - P.decoteTaux*impotBrut); decote = Math.min(decote, impotBrut); }
    res.decote = decote;
    var impot = impotBrut - decote;
    res.cehr = cehr(rev, couple);
    impot += res.cehr;
    impot = Math.round(impot);
    if(impot < P.seuilRecouvrement && res.cehr===0){ impot = 0; }
    res.impot = impot;
    res.tauxMoyen = rev>0 ? impot/rev : 0;
    res.tmi = tauxMarginal(rev, pa.parts);
    res.psFoncier = rf.net * P.ps_foncier;
    return res;
  }
  return {calculer:calculer, calculParts:calculParts, impotParts:impotParts, P:P};
})();
if(typeof module!=='undefined') module.exports = IR;

/* ===================== INTERFACE ===================== */
(function(){
  if (typeof document === 'undefined') return;
  var ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbzHNGYNG-JOVOFx__1DvHVJdst7EVdSfLV0yqTs3C4IpOYR_AFdxS2vyWO7PGDeCQz-/exec';
  var MENTIONS_URL = 'https://www.valetcapitalpartners.com/mentions-legales/';

  var hide = document.createElement('style');
  hide.textContent = 'body > *:not(#vcp-root):not(script):not(style):not(link){display:none !important;}body{margin:0 !important;background:#0B1220 !important;}';
  document.head.appendChild(hide);
  ['https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap'].forEach(function(h){
    var l = document.createElement('link'); l.rel='stylesheet'; l.href=h; document.head.appendChild(l);
  });

  var css = ''
  + '#vcp-root{--ink:#0B1220;--ink2:#101a2e;--ink3:#16223b;--gold:#C6A15B;--gold2:#D9BE87;--ivory:#EDE7DA;--slate:#8B93A7;--em:#74A98A;--line:rgba(237,231,218,.12);font-family:Inter,system-ui,sans-serif;color:var(--ivory);background:var(--ink);min-height:100vh;line-height:1.55}'
  + '#vcp-root *{box-sizing:border-box}'
  + '#vcp-root .w{max-width:1180px;margin:0 auto;padding:0 20px}'
  + '#vcp-root header.site{position:sticky;top:0;z-index:20;background:rgba(11,18,32,.94);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}'
  + '#vcp-root header.site .w{display:flex;justify-content:space-between;align-items:center;height:64px}'
  + '#vcp-root .logo{font-family:Fraunces,serif;font-size:20px;color:var(--ivory);text-decoration:none}'
  + '#vcp-root .logo b{color:var(--gold);font-weight:500}'
  + '#vcp-root .ghost{color:var(--gold2);text-decoration:none;font-size:14px;border:1px solid var(--line);padding:8px 16px;border-radius:999px}'
  + '#vcp-root .hero{padding:56px 0 24px;background:radial-gradient(900px 340px at 80% -10%,rgba(198,161,91,.16),transparent 70%)}'
  + '#vcp-root .eyebrow{color:var(--gold);text-transform:uppercase;letter-spacing:.16em;font-size:12px;font-weight:600;margin-bottom:12px}'
  + '#vcp-root h1{font-family:Fraunces,serif;font-weight:400;font-size:clamp(30px,4.4vw,48px);line-height:1.12;margin:0 0 14px}'
  + '#vcp-root h1 em{color:var(--gold);font-style:italic}'
  + '#vcp-root .lead{color:var(--slate);max-width:640px;font-size:17px;margin:0}'
  + '#vcp-root .grid{display:grid;grid-template-columns:1.05fr .95fr;gap:28px;padding:30px 0 40px;align-items:start}'
  + '@media(max-width:900px){#vcp-root .grid{grid-template-columns:1fr}}'
  + '#vcp-root .card{background:var(--ink2);border:1px solid var(--line);border-radius:18px;padding:26px}'
  + '#vcp-root .card h2{font-family:Fraunces,serif;font-weight:400;font-size:22px;margin:0 0 4px}'
  + '#vcp-root .card .sub{color:var(--slate);font-size:13px;margin:0 0 18px}'
  + '#vcp-root .sec{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin:24px 0 10px;padding-top:18px;border-top:1px solid var(--line)}'
  + '#vcp-root .sec:first-of-type{border-top:0;margin-top:6px;padding-top:0}'
  + '#vcp-root label{display:block;font-size:13px;color:var(--ivory);margin:0 0 6px;font-weight:500}'
  + '#vcp-root .hint{display:block;font-size:12px;color:var(--slate);font-weight:400;margin-top:2px}'
  + '#vcp-root input[type=number],#vcp-root input[type=text],#vcp-root input[type=email],#vcp-root input[type=tel],#vcp-root select{width:100%;background:var(--ink3);border:1px solid var(--line);color:var(--ivory);padding:11px 13px;border-radius:10px;font:inherit;margin-bottom:14px}'
  + '#vcp-root input:focus,#vcp-root select:focus{outline:none;border-color:var(--gold);box-shadow:0 0 0 3px rgba(198,161,91,.22)}'
  + '#vcp-root .row{display:grid;grid-template-columns:1fr 1fr;gap:14px}'
  + '@media(max-width:560px){#vcp-root .row{grid-template-columns:1fr}}'
  + '#vcp-root .chk{display:flex;gap:10px;align-items:flex-start;font-size:13px;color:var(--slate);margin:0 0 14px;font-weight:400}'
  + '#vcp-root .chk input{margin-top:3px;accent-color:#C6A15B}'
  + '#vcp-root .decl{background:rgba(255,255,255,.02);border:1px solid var(--line);border-radius:14px;padding:16px 16px 2px;margin-bottom:14px}'
  + '#vcp-root .decl h3{font-size:14px;margin:0 0 12px;color:var(--gold2);font-weight:600}'
  + '#vcp-root .res{position:sticky;top:84px}'
  + '#vcp-root .big{background:var(--ink);border:1px solid var(--line);border-radius:14px;padding:20px;margin-bottom:14px}'
  + '#vcp-root .big .k{color:var(--slate);font-size:12px;text-transform:uppercase;letter-spacing:.12em}'
  + '#vcp-root .big .v{font-family:Fraunces,serif;font-size:clamp(34px,5vw,48px);color:var(--gold2);line-height:1.1;margin-top:4px}'
  + '#vcp-root .kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px}'
  + '@media(max-width:560px){#vcp-root .kpis{grid-template-columns:1fr 1fr}}'
  + '#vcp-root .kpi{background:var(--ink);border:1px solid var(--line);border-radius:12px;padding:12px}'
  + '#vcp-root .kpi .k{color:var(--slate);font-size:11px;text-transform:uppercase;letter-spacing:.1em}'
  + '#vcp-root .kpi .v{font-family:"IBM Plex Mono",monospace;font-size:17px;margin-top:3px}'
  + '#vcp-root table{width:100%;border-collapse:collapse;font-size:13px;margin:6px 0 14px}'
  + '#vcp-root th{color:var(--slate);font-weight:500;text-align:left;padding:6px 4px;border-bottom:1px solid var(--line)}'
  + '#vcp-root td{padding:7px 4px;border-bottom:1px solid var(--line);font-family:"IBM Plex Mono",monospace}'
  + '#vcp-root td:first-child,#vcp-root th:first-child{font-family:Inter,sans-serif}'
  + '#vcp-root .line{display:flex;justify-content:space-between;gap:10px;font-size:13px;padding:6px 0;border-bottom:1px solid var(--line)}'
  + '#vcp-root .line span:last-child{font-family:"IBM Plex Mono",monospace;text-align:right}'
  + '#vcp-root .note{font-size:12px;color:var(--slate);margin:8px 0}'
  + '#vcp-root .err{background:rgba(214,92,92,.12);border:1px solid rgba(214,92,92,.4);color:#f2b8b8;border-radius:10px;padding:10px 12px;font-size:13px;margin-bottom:12px}'
  + '#vcp-root .good{background:rgba(116,169,138,.1);border:1px solid rgba(116,169,138,.35);color:#cfe7d8;border-radius:10px;padding:10px 12px;font-size:13px;margin-bottom:12px}'
  + '#vcp-root .btn{width:100%;background:var(--gold);color:#1a1405;border:0;border-radius:999px;padding:14px 20px;font-weight:700;font-size:15px;cursor:pointer}'
  + '#vcp-root .btn:disabled{opacity:.6;cursor:default}'
  + '#vcp-root .gate{margin-top:6px;padding-top:6px}'
  + '#vcp-root .disc{font-size:11px;color:#616a80;margin-top:14px}'
  + '#vcp-root .ok{display:none;text-align:center;padding:16px 4px}'
  + '#vcp-root .ok b{display:block;font-family:Fraunces,serif;font-size:22px;color:var(--gold2);font-weight:400;margin-bottom:6px}'
  + '#vcp-root .info{padding:10px 0 60px;max-width:820px}#vcp-root .info h2{font-family:Fraunces,serif;font-weight:400;font-size:26px;margin:0 0 12px}#vcp-root .info p,#vcp-root .info li{color:var(--slate);font-size:15px}#vcp-root .info li{margin-bottom:8px}#vcp-root .info strong{color:var(--ivory);font-weight:600}#vcp-root .info details{background:var(--ink2);border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin:10px 0}#vcp-root .info summary{cursor:pointer;color:var(--ivory);font-weight:500}#vcp-root .info details p{margin:10px 0 0}'
  + '#vcp-root a{color:var(--gold2)}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var html = ''
  + '<header class="site"><div class="w"><a class="logo" href="/">Valet <b>Capital</b> Partners</a><a class="ghost" href="#bilan">Recevoir mon bilan</a></div></header>'
  + '<section class="hero"><div class="w"><div class="eyebrow">Simulateur gratuit &middot; revenus 2025</div>'
  + '<h1>Estimez votre <em>imp&ocirc;t sur le revenu</em> selon le bar&egrave;me officiel</h1>'
  + '<p class="lead">Salari&eacute;s, ind&eacute;pendants, revenus fonciers, quotient familial : le calcul suit le bar&egrave;me en vigueur pour l&rsquo;imp&ocirc;t 2026, avec plafonnement du quotient familial et d&eacute;cote.</p></div></section>'
  + '<div class="w"><div class="grid">'
  + '<div class="card"><h2>Votre foyer fiscal</h2><p class="sub">Les r&eacute;sultats se mettent &agrave; jour en temps r&eacute;el.</p>'
  + '<div class="sec">Situation familiale</div>'
  + '<label for="sit">Situation</label><select id="sit"><option value="celibataire">C&eacute;libataire</option><option value="marie">Mari&eacute;(e) ou pacs&eacute;(e)</option><option value="divorce">Divorc&eacute;(e) ou s&eacute;par&eacute;(e)</option><option value="veuf">Veuf / veuve</option></select>'
  + '<div id="seulWrap"><label class="chk"><input type="checkbox" id="seul" checked><span>Je vis seul(e) (hors enfants &agrave; charge)</span></label></div>'
  + '<div class="row"><div><label for="nbE">Enfants &agrave; charge</label><input type="number" id="nbE" min="0" max="10" step="1" value="0"><span class="hint">Garde exclusive ou principale</span></div>'
  + '<div><label for="nbA">Enfants en r&eacute;sidence altern&eacute;e</label><input type="number" id="nbA" min="0" max="10" step="1" value="0"><span class="hint">Charge partag&eacute;e entre les parents</span></div></div>'
  + '<div class="sec">Revenus du foyer</div>'
  + '<div class="decl"><h3 id="t1">D&eacute;clarant 1</h3>'
  + '<label for="s1">Salaires, traitements (net imposable annuel)<span class="hint">Montant avant d&eacute;duction de 10 %, tel que pr&eacute;rempli sur la d&eacute;claration</span></label><input type="number" id="s1" min="0" step="100" value="0">'
  + '<label class="chk"><input type="checkbox" id="fr1"><span>Je d&eacute;duis mes frais r&eacute;els</span></label><div id="frw1" style="display:none"><label for="f1">Montant des frais r&eacute;els (annuel)</label><input type="number" id="f1" min="0" step="100" value="0"></div>'
  + '<div class="row"><div><label for="r1">Activit&eacute; ind&eacute;pendante</label><select id="r1"><option value="aucun">Aucune</option><option value="bnc">Micro-BNC (prof. lib&eacute;rale)</option><option value="bic_services">Micro-BIC services</option><option value="bic_ventes">Micro-BIC ventes</option><option value="reel">R&eacute;gime r&eacute;el (b&eacute;n&eacute;fice net)</option></select></div>'
  + '<div><label for="m1" id="m1l">Chiffre d&rsquo;affaires annuel</label><input type="number" id="m1" min="0" step="100" value="0"></div></div></div>'
  + '<div class="decl" id="d2" style="display:none"><h3>D&eacute;clarant 2</h3>'
  + '<label for="s2">Salaires, traitements (net imposable annuel)<span class="hint">Montant avant d&eacute;duction de 10 %</span></label><input type="number" id="s2" min="0" step="100" value="0">'
  + '<label class="chk"><input type="checkbox" id="fr2"><span>Je d&eacute;duis mes frais r&eacute;els</span></label><div id="frw2" style="display:none"><label for="f2">Montant des frais r&eacute;els (annuel)</label><input type="number" id="f2" min="0" step="100" value="0"></div>'
  + '<div class="row"><div><label for="r2">Activit&eacute; ind&eacute;pendante</label><select id="r2"><option value="aucun">Aucune</option><option value="bnc">Micro-BNC (prof. lib&eacute;rale)</option><option value="bic_services">Micro-BIC services</option><option value="bic_ventes">Micro-BIC ventes</option><option value="reel">R&eacute;gime r&eacute;el (b&eacute;n&eacute;fice net)</option></select></div>'
  + '<div><label for="m2" id="m2l">Chiffre d&rsquo;affaires annuel</label><input type="number" id="m2" min="0" step="100" value="0"></div></div></div>'
  + '<div class="decl"><h3>Revenus fonciers du foyer</h3><div class="row"><div><label for="fm">R&eacute;gime</label><select id="fm"><option value="aucun">Aucun</option><option value="micro">Micro-foncier</option><option value="reel">R&eacute;el (net)</option></select></div>'
  + '<div><label for="fv" id="fvl">Montant annuel</label><input type="number" id="fv" min="0" step="100" value="0"></div></div></div>'
  + '</div>'
  + '<div class="card res"><h2>Votre estimation</h2><p class="sub">Imp&ocirc;t 2026 sur les revenus 2025, avant pr&eacute;l&egrave;vement &agrave; la source d&eacute;j&agrave; vers&eacute;.</p>'
  + '<div id="errs"></div>'
  + '<div class="big"><div class="k">Imp&ocirc;t sur le revenu estim&eacute;</div><div class="v" id="o_imp">0 &euro;</div></div>'
  + '<div class="kpis"><div class="kpi"><div class="k">Taux moyen</div><div class="v" id="o_tm">0 %</div></div><div class="kpi"><div class="k">Tranche marginale</div><div class="v" id="o_tmi">0 %</div></div><div class="kpi"><div class="k">Parts</div><div class="v" id="o_parts">1</div></div></div>'
  + '<div class="line"><span>Revenu net imposable</span><span id="o_rev">0 &euro;</span></div>'
  + '<div class="line"><span>Imp&ocirc;t apr&egrave;s quotient familial</span><span id="o_brut">0 &euro;</span></div>'
  + '<div class="line"><span>Effet du quotient familial</span><span id="o_qf">0 &euro;</span></div>'
  + '<div class="line"><span>D&eacute;cote</span><span id="o_dec">0 &euro;</span></div>'
  + '<div class="line" id="o_cehrw" style="display:none"><span>Contribution hauts revenus (indicatif)</span><span id="o_cehr">0 &euro;</span></div>'
  + '<div class="line" id="o_psw" style="display:none"><span>Pr&eacute;l&egrave;vements sociaux sur revenus fonciers (17,2 %)</span><span id="o_ps">0 &euro;</span></div>'
  + '<div id="o_notes"></div>'
  + '<div class="sec" style="margin-top:18px">D&eacute;tail par tranche</div><table><thead><tr><th>Tranche (par part)</th><th>Taux</th><th>Imp&ocirc;t</th></tr></thead><tbody id="o_tr"></tbody></table>'
  + '<div class="sec gate" id="bilan">Recevoir mon bilan d&eacute;taill&eacute;</div>'
  + '<div id="gateForm"><p class="note" style="margin-top:0">Facultatif : recevez le d&eacute;tail de cette simulation par e-mail et un premier &eacute;change sans engagement.</p>'
  + '<div class="row"><div><label for="g_p">Pr&eacute;nom *</label><input type="text" id="g_p" autocomplete="given-name"></div><div><label for="g_n">Nom *</label><input type="text" id="g_n" autocomplete="family-name"></div></div>'
  + '<label for="g_e">E-mail *</label><input type="email" id="g_e" autocomplete="email"><label for="g_t">T&eacute;l&eacute;phone</label><input type="tel" id="g_t" autocomplete="tel">'
  + '<label class="chk"><input type="checkbox" id="g_c"><span>J&rsquo;accepte d&rsquo;&ecirc;tre recontact&eacute;(e) par Valet Capital Partners au sujet de ma simulation, conform&eacute;ment &agrave; la <a href="' + MENTIONS_URL + '" target="_blank" rel="noopener">politique de confidentialit&eacute;</a>. *</span></label>'
  + '<button class="btn" id="g_b" type="button">Recevoir mon bilan</button><div class="err" id="g_err" style="display:none;margin-top:12px"></div></div>'
  + '<div class="ok" id="g_ok"><b>Merci, votre demande est bien re&ccedil;ue.</b>Vous allez recevoir le d&eacute;tail de votre simulation par e-mail tr&egrave;s prochainement.</div>'
  + '<p class="disc">Simulation indicative &agrave; vis&eacute;e p&eacute;dagogique, bas&eacute;e sur les montants renseign&eacute;s et le bar&egrave;me des revenus 2025. Elle ne tient pas compte des r&eacute;ductions et cr&eacute;dits d&rsquo;imp&ocirc;t, des charges d&eacute;ductibles, des revenus de capitaux, des plus-values ni des d&eacute;ficits fonciers. Elle ne constitue ni un conseil en investissement, ni un engagement contractuel. Valet Capital Partners &mdash; CIF.</p>'
  + '</div></div>'
  + '<section class="info"><h2>Comment l&rsquo;imp&ocirc;t sur le revenu est-il calcul&eacute; ?</h2>'
  + '<p>Le simulateur applique la m&eacute;thode officielle pour les revenus de 2025, d&eacute;clar&eacute;s en 2026, en quatre &eacute;tapes.</p>'
  + '<ol><li><strong>Le revenu net imposable.</strong> Les salaires b&eacute;n&eacute;ficient d&rsquo;une d&eacute;duction de 10 % (minimum 509 &euro;, maximum 14 555 &euro;) ou des frais r&eacute;els. Les micro-entrepreneurs b&eacute;n&eacute;ficient d&rsquo;un abattement forfaitaire de 34 % (micro-BNC), 50 % (micro-BIC services) ou 71 % (micro-BIC ventes), avec un minimum de 305 &euro;. Les loyers en micro-foncier sont abattus de 30 %.</li>'
  + '<li><strong>Le quotient familial.</strong> Le revenu net imposable est divis&eacute; par le nombre de parts du foyer : 1 part pour une personne seule, 2 pour un couple mari&eacute; ou pacs&eacute;, plus 0,5 part pour chacun des deux premiers enfants &agrave; charge et 1 part &agrave; partir du troisi&egrave;me.</li>'
  + '<li><strong>Le bar&egrave;me progressif.</strong> Le revenu par part est impos&eacute; par tranches :</li></ol>'
  + '<table><thead><tr><th>Revenu par part</th><th>Taux</th></tr></thead><tbody><tr><td>Jusqu&rsquo;&agrave; 11 600 &euro;</td><td>0 %</td></tr><tr><td>de 11 600 &agrave; 29 579 &euro;</td><td>11 %</td></tr><tr><td>de 29 579 &agrave; 84 577 &euro;</td><td>30 %</td></tr><tr><td>de 84 577 &agrave; 181 917 &euro;</td><td>41 %</td></tr><tr><td>Au-del&agrave; de 181 917 &euro;</td><td>45 %</td></tr></tbody></table>'
  + '<p>L&rsquo;imp&ocirc;t obtenu est ensuite multipli&eacute; par le nombre de parts. L&rsquo;avantage procur&eacute; par les parts li&eacute;es aux enfants est <strong>plafonn&eacute;</strong> &agrave; 1 807 &euro; par demi-part suppl&eacute;mentaire (plafonds sp&eacute;cifiques pour les parents isol&eacute;s et les veufs avec enfants).</p>'
  + '<p>Enfin, la <strong>d&eacute;cote</strong> r&eacute;duit l&rsquo;imp&ocirc;t des foyers modestes : elle s&rsquo;applique lorsque l&rsquo;imp&ocirc;t est inf&eacute;rieur &agrave; 1 982 &euro; pour une personne seule ou 3 277 &euro; pour un couple.</p>'
  + '<details><summary>Quelle diff&eacute;rence entre taux moyen et tranche marginale ?</summary><p>Le taux moyen est l&rsquo;imp&ocirc;t divis&eacute; par le revenu net imposable. La tranche marginale est le taux appliqu&eacute; au dernier euro gagn&eacute; : c&rsquo;est celle qui d&eacute;termine l&rsquo;imposition d&rsquo;un revenu suppl&eacute;mentaire.</p></details>'
  + '<details><summary>Le r&eacute;sultat est-il identique &agrave; mon avis d&rsquo;imposition ?</summary><p>Non, il s&rsquo;agit d&rsquo;une estimation. Votre avis d&rsquo;imposition tient compte de r&eacute;ductions et cr&eacute;dits d&rsquo;imp&ocirc;t, de charges d&eacute;ductibles et d&rsquo;autres revenus que ce simulateur ne traite pas.</p></details>'
  + '<details><summary>Que faire si mon chiffre d&rsquo;affaires d&eacute;passe le plafond du micro ?</summary><p>Au-del&agrave; de 77 700 &euro; (BNC et BIC services) ou 188 700 &euro; (BIC ventes), le r&eacute;gime micro ne s&rsquo;applique plus. Choisissez alors le r&eacute;gime r&eacute;el et saisissez votre b&eacute;n&eacute;fice net.</p></details>'
  + '<details><summary>Mes donn&eacute;es sont-elles conserv&eacute;es ?</summary><p>Le calcul est effectu&eacute; dans votre navigateur et rien n&rsquo;est envoy&eacute; tant que vous ne demandez pas votre bilan.</p></details>'
  + '</section></div>';

  var root = document.createElement('div'); root.id = 'vcp-root'; root.innerHTML = html; document.body.appendChild(root);

  function $(id){ return document.getElementById(id); }
  function num(id){ var v = parseFloat($(id).value); return isFinite(v) ? v : 0; }
  function eur(n){ return Math.round(n).toLocaleString('fr-FR') + ' €'; }
  function pct(n){ return (Math.round(n*1000)/10).toLocaleString('fr-FR') + ' %'; }
  var last = null;

  function labels(){
    ['1','2'].forEach(function(k){
      var r = $('r'+k).value;
      $('m'+k+'l').textContent = (r==='reel') ? 'Bénéfice net annuel' : 'Chiffre d’affaires annuel';
      $('m'+k).disabled = (r==='aucun');
    });
    $('fvl').textContent = ($('fm').value==='micro') ? 'Loyers bruts annuels' : 'Revenu foncier net annuel';
    $('fv').disabled = ($('fm').value==='aucun');
  }

  function collect(){
    var sit = $('sit').value, marie = (sit==='marie');
    $('seulWrap').style.display = marie ? 'none' : 'block';
    $('d2').style.display = marie ? 'block' : 'none';
    $('t1').textContent = marie ? 'Déclarant 1' : 'Vos revenus';
    $('frw1').style.display = $('fr1').checked ? 'block' : 'none';
    $('frw2').style.display = $('fr2').checked ? 'block' : 'none';
    function decl(k){ return { salaire:num('s'+k), fraisReels: $('fr'+k).checked ? num('f'+k) : 0, indepRegime:$('r'+k).value, indepMontant:num('m'+k) }; }
    return { situation: sit, vitSeul: $('seul').checked, enfantsCharge: Math.max(0,Math.floor(num('nbE'))), enfantsAlternee: Math.max(0,Math.floor(num('nbA'))),
      declarants:[decl('1'),decl('2')], foncierMode:$('fm').value, foncierMontant:num('fv') };
  }

  function render(){
    labels();
    var f = collect(), r = IR.calculer(f); last = {f:f, r:r};
    $('errs').innerHTML = r.erreurs.map(function(e){ return '<div class="err">'+e+'</div>'; }).join('');
    $('o_imp').textContent = eur(r.impot);
    $('o_tm').textContent = pct(r.tauxMoyen);
    $('o_tmi').textContent = pct(r.tmi);
    $('o_parts').textContent = String(r.parts).replace('.', ',');
    $('o_rev').textContent = eur(r.revenuNetImposable);
    $('o_brut').textContent = eur(r.impotBrut);
    $('o_qf').textContent = (r.parts===r.partsBase) ? '—' : '- ' + eur(r.avantageRetenu);
    $('o_dec').textContent = r.decote>0 ? '- ' + eur(r.decote) : '—';
    $('o_cehrw').style.display = r.cehr>0 ? 'flex' : 'none'; $('o_cehr').textContent = '+ ' + eur(r.cehr);
    $('o_psw').style.display = r.foncier.net>0 ? 'flex' : 'none'; $('o_ps').textContent = eur(r.psFoncier);
    var notes = '';
    if(r.plafonne){ notes += '<div class="note">Le plafonnement du quotient familial s&rsquo;applique : l&rsquo;avantage est limit&eacute; &agrave; ' + eur(r.plafondQF) + ' (avantage th&eacute;orique : ' + eur(r.avantageQF) + ').</div>'; }
    r.notes.forEach(function(n){ notes += '<div class="note">'+n+'</div>'; });
    if(r.impot===0 && r.revenuNetImposable>0){ notes += '<div class="good">Votre foyer n&rsquo;est pas imposable selon cette simulation.</div>'; }
    $('o_notes').innerHTML = notes;
    $('o_tr').innerHTML = r.detailTranches.map(function(t){
      var bornes = t.a===Infinity ? 'au-del&agrave; de ' + Math.round(t.de).toLocaleString('fr-FR') + ' &euro;' : Math.round(t.de).toLocaleString('fr-FR') + ' &agrave; ' + Math.round(t.a).toLocaleString('fr-FR') + ' &euro;';
      return '<tr><td>'+bornes+'</td><td>'+pct(t.taux)+'</td><td>'+eur(t.impot)+'</td></tr>';
    }).join('') || '<tr><td colspan="3" style="font-family:Inter">Aucune tranche impos&eacute;e</td></tr>';
  }

  root.addEventListener('input', render); root.addEventListener('change', render);

  $('g_b').addEventListener('click', function(){
    var err = $('g_err'); err.style.display='none';
    var p=$('g_p').value.trim(), n=$('g_n').value.trim(), e=$('g_e').value.trim();
    if(!p||!n||!/^[^@ ]+@[^@ ]+[.][^@ ]+$/.test(e)){ err.textContent='Merci de renseigner votre prénom, votre nom et un e-mail valide.'; err.style.display='block'; return; }
    if(!$('g_c').checked){ err.textContent='Merci de cocher la case de consentement.'; err.style.display='block'; return; }
    var r = last.r, f = last.f, b = $('g_b'); b.disabled=true; b.textContent='Envoi...';
    var payload = { formType:'impot', dateSoumission:new Date().toISOString(), prenom:p, nom:n, email:e, telephone:$('g_t').value.trim(), consentement:true,
      situation:f.situation, parts:r.parts, enfantsCharge:f.enfantsCharge, enfantsAlternee:f.enfantsAlternee,
      revenuNetImposable:r.revenuNetImposable, impotEstime:r.impot, tauxMoyen:Math.round(r.tauxMoyen*1000)/10, tmi:Math.round(r.tmi*100),
      avantageQF:Math.round(r.avantageRetenu), decote:Math.round(r.decote), anneeRevenus:IR.P.annee,
      salaire1:f.declarants[0].salaire, salaire2:(f.situation==='marie')?f.declarants[1].salaire:0,
      independants:(f.declarants[0].indepMontant||0)+((f.situation==='marie')?(f.declarants[1].indepMontant||0):0),
      fonciers:f.foncierMontant, regimeFoncier:f.foncierMode };
    fetch(ENDPOINT_URL, { method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body:JSON.stringify(payload) })
      .then(function(){ $('gateForm').style.display='none'; $('g_ok').style.display='block'; })
      .catch(function(){ err.textContent='Une erreur est survenue. Merci de réessayer.'; err.style.display='block'; b.disabled=false; b.textContent='Recevoir mon bilan'; });
  });
  render();
})();
