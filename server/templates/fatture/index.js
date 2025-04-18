import pdf from "@/syntax/veloci-js";
import veloci from "@/syntax/components";

export default async (content) => {
  const invoice = {
    _id: "FT2025/000001_C1",
    _rev: "1-e57aa29943ea54be5b54e83315385ea8",
    righe: [
      {
        rigaDescrittiva: false,
        prodotto: { codice: "55" },
        descrizione: "ROLLABILLY",
        quantita: 1,
        unitaMisura: "pz",
        sconti: "",
        aliquotaIva: {
          codice: "22",
          valore: 22,
          descrizione: "22%",
          tipoApplicazione: "banco",
        },
        valore: {
          listino: { codice: "L1", descrizione: "Listino Base", ivato: true },
          sconto1: "",
          sconto2: "",
          sconto3: "",
          sconto4: "",
          prezzoUnitario: 9.9,
          prezzoTotale: 9.9,
          prezzoNettoUnitario: 8.1148,
          prezzoNettoTotale: 8.1148,
          importoUnitario: 9.9,
          importoTotale: 9.9,
          importoNettoUnitario: 8.1148,
          importoNettoTotale: 8.1148,
        },
      },
    ],
    editInfo: { dataCreazione: "2025-03-21T15:45:46.663Z" },
    codice: "FT2025/000001_C1",
    data: "2025-03-21T15:45:46.538Z",
    tipoDocumento: {
      codice: "fatturaImmediataC",
      descrizione: "Fattura Immediata Cassa",
      tipoDocumento: "fatturaImmediata",
      nomeReport: "fatturaImmediata_01",
      visualizzaCliente: true,
      visualizzaFornitore: false,
      infoSpedizione: true,
      infoPagamento: true,
      inserimentoManuale: false,
      numeratore: "immediata",
      magazzino: "mag01",
      causale: "venditaDdt",
      ordine: 0,
      xml: { tipo: "TD01", generazioneAutomatica: true, invioAutomatico: true },
    },
    anagrafica: {
      cliente: {
        codice: "CL0066",
        descrizione: "ARUBA POSTA ELETTRONICA CERTIFICATA S.P.A. ",
        amministrativi: {
          codiceFiscale: "01879020517",
          partitaIva: "01879020517",
          cliente: true,
          fornitore: false,
          naturaGiuridica: "02",
          listino: { codice: "L1", descrizione: "Listino Base", ivato: true },
          sconti: {},
          pagamento: { condizioni: "TP02", dettaglio: { modalita: "MP05" } },
        },
        fatturazione: {
          codiceSdi: "KRRH6B9",
          paese: { codice: "IT", descrizione: "Italia" },
          fatturaImmediata: true,
          fatturaDifferita: true,
          scontrinoSegueFattura: true,
        },
      },
    },
    pagamento: {
      condizioni: "TP02",
      dettaglio: { modalita: "MP01" },
      codiceXml: "MP01",
    },
    spedizione: {
      destinazione: {
        tipo: { codice: "principale", descrizione: "Sede" },
        indirizzo: "VIA SAN CLEMENTE 53",
        localita: "PONTE SAN PIETRO",
        cap: "24036",
        provincia: "BG",
        nazione: "IT",
        nomeNazione: "Italia",
        nomeProvincia: "",
        telefono: "",
        email: "damiano.bacci@gmail.com",
        paese: { codice: "IT", descrizione: "Italia" },
        codice: "e70671458f565ad6225452a2c6e072f1",
        cellulare: "3333333333",
        messaggi: [
          {
            mittente: { numero: "+14155238886", name: "WhatsApp Sandbox" },
            destinatari: [{ nome: "Sede", numero: "3333333333" }],
            messaggio: "dd",
          },
          {
            mittente: { numero: "+14155238886", name: "WhatsApp Sandbox" },
            destinatari: [{ nome: "Sede", numero: "3333333333" }],
            messaggio: "cc",
          },
          {
            mittente: { numero: "+14155238886", name: "WhatsApp Sandbox" },
            destinatari: [{ nome: "Sede", numero: "3333333333" }],
            messaggio: "11",
          },
        ],
      },
    },
    totali: {
      iva_22: {
        merce: 8.11,
        spese: 0,
        imponibile: 8.11,
        ivaCodice: "22",
        iva: 1.79,
        ivaOmaggi: 0,
        importoOmaggi: 0,
        importo: 9.9,
        aliquota: "22",
        quantita: 1,
      },
      generale: {
        imponibile: 8.11,
        nettoMerce: 8.11,
        totaleMerce: 8.11,
        spese: 0,
        iva: 1.79,
        importo: 9.9,
        quantita: 1,
        speseDocumentate: 0,
      },
    },
    spese: [
      { codice: "BANCARIE", descrizione: "Spese bancarie", valore: 0 },
      { codice: "IMBALLAGGIO", descrizione: "Spese imballaggio", valore: 0 },
      { codice: "TRASPORTO", descrizione: "Spese trasporto", valore: 0 },
      { codice: "TRASPORTO", descrizione: "Spese corriere", valore: 0 },
      { codice: "ALTRE", descrizione: "Altre spese", valore: 0 },
    ],
    scadenze: [{ data: "21/03/2025", importo: 9.9 }],
  };

  const items = invoice.righe || [];

  const createItemRows = (item) =>
    pdf.tr(
      pdf.td(JSON.stringify(item)),
      pdf.td(item.prodotto.codice || "").$("class", "item__code"),
      pdf.td(item.descrizione || "").$("class", "item__desc")
      // pdf.td(item.quantita || "").$("class", "item__qty"),
      // pdf.td(item.um || "").$("class", "item__um"),
      // pdf.td(`€ ${item.valoreUnitario?.toFixed(2)}`).$("class", "item__unit"),
      // pdf.td(`${item.sconto || 0}%`).$("class", "item__discount"),
      // pdf.td(`€ ${item.imponibile?.toFixed(2)}`).$("class", "item__imponibile"),
      // pdf.td(`${item.iva || 0}%`).$("class", "item__iva")
    );

  const createTotalRow = () => {
    const totalImponibile = items
      .reduce((acc, i) => acc + (i.imponibile || 0), 0)
      .toFixed(2);
    const totalIVA = items
      .reduce((acc, i) => acc + ((i.imponibile || 0) * (i.iva || 0)) / 100, 0)
      .toFixed(2);
    const total = (parseFloat(totalImponibile) + parseFloat(totalIVA)).toFixed(
      2
    );

    return pdf.tbody(
      pdf.tr(
        pdf.td("Totali").$("colspan", 6),
        pdf.td(`€ ${totalImponibile}`).$("class", "total__imponibile"),
        pdf.td(`€ ${totalIVA}`).$("class", "total__iva")
      ),
      pdf.tr(
        pdf.td("Totale da pagare").$("colspan", 7),
        pdf.td(`€ ${total}`).$("class", "total__final")
      )
    );
  };

  return pdf.div(
    // HEADER
    // pdf.div(JSON.stringify(invoice)),
    pdf
      .div(
        pdf
          .div(
            pdf.h2("DANITEC DISTRIBUZIONE").$("class", "company__name"),
            pdf.p("Commercio all'ingrosso di materiale per l'illuminazione"),
            pdf.p("Via Settevalli, 111 - 06129 Perugia"),
            pdf.p("Cell. 347.6496994 - P.IVA 03630700544"),
            pdf.p("Email: danitecdistribuzione@gmail.com")
          )
          .$("class", "header"),
        veloci.grid(
          6,
          [
            {
              value: "",
              description: pdf
                .div(pdf.p("Fattura immediata").$("class", "font-bold"))
                .$("class", "flex justify-center items-center h-full"),
              colSpan: 6,
            },
            {
              value: "numero",
              description: pdf
                .div(pdf.p(invoice._id).$("class", ""))
                .$("class", "flex justify-center items-center h-full"),
              colSpan: 3,
            },
            {
              value: "del",
              description: pdf
                .div(
                  pdf
                    .p(new Date(invoice.data).toLocaleDateString("en-GB"))
                    .$("class", "")
                )
                .$("class", "flex justify-center items-center h-full"),
              colSpan: 2,
            },
            {
              value: "pag",
              description: pdf
                .div(pdf.p("").$("class", ""))
                .$("class", "flex justify-center items-center h-full"),
            },
          ],
          "gap-none",
          "border-thin",
          "padding-sm"
        )
      )
      .$("class", "flex justify-around my-4"),
    pdf
      .div(
        veloci.grid(
          2,
          [
            {
              value: "",
              description: veloci.grid(2, [
                {
                  value: "",
                  description: pdf.div(
                    "spedizione: ",
                    invoice.spedizione.destinazione.paese.descrizione
                  ),
                },
                {
                  value: "",
                  description: pdf.div(
                    "spedizione: ",
                    invoice.spedizione.destinazione.codice
                  ),
                },
                {
                  value: "",
                  description: pdf.div(
                    "spedizione: ",
                    invoice.spedizione.destinazione.paese.descrizione
                  ),
                },
                {
                  value: "",
                  description: pdf.div(
                    "spedizione: ",
                    invoice.spedizione.destinazione.paese.descrizione
                  ),
                },
                {
                  value: "",
                  colSpan: 2,
                  description: pdf.div(
                    "spedizione: ",
                    invoice.spedizione.destinazione.paese.descrizione
                  ),
                },
              ]),
              colSpan: 1,
            },
            {
              valure: "",
              description: "aaaaaaa",
              colSpan: 1,
            },
            {
              value: "",
              description: veloci.grid(
                2,
                [
                  {
                    description: "",
                  },
                  {
                    description: "",
                  },
                ],
                "basic"
              ),
            },
            {
              variant: ["border-none"],
            },
          ],
          "gap-md",
          "border-thick",
          "padding-sm"
        )
      )
      .$("class", "mx-3 ")

    // veloci.table(
    //   invoice.righe,
    //   {
    //     columns: [
    //       {
    //         name: "Spedizione",
    //         value: (r) => (r.descrizione == undefined ? "a" : "b"),
    //       },
    //       {
    //         name: "22222",
    //         value: "descrizione",
    //       },
    //       {
    //         name: "Spediz3333ione",
    //         value: "prodotto.codice",
    //       },
    //     ],
    //   },
    //   "border-md",
    //   "border-gray",
    //   "header-light",
    //   "padding-lg",
    //   "rounded-md"
    // ),
  );
};
