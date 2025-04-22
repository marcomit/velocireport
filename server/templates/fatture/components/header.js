import pdf from '../../src/engines/veloci-js';

export default () => {
  return pdf
    .div(
      pdf.span().$('class', 'pageNumber'),
      '/',
      pdf.span().$('class', 'totalPages'),
    )
    .$('id', 'header-page')
    .$('style', 'font-size:10px; color:#808080; padding-left:10px');
};
