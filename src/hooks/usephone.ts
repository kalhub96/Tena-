export const normalizeEthiopianMobile = (raw: string) => {
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('251')) d = d.slice(3);
  if (d.startsWith('0')) d = d.slice(1);
  return d.slice(0, 9); // national number, e.g. 912345678
};

export const isValidEthiopianMobile = (national: string) => /^[97]\d{8}$/.test(national);

export const detectCarrier = (national: string) =>
  national.startsWith('9') ? 'Ethio Telecom' : national.startsWith('7') ? 'Safaricom Ethiopia' : null;