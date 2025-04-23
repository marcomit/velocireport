import pdf from '@/syntax/veloci-js';
import veloci from '@/syntax/components';

export default async (ctx: any) => {
  const invoice = ctx.data.fattureData;
  // const invoice = await ctx.loader.fattureData();
  let id = ctx.request.query.id;
  return pdf
    .div(
      pdf
        .div(
          pdf.h1(id),
          pdf
            .div(
              pdf
                .img()
                .$(
                  'src',
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKhJ9vY-WJviH34cgDfbG2Hn_cBf0t5BBmaWrmH--NzBO3pjGP6hjV7pb8s958ug9K7p6iR-3vz6nlw7c4i5ZdMw',
                )
                .$('class', 'logoImage'),
              pdf
                .div(
                  pdf.h2('DANITEC DISTRIBUZIONE').$('class', 'company__name'),
                  pdf
                    .p(
                      "Commercio all'ingrosso di materiale per l'illuminazione",
                    )
                    .$('class', 'text-header-small'),
                  pdf
                    .p('Via Settevalli, 111 - 06129 Perugia')
                    .$('class', 'text-header-small'),
                  pdf
                    .p('Cell. 347.6496994 - P.IVA 03630700544')
                    .$('class', 'text-header-small'),
                  pdf
                    .p('Email: danitecdistribuzione@gmail.com')
                    .$('class', 'text-header-small'),
                )
                .$('class', 'header'),
              veloci.grid(
                6,
                [
                  {
                    value: pdf
                      .div(pdf.p('Fattura immediata').$('class', 'font-bold'))
                      .$('class', 'flex justify-center items-center h-full'),
                    colSpan: 6,
                  },
                  {
                    value: pdf
                      .div(pdf.p(invoice._id).$('class', ''))
                      .$('class', 'flex justify-center items-center h-full'),
                    colSpan: 3,
                  },
                  {
                    value: pdf
                      .div(
                        pdf
                          .p(new Date(invoice.data).toLocaleDateString('en-GB'))
                          .$('class', ''),
                      )
                      .$('class', 'flex justify-center items-center h-full'),
                    colSpan: 2,
                  },
                  {
                    value: pdf
                      .div(pdf.p('').$('class', ''))
                      .$('class', 'flex justify-center items-center h-full'),
                  },
                ],
                'gap-none',
                'border-thin',
                'padding-sm',
              ),
            )
            .$('class', 'flex justify-around my-4'),
          pdf
            .div(
              veloci.grid(
                2,
                [
                  {
                    value: veloci.grid(
                      2,
                      [
                        {
                          apex: 'Spedizione: ',
                          value: '',
                        },
                        {
                          apex: 'Consegna: ',
                          value: '',
                        },
                        {
                          apex: 'Colli: ',
                          value: '',
                        },
                        {
                          apex: 'Causale del trasporto: ',
                          value: '',
                        },
                        {
                          colSpan: 2,
                          apex: 'Aspetto esteriore dei beni',
                          value: '',
                        },
                      ],
                      'border-thin',
                      'gap-none',
                      'padding-sm',
                    ),
                    colSpan: 1,
                    variant: ['border-none', 'padding-none'],
                  },
                  {
                    value: pdf.div(
                      pdf.p(invoice.anagrafica.cliente.descrizione),
                      pdf.p(invoice.spedizione.destinazione.indirizzo),
                      pdf.p(
                        `${invoice.spedizione.destinazione.cap} ${invoice.spedizione.destinazione.localita} (${invoice.spedizione.destinazione.provincia})`,
                      ),
                      pdf.p(invoice.spedizione.destinazione.localita),
                      pdf.p(invoice.spedizione.destinazione.paese.descrizione),
                    ),
                    colSpan: 1,
                  },
                  {
                    value: veloci.grid(
                      2,
                      [
                        {
                          apex: 'Modalita pagamento',
                          value: invoice.pagamento.dettaglio.modalita,
                          colSpan: 2,
                        },
                        {
                          apex: 'Banca di appoggio',
                          value: '',
                          colSpan: 2,
                        },
                        {
                          apex: 'Nostro riferimento',
                        },
                        {
                          apex: 'Vostro riferimento',
                        },
                        {
                          apex: 'Nostre coordinate bancarie',
                          colSpan: 2,
                        },
                      ],
                      'gap-none',
                      'border-thin',
                      'padding-sm',
                    ),
                    variant: ['border-none', 'padding-none'],
                  },
                  {
                    variant: ['border-none'],
                  },
                ],
                'gap-md',
                'border-thin',
                'padding-sm',
              ),
            )
            .$('class', 'mx-3 '),
        )
        .$('id', 'header'),
      pdf
        .div(
          veloci
            .table(
              invoice.righe,
              {
                columns: [
                  {
                    name: 'Articolo',
                    value: 'prodotto.codice',
                  },
                  {
                    name: 'Descrizione',
                    value: 'descrizione',
                  },
                  {
                    name: "Quantita'",
                    value: 'quantita',
                  },
                  {
                    name: 'UM',
                    value: 'unitaMisura',
                  },
                  {
                    name: 'Valore unit.',
                    value: 'valore.prezzoUnitario',
                  },
                  {
                    name: 'Sconto',
                    value: 'valore.sconto1',
                  },
                  {
                    name: 'Imponibile',
                    value: 'valore.prezzoTotale',
                  },
                  {
                    name: 'Iva',
                    value: (riga: any) => riga.aliquotaIva.codice + '%',
                  },
                ],
              },
              'border-gray',
              'header-dark',
              'padding-sm',
            )
            .$('class', 'w-full grow')
            .$('id', 'mainTable'),
          pdf.div().$('class', 'h-full')
        )
        .$('class', 'mt-2 mx-3 flex-grow'),
      pdf
        .div(
          veloci.grid(
            2,
            [
              {
                apex: 'Totale netto merce',
                value: '',
              },
              {
                apex: 'Totale netto servizi',
                value: '',
              },
              {
                apex: 'Spese bolli',
                value: '',
              },
              {
                apex: 'Spese incasso',
                value: '',
              },
              {
                apex: 'Spese spedizione/imballo',
                value: '',
              },
              {
                apex: 'Altre spese',
                value: '',
              },
              {
                apex: 'Ulteriori sconti',
                value: '',
              },
              {
                apex: 'Totale omaggi',
                value: '',
              },
              {
                apex: 'Acconti',
                value: '',
              },
              {
                apex: 'Abbuoni',
                value: '',
              },
            ],
            'gap-none',
            'border-thin',
            'cells-zebra',
            'padding-sm',
          ),
          // veloci.grid(4, [{}], 'border-thick'),
        )
        .$('class', 'flex')
        .$('id', 'footer'),
      pdf.h1().$('id', 'logger').$('class', 'text-xl'),
    )
    .$('class', 'min-h-screen h-full flex flex-col')
    .$('id', 'main');
};


export async function after() {
  function print(...texts: string[]) {
    const logger = document.getElementById('logger')!;
    logger.innerText = '';
    logger.innerText += texts.join(' ');
  }
  const main = document.getElementById('main')!;
  const rect = document.body.getBoundingClientRect()
  print(JSON.stringify(rect))
  // const PDFH = 3508;
  // const PDFW = 2480;
  // let canvasDiv = document.getElementById('main');
  // let canvas = document.createElement('canvas');
  //
  // canvas.height = PDFH;
  //
  // canvas.classList.add('absolute', 'w-full', 'border-2');
  // canvasDiv?.appendChild(canvas);
  // let table = document.getElementById('mainTable')!;
  // let tableRect = table.getBoundingClientRect();
  // let footer = document.getElementById('footer')!;
  // let footerRect = footer.getBoundingClientRect();
  // let header = document.getElementById('header')!;
  // let headerRect = header.getBoundingClientRect();
  // let cH = PDFH - footerRect.height - headerRect.height;
  // tableRect.height = cH;
  // table.classList.add(`height-[${cH}px]`);
  // let ctx = canvas.getContext('2d')!;
  // ctx.lineWidth = 1;
  // ctx.beginPath();
  // ctx.moveTo(0, canvas.height);
  // ctx.lineTo(canvas.width, 0);
  // ctx.stroke();
  // print(cH.toString(), canvas.height.toString());
}

