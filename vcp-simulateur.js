function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Date', 'Objectif', 'Statut pro', 'Revenus foyer (€)', 'Prénom', 'Nom',
      'Email', 'Téléphone', 'Consentement', 'Patrimoine actuel',
      'Épargne mensuelle', 'Horizon (ans)', 'Âge', 'Profil',
      'Patrimoine estimé', 'Situation familiale', 'Enfants à charge',
      'Parts fiscales', 'TMI', 'Économie fiscale potentielle',
      'Statut suivi', 'Notes'
    ]);
  }

  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(data.dateSoumission),
    data.objectif,
    data.statutPro,
    data.revenusFoyer,
    data.prenom,
    data.nom,
    data.email,
    data.telephone,
    data.consentement,
    data.patrimoineActuel,
    data.epargneMensuelle,
    data.horizon,
    data.age,
    data.profil,
    data.patrimoineEstime,
    data.situationFamiliale,
    data.enfantsACharge,
    data.partsFiscales,
    data.tmi,
    data.economieFiscalePotentielle,
    'Nouveau',
    ''
  ]);

  var lastRow = sheet.getLastRow();

  try {
    var destinataire = 'arnaud.garnier14@gmail.com';

    var sujet = 'Nouveau lead patrimonial : ' + data.prenom + ' ' + data.nom;

    var corps =
      'Nouveau lead reçu sur le simulateur patrimonial.\n\n' +
      'Prénom : ' + data.prenom + '\n' +
      'Nom : ' + data.nom + '\n' +
      'Email : ' + data.email + '\n' +
      'Téléphone : ' + data.telephone + '\n\n' +
      'Objectif : ' + data.objectif + '\n' +
      'Statut
