const numeral = require('numeral');

function isFloat(value: Number) {
  if (
    typeof value === 'number' &&
    !Number.isNaN(value) &&
    !Number.isInteger(value)
  ) {
    return true;
  }

  return false;
}

const formatCurrency = (
  amount: Number,
  currency: string,
  roundDownKHR = false
) => {
  switch (currency) {
    case 'KHR':
      if (roundDownKHR) {
        const convertN = numeral(amount).format('0');
        if (convertN.length < 3) {
          return `${numeral(0).format('0,00')}៛`;
        }
        const round = `${`${convertN}`.slice(0, -2)}00`;
        return `${numeral(round).format('0,00')}៛`;
      }
      return `${numeral(amount).format('0,00')}៛`;
    case 'Riel':
      return `${numeral(amount).format('0,00')}៛`;
    case 'USD':
      return numeral(amount).format('$0,0.00');

    default:
      return isFloat(amount)
        ? numeral(amount).format('0,0.00')
        : numeral(amount).format('0,0');
  }
};

export { formatCurrency };
